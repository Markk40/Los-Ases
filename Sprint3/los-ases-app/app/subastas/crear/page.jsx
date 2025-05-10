"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createAuction, getAllCategories } from "../../utils/api";
import styles from "./styles.module.css";

export default function CreateAuction() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    closing_date: "",
    thumbnail: null,    // null para file
    price: "",
    stock: "",
    rating: "",
    category: "",
    brand: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files[0];
      // Validar que el archivo es una imagen
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (file && !allowedTypes.includes(file.type)) {
        setError("Solo se permiten imágenes en formato JPEG, PNG o WebP.");
        return;
      }
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // 1) Validar campos obligatorios
  const required = ["title", "description", "closing_date", "thumbnail", "price"];
  if (required.some(field => !formData[field])) {
    setError("Por favor, completa todos los campos obligatorios.");
    return;
  }

  // Validar que el thumbnail sea un archivo válido
  if (formData.thumbnail && !(formData.thumbnail instanceof File)) {
    setError("No se ha seleccionado una imagen válida.");
    return;
  }

  // 2) Montar FormData para multipart/form-data
  const payload = new FormData();
  payload.append("title", formData.title);
  payload.append("description", formData.description);
  payload.append("closing_date", new Date(formData.closing_date).toISOString());
  payload.append("thumbnail", formData.thumbnail);  // Asegúrate de que sea un archivo
  payload.append("price", formData.price);
  payload.append("stock", formData.stock);
  payload.append("rating", formData.rating);
  payload.append("category", formData.category);
  payload.append("brand", formData.brand);

  try {
    await createAuction(payload);
    router.push("/subastas");
  } catch (err) {
    console.error(err);
    setError("Error al crear la subasta.");
  }
};


  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Crear Nueva Subasta</h2>
          {error && <p className={styles.error}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Título */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Título:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Descripción */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>

            {/* Fecha de cierre */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Fecha de cierre:</label>
              <input
                type="datetime-local"
                name="closing_date"
                value={formData.closing_date}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Imagen */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Imagen:</label>
              <input
                type="file"
                name="thumbnail"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Precio */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Precio de salida (€):</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Stock */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Valoración */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Valoración:</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* Categoría */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Categoría:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Selecciona una categoría</option>
                {Array.isArray(categories.results) &&
                  categories.results.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Marca */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Marca:</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitBtn}>
                Crear Subasta
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
