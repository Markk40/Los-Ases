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
    thumbnail: null,
    price: "",
    stock: "",
    rating: "",
    category: "",
    brand: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files[0];
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (file && !allowed.includes(file.type)) {
        setError("Solo JPEG, PNG o WebP.");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1) Campos obligatorios
    const required = ["title", "description", "closing_date", "thumbnail", "price"];
    if (required.some((f) => !formData[f])) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // 2) Prepara el objeto plano
    let isoDate;
    try {
      const d = new Date(formData.closing_date);
      if (isNaN(d.getTime())) throw new Error();
      isoDate = d.toISOString();
    } catch {
      setError("Fecha de cierre inválida.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      closing_date: isoDate,
      thumbnail: formData.thumbnail, // File
      price: formData.price,
      stock: formData.stock,
      rating: formData.rating,
      category: formData.category,
      brand: formData.brand,
    };

    // 3) Llama a createAuction (que construye el FormData)
    try {
      await createAuction(payload);
      router.push("/subastas");
    } catch (err) {
      console.error(err);
      setError("Error al crear la subasta: " + err.message);
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>

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
                  categories.results.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

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
