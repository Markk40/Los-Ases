"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuctionItem from "@/components/AuctionItem";
import { getAllAuctions, getAllBids } from "../../utils/api";
import styles from "./styles.module.css";

export default function UserAuctions() {
  const [userAuctions, setUserAuctions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchAuctionsAndBids = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
  
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentUserId = payload.user_id || payload.id;
  
        setUserId(currentUserId);
  
        const [auctionData, bidData] = await Promise.all([
          getAllAuctions(),
          getAllBids(),
        ]);
  
        const filtered = auctionData.results.filter(
          (auction) => auction.auctioneer === currentUserId
        );
  
        setUserAuctions(filtered);
        setBids(bidData); // 👈 Aquí añadimos todas las pujas
      } catch (error) {
        console.error("Error cargando subastas o pujas:", error);
      }
    };
  
    fetchAuctionsAndBids();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <h2 className={styles.title}>Mis Subastas</h2>
            {userAuctions.length === 0 ? (
              <p className={styles.emptyMessage}>
                No has creado ninguna subasta todavía.
              </p>
            ) : (
              <div className={styles.auctionList}>
                {userAuctions.map((auction) => (
                  <AuctionItem key={auction.id} car={auction} bids={bids}/>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
