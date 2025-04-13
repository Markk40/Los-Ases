"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getAllAuctions, getBidsByAuction, deleteBid } from "../../utils/api";
import styles from "./styles.module.css";

export default function MisPujas() {
  const [userBids, setUserBids] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserBids = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Debes iniciar sesión para ver tus pujas.");
          setLoading(false);
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentUserId = payload.user_id || payload.id;
        setUserId(currentUserId);

        const auctionData = await getAllAuctions();
        let allUserBids = [];

        for (const auction of auctionData.results) {
          const rawBids = await getBidsByAuction(auction.id);
          const bids = Array.isArray(rawBids) ? rawBids : rawBids.results || [];

          const userBidsInAuction = bids.filter(
            (bid) => bid.bidder === currentUserId
          );

          userBidsInAuction.forEach((bid) =>
            allUserBids.push({ ...bid, auctionTitle: auction.title, auctionId: auction.id })
          );
        }

        setUserBids(allUserBids);
      } catch (err) {
        console.error("Error al cargar las pujas del usuario:", err);
        setError("No se pudieron cargar las pujas.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBids();
  }, []);

  const handleDelete = async (auctionId, bidId) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta puja?");
    if (!confirmed) return;

    try {
      await deleteBid(auctionId, bidId);
      setUserBids((prev) => prev.filter((b) => b.id !== bidId));
    } catch (err) {
      console.error("Error al eliminar la puja:", err);
      alert("Error al eliminar la puja");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Mis Pujas</h2>

        {loading ? (
          <p>Cargando pujas...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : userBids.length === 0 ? (
          <p>No has realizado ninguna puja todavía.</p>
        ) : (
          <ul className={styles.bidList}>
            {userBids.map((bid) => (
              <li key={bid.id} className={styles.bidItem}>
                <p><strong>Subasta:</strong> {bid.auctionTitle}</p>
                <p><strong>Precio pujado:</strong> {bid.price} €</p>
                <p><strong>Fecha:</strong> {new Date(bid.creation_date).toLocaleString()}</p>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(bid.auctionId, bid.id)}
                >
                  Eliminar puja
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
}
