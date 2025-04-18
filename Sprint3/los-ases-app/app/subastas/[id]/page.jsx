"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getAuctionById, deleteAuction, createBid, getBidsByAuction } from "../../utils/api";
import styles from "./styles.module.css";

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState(null); // Variable para almacenar datos del usuario
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAuctionById(id);
        setCar(data);
  
        const bidsData = await getBidsByAuction(id);
        setBids(bidsData);
  
        const token = localStorage.getItem("accessToken");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userId = payload.user_id || payload.id;
          if (userId) {
            setIsUserLoggedIn(true);
            setUser(payload);
          }
        }
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

    if (!isUserLoggedIn) {
      setBidError("Debes estar logeado para pujar.");
      return;
    }

    // Extraer user ID del JWT
    const token = localStorage.getItem("accessToken");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.user_id || payload.id;
    if (!userId) {
      setBidError("No se pudo obtener el ID del usuario.");
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= car.price) {
      setBidError(`La puja debe ser mayor que ${car.price}€`);
      return;
    }

    try {
      await createBid(car.id, { price: bidValue, bidder: userId }, token);
      setSuccessMsg("¡Puja realizada con éxito!");

      // recargar subasta actualizada desde el backend
      const updatedAuction = await getAuctionById(car.id);
      setCar(updatedAuction);
      const updatedBids = await getBidsByAuction(car.id);
      setBids(updatedBids);

      setBidAmount("");
    } catch (err) {
      console.error("Error al pujar", err);
      setBidError(err.message || "Hubo un error al procesar la puja.");
    }
  };

  if (!car) return <div className={styles.loading}>Cargando...</div>;

  const isOwner = user && car.auctioneer === user.user_id;
  const isAdmin = user && user.is_staff;

  const highestBid = bids.length > 0 ? Math.max(...bids.map(b => parseFloat(b.price))) : null;
  const displayedPrice = highestBid ?? car.price;
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
            <li>Precio: {displayedPrice}€</li>
            <li>Stock: {car.stock}</li>
            <li>Valoración: {car.rating}</li>
            <li>Fecha de cierre: {new Date(car.closing_date).toLocaleString()}</li>
          </ul>
        </div>

        {isUserLoggedIn && (
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
        )}

        {(isOwner || isAdmin) && (
          <div className={styles.actions}>
            <button className={styles.btnEdit} onClick={() => router.push(`/subastas/${id}/editar`)}>Editar</button>
            <button className={styles.btnDelete} onClick={handleDelete}>Eliminar</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
