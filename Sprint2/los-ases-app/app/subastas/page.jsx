"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import styles from "./styles.module.css"; // Si tienes un archivo CSS relacionado con esta página

export default function SearchResults() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar coches desde el archivo JSON
  useEffect(() => {
    async function loadCars() {
      try {
        const response = await fetch("/cars.json"); // Ruta al archivo JSON
        const data = await response.json();
        setCars(data);
        setFilteredCars(data); // Al cargar los coches, también actualizamos los coches filtrados
      } catch (error) {
        console.error("Error cargando el JSON:", error);
      }
    }

    loadCars();
  }, []);

  // Función para actualizar el filtro de búsqueda
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = cars.filter((car) =>
      car.brand.toLowerCase().includes(query)
    );
    setFilteredCars(filtered);
  };

  return (
    <div>
      <Header />

      <div className={styles.content}>
        <h2 className={styles.searchTitle}>Resultados de Búsqueda</h2>

        <div className={styles.searchbar}>
          <input
            type="text"
            id="searchInput"
            placeholder="Buscar subastas..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <button>
            <img src="/Lupa.jpeg" alt="Buscar" />
          </button>
        </div>

        <div className={styles.auctionResults} id="auctionResults">
          {/* Aquí se mostrarán los coches filtrados dinámicamente */}
          {filteredCars.length === 0 ? (
            <p>No se han encontrado coches.</p>
          ) : (
            filteredCars.map((car) => (
              <div
                key={car.id}
                className={styles.auctionItem}
                onClick={() =>
                  window.location.href = `/detalles/${encodeURIComponent(car.id)}`
                }
              >
                <img src={`/${car.img}`} alt={`${car.brand} ${car.model}`} />
                <div className={styles.auctionDetails}>
                  <h3>{`${car.brand} ${car.model}`}</h3>
                  <p>Precio actual: {car.price.toLocaleString()}€</p>
                  <p>Tiempo restante: {car.timeLeft}</p>
                  <button>Pujar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
