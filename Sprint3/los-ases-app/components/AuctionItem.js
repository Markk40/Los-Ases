"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./AuctionItem.module.css";

export default function AuctionItem({ car, bids }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(car.price);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsLoggedIn(true);

    const relevantBids = bids.filter(b => b.auction === car.id);
    if (relevantBids.length > 0) {
      const highest = Math.max(...relevantBids.map(b => parseFloat(b.price)));
      setCurrentPrice(highest);
    }
  }, [bids, car.id, car.price]);

  const handleCardClick = () => {
    window.location.href = `/subastas/${encodeURIComponent(car.id)}`;
  };

  const stopPropagation = (e) => e.stopPropagation();

  const calculateTimeLeft = (closingDate) => {
    const diff = new Date(closingDate) - new Date();
    if (diff <= 0) return "Finalizada";

    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className={styles.auctionItem} onClick={handleCardClick}>
      <img
        src={car.thumbnail.startsWith("/") ? car.thumbnail : `/${car.thumbnail}`}
        alt={car.title}
        className={styles.auctionImage}
      />
      <div className={styles.auctionDetails}>
        <h3 className={styles.auctionDetailsTitle}>{car.title}</h3>

        <p className={styles.auctionDetailsText}>
          Precio actual: {currentPrice.toLocaleString()}€
        </p>

        <p className={styles.auctionDetailsText}>
          Tiempo restante: {calculateTimeLeft(car.closing_date)}
        </p>

        {isLoggedIn && (
          <button className={styles.bidButton}>Pujar</button>
        )}

        
      </div>
    </div>
  );
}
