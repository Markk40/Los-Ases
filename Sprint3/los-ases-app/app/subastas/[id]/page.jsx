"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getAuctionById, deleteAuction, createBid } from "../../utils/api";
import styles from "./styles.module.css";

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAuctionById(id);
        setCar(data);
      } catch (err) {
        console.error("Error al cargar la subasta", err);
      }
    }
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar esta subasta?");
    if (confirmed) {
      try {
        await deleteAuction(id);
        router.push("/subastas");
      } catch (err) {
        console.error("Error al eliminar la subasta", err);
      }
    }
  };

  const handleBid = async () => {
    setBidError("");
    setSuccessMsg("");

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setBidError("Debes estar logeado para pujar.");
      return;
    }

    // Extraer username del JWT
    const payload = JSON.parse(atob(token.split(".")[1]));
    const username = payload.username || payload.name || payload.sub;
    if (!username) {
      setBidError("No se pudo obtener el nombre del usuario.");
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= car.price) {
      setBidError(`La puja debe ser mayor que ${car.price}€`);
      return;
    }

    try {
      await createBid(car.id, { price: bidValue, bidder: username }, token);
      setSuccessMsg("¡Puja realizada con éxito!");
      setCar({ ...car, price: bidValue });
      setBidAmount("");
    } catch (err) {
      console.error("Error al pujar", err);
      setBidError("Hubo un error al procesar la puja.");
    }
  };

  if (!car) return <div className={styles.loading}>Cargando...</div>;

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <a href="/subastas" className={styles.backBtn}>&#10094; Atrás</a>
        <h2 className={styles.carTitle}>{car.title}</h2>
        <img
          src={car.thumbnail.startsWith("/") ? car.thumbnail : `/${car.thumbnail}`}
          alt={car.title}
          className={styles.mainImage}
        />

        <div className={styles.carSpecs}>
          <h3 className={styles.specsTitle}>Detalles:</h3>
          <ul>
            <li>Descripción: {car.description}</li>
            <li>Marca: {car.brand}</li>
            <li>Categoría: {car.category}</li>
            <li>Precio: {car.price}€</li>
            <li>Stock: {car.stock}</li>
            <li>Valoración: {car.rating}</li>
            <li>Fecha de cierre: {new Date(car.closing_date).toLocaleString()}</li>
          </ul>
        </div>

        <div className={styles.bidSection}>
          <h4>Pujar en esta subasta</h4>
          <input
            type="number"
            placeholder="Introduce tu puja (€)"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <button className={styles.btnBid} onClick={handleBid}>
            Pujar
          </button>
          {bidError && <p className={styles.error}>{bidError}</p>}
          {successMsg && <p className={styles.success}>{successMsg}</p>}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnEdit} onClick={() => router.push(`/subastas/${id}/editar`)}>Editar</button>
          <button className={styles.btnDelete} onClick={handleDelete}>Eliminar</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
