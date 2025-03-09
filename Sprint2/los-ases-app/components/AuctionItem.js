import React from "react";
import styles from "./AuctionItem.module.css"; // Si tienes un archivo CSS para este componente

export default function AuctionItem({ car }) {
  return (
    <div
      className={styles.auctionItem}
      onClick={() =>
        window.location.href = `/detalles/${encodeURIComponent(car.id)}`
      }
    >
      <img src={`/${car.img}`} alt={`${car.brand} ${car.model}`} />
      <div className={styles.auctionDetails}>
        <h3 className={styles.auctionDetailsTitle}>{`${car.brand} ${car.model}`}</h3>
        <p className={styles.auctionDetailsText}>
          Precio actual: {car.price.toLocaleString()}€
        </p>
        <p className={styles.auctionDetailsText}>Tiempo restante: {car.timeLeft}</p>
        <button>Pujar</button>
      </div>
    </div>
  );
}
