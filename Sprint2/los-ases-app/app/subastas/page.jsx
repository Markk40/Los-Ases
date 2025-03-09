"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuctionItem from "@/components/AuctionItem"; // Importamos el componente AuctionItem
import styles from "./styles.module.css"; // Si tienes un archivo CSS relacionado con esta página

export default function SearchResults() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [category, setCategory] = useState("all"); // Categoría seleccionada

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
    filterCars(query, maxPrice, category);
  };

  // Función para filtrar los coches según los filtros aplicados
  const filterCars = (searchQuery, maxPrice, category) => {
    const filtered = cars.filter((car) => {
      const matchesSearch = car.brand.toLowerCase().includes(searchQuery);
      const matchesPrice = car.price <= maxPrice;
      const matchesCategory = category === "all" || car.category === category;
      return matchesSearch && matchesPrice && matchesCategory;
    });
    setFilteredCars(filtered);
  };

  // Función para manejar el cambio del filtro de precio máximo
  const handleMaxPriceChange = (event) => {
    const newMaxPrice = event.target.value;
    setMaxPrice(newMaxPrice);
    filterCars(searchQuery, newMaxPrice, category);
  };

  // Función para manejar el cambio del filtro de categoría
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    filterCars(searchQuery, maxPrice, newCategory);
  };

  return (
    <div>
      <Header />

      <div className={styles.content}>
        <h2 className={styles.searchTitle}>Resultados de Búsqueda</h2>

        {/* Barra de búsqueda */}
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

        {/* Filtros */}
        <div className={styles.filters}>
          <div className={styles.priceFilter}>
            <label htmlFor="maxPrice">Precio máximo</label>
            <input
              type="range"
              id="maxPrice"
              min="20000"
              max="300000"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
            <span>{maxPrice}€</span>
          </div>

          <div className={styles.categoryFilter}>
            <label htmlFor="category">Categoría:</label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="all">Todas</option>
              <option value="Sedán">Sedán</option>
              <option value="Deportivo">Deportivo</option>
            </select>
          </div>
        </div>

        {/* Resultados de subastas */}
        <div className={styles.auctionResults} id="auctionResults">
          {filteredCars.length === 0 ? (
            <p className={styles.noResults}>No se han encontrado coches.</p>
          ) : (
            filteredCars.map((car) => (
              <AuctionItem key={car.id} car={car} /> // Usamos el componente AuctionItem
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
