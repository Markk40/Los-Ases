"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./styles.module.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchCarDetails() {
      try {
        const response = await fetch("/cars.json");
        const cars = await response.json();
        const selectedCar = cars.find((c) => c.id === id);

        if (selectedCar) {
          setCar(selectedCar);
        } else {
          console.error("Coche no encontrado");
        }
      } catch (error) {
        console.error("Error al cargar los detalles del coche:", error);
      }
    }

    fetchCarDetails();
  }, [id]);

  if (!car) {
    return <h2 className={styles.error}>Coche no encontrado</h2>;
  }

  const moveCarousel = (direction) => {
    const totalImages = car.additionalImages.length + 1;
    setCurrentIndex((prev) => (prev + direction + totalImages) % totalImages);
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <a href="/subastas" className={styles.backBtn}>&#10094; Atrás</a>
        <h2 className={styles.carTitle}>{car.brand} {car.model}</h2>

        <div className={styles.carousel}>
          <div className={styles.carouselImages} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {/* Aquí solo usas la ruta relativa, sin '/fotos_coches/' de nuevo */}
            <img src={`/${car.img}`} alt={car.brand} />
            {car.additionalImages.map((src, index) => (
              <img key={index} src={`/${src}`} alt={`${car.brand} ${car.model}`} />
            ))}
          </div>
          <button className={`${styles.carouselControl} ${styles.left}`} onClick={() => moveCarousel(-1)}>&#10094;</button>
          <button className={`${styles.carouselControl} ${styles.right}`} onClick={() => moveCarousel(1)}>&#10095;</button>
        </div>

        <div className={styles.carSpecs}>
          <h3>Especificaciones Técnicas:</h3>
          <ul>
            {Object.entries(car.details).map(([key, value]) => (
              <li key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}</li>
            ))}
          </ul>
        </div>

        <button className={styles.btnBid}>Pujar</button>
      </div>

      <Footer />
    </div>
  );
}
