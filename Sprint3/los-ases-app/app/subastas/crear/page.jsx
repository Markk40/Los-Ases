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
      await createAuction(formData);
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

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Título:</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Descripción:</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Fecha de cierre:</label>
              <input type="datetime-local" name="closing_date" value={formData.closing_date} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Imagen (URL):</label>
              <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Precio de salida (€):</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Stock:</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Valoración:</label>
              <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría:</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Selecciona una categoría</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Marca:</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
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
