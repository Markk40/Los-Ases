"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuctionItem from "@/components/AuctionItem";
import { getAllAuctions } from "../../utils/api";
import styles from "./styles.module.css";

export default function UserAuctions() {
  const [userAuctions, setUserAuctions] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentUserId = payload.user_id || payload.id; // ajusta según JWT

        setUserId(currentUserId);

        const data = await getAllAuctions();
        const filtered = data.results.filter(
          (auction) => auction.auctioneer === currentUserId
        );
        setUserAuctions(filtered);
      } catch (error) {
        console.error("Error cargando subastas del usuario:", error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.title}>Mis Subastas</h2>
        {userAuctions.length === 0 ? (
          <p>No has creado ninguna subasta todavía.</p>
        ) : (
          <div className={styles.auctionList}>
            {userAuctions.map((auction) => (
              <AuctionItem key={auction.id} car={auction} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
