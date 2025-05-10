"use client";
import { useState, useEffect } from "react";
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
    thumbnail: "",
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["title", "description", "closing_date", "thumbnail", "price"];
    const isMissing = requiredFields.some((field) => !formData[field]);

    if (isMissing) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const fixedData = {
        ...formData,
        closing_date: new Date(formData.closing_date).toISOString(),
      };
      await createAuction(fixedData);
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
                type="text"
                name="thumbnail"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                value={formData.thumbnail}
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
