"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  getAuctionById,
  deleteAuction,
  createBid,
  getBidsByAuction,
  getRatingsByAuction,
  createRating,
  updateRating,
  deleteRating
} from "../../utils/api";
import styles from "./styles.module.css";

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [bids, setBids] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAuctionById(id);
        setCar(data);
      } catch (err) {
        setLoadError("No se pudo cargar la subasta.");
      }
      try {
        const bidsData = await getBidsByAuction(id);
        setBids(bidsData);
      } catch {}
      try {
        const ratingsData = await getRatingsByAuction(id);
        setRatings(ratingsData);
        const sum = ratingsData.reduce((s, r) => s + r.points, 0);
        setAvgRating(ratingsData.length ? sum / ratingsData.length : 0);
        const token = localStorage.getItem("accessToken");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setIsUserLoggedIn(true);
          setUser(payload);
          const my = ratingsData.find(r => r.reviewer === (payload.user_id || payload.id));
          setUserRating(my || null);
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que quieres eliminar esta subasta?")) {
      await deleteAuction(id);
      router.push("/subastas");
    }
  };

  const handleBid = async () => {
    setBidError("");
    setSuccessMsg("");
    if (!isUserLoggedIn) {
      setBidError("Debes estar logeado para pujar.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.user_id || payload.id;
    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= car.price) {
      setBidError(`La puja debe ser mayor que ${car.price}€`);
      return;
    }
    try {
      await createBid(car.id, { price: bidValue, bidder: userId }, token);
      setSuccessMsg("¡Puja realizada con éxito!");
      const updatedAuction = await getAuctionById(car.id);
      setCar(updatedAuction);
      const updatedBids = await getBidsByAuction(car.id);
      setBids(updatedBids);
      setBidAmount("");
    } catch (err) {
      setBidError(err.message || "Hubo un error al procesar la puja.");
    }
  };

  const handleRate = async points => {
    setRatingError("");
    if (!isUserLoggedIn) {
      setRatingError("Debes estar logeado para valorar.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (userRating) {
      await updateRating(id, userRating.id, points, token);
    } else {
      await createRating(id, points, token);
    }
    const ratingsData = await getRatingsByAuction(id);
    setRatings(ratingsData);
    const sum = ratingsData.reduce((s, r) => s + r.points, 0);
    setAvgRating(ratingsData.length ? sum / ratingsData.length : 0);
    const payload = JSON.parse(atob(token.split(".")[1]));
    const my = ratingsData.find(r => r.reviewer === (payload.user_id || payload.id));
    setUserRating(my || null);
    setShowRating(false);
  };

  const handleDeleteRating = async () => {
    setRatingError("");
    if (!isUserLoggedIn) {
      setRatingError("Debes estar logeado para eliminar tu valoración.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    await deleteRating(id, userRating.id, token);
    const ratingsData = await getRatingsByAuction(id);
    setRatings(ratingsData);
    const sum = ratingsData.reduce((s, r) => s + r.points, 0);
    setAvgRating(ratingsData.length ? sum / ratingsData.length : 0);
    setUserRating(null);
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (loadError) return <div className={styles.error}>{loadError}</div>;

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
            <li>Media de valoraciones: {avgRating.toFixed(2)} ★</li>
            <li>Fecha de cierre: {new Date(car.closing_date).toLocaleString()}</li>
          </ul>
        </div>
        <div className={styles.ratingWrapper}>
          <button className={styles.rateButton} onClick={() => setShowRating(true)}>
            {userRating ? "Editar mi valoración" : "Valorar esta subasta"}
          </button>
          {userRating && (
            <button className={styles.rateButton} onClick={handleDeleteRating}>
              Eliminar mi valoración
            </button>
          )}
        </div>
        {ratingError && <p className={styles.error}>{ratingError}</p>}
        {showRating && (
          <div className={styles.ratingModalBackdrop}>
            <div className={styles.ratingModal}>
              <h3>{userRating ? "Editar valoración" : "¿Cómo valoras esta subasta?"}</h3>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span
                    key={i}
                    className={i <= (hoverRating || userRating?.points || 0) ? styles.starFilled : styles.star}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(i)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button className={styles.rateButton} onClick={() => setShowRating(false)}>
                Cerrar
              </button>
            </div>
          </div>
        )}
        {isUserLoggedIn && (
          <div className={styles.bidSection}>
            <h4>Pujar en esta subasta</h4>
            <input
              type="number"
              placeholder="Introduce tu puja (€)"
              value={bidAmount}
              onChange={e => setBidAmount(e.target.value)}
            />
            <button className={styles.btnBid} onClick={handleBid}>Pujar</button>
            {bidError && <p className={styles.error}>{bidError}</p>}
            {successMsg && <p className={styles.success}>{successMsg}</p>}
          </div>
        )}
        {(isOwner || isAdmin) && (
          <div className={styles.actions}>
            <button className={styles.btnEdit} onClick={() => router.push(`/subastas/${id}/editar`)}>
              Editar
            </button>
            <button className={styles.btnDelete} onClick={handleDelete}>Eliminar</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
