"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getAuctionById, updateAuction } from "../../../utils/api";
import styles from "./styles.module.css";

export default function EditAuction() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAuction() {
      try {
        const auction = await getAuctionById(id);
        setFormData({
          title: auction.title,
          description: auction.description,
          closing_date: auction.closing_date.slice(0, 16), // formato compatible con input[type="datetime-local"]
          creation_date: auction.creation_date,
          thumbnail: auction.thumbnail,
          price: auction.price,
          stock: auction.stock,
          rating: auction.rating,
          category: auction.category,
          brand: auction.brand,
        });
      } catch (err) {
        setError("No se pudo cargar la subasta.");
      }
    }

    loadAuction();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAuction(id, formData);
      router.push(`/subastas/${id}`);
    } catch (err) {
      setError("Error al guardar los cambios.");
    }
  };

  if (!formData) return <div className={styles.loading}>Cargando...</div>;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.heading}>Editar Subasta</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Título</label>
          <input className={styles.input} type="text" name="title" value={formData.title} onChange={handleChange} />

          <label className={styles.label}>Descripción</label>
          <textarea className={styles.textarea} name="description" value={formData.description} onChange={handleChange} />

          <label className={styles.label}>Fecha límite de cierre</label>
          <input className={styles.input} type="datetime-local" name="closing_date" value={formData.closing_date} onChange={handleChange} />

          <label className={styles.label}>Imagen (URL)</label>
          <input className={styles.input} type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />

          <label className={styles.label}>Precio de salida</label>
          <input className={styles.input} type="number" name="price" value={formData.price} onChange={handleChange} />

          <label className={styles.label}>Stock</label>
          <input className={styles.input} type="number" name="stock" value={formData.stock} onChange={handleChange} />

          <label className={styles.label}>Valoración</label>
          <input className={styles.input} type="number" name="rating" step="0.1" min="1" max="5" value={formData.rating} onChange={handleChange} />

          <label className={styles.label}>Categoría</label>
          <input className={styles.input} type="text" name="category" value={formData.category} onChange={handleChange} />

          <label className={styles.label}>Marca</label>
          <input className={styles.input} type="text" name="brand" value={formData.brand} onChange={handleChange} />

          <button type="submit" className={styles.submitButton}>Guardar Cambios</button>
        </form>
      </div>
      <Footer />
    </>
  );
}
