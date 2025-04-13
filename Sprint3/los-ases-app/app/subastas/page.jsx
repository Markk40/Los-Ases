"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuctionItem from "@/components/AuctionItem";
import styles from "./styles.module.css";
import { getAllAuctions, getAllCategories, getAllBids } from "../utils/api";

export default function SearchResults() {
  const [cars, setCars] = useState([]);
  const [bids, setBids] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  // Cargar subastas
  useEffect(() => {
    async function loadCars() {
      try {
        const data = await getAllAuctions();
        setCars(data.results);
        setFilteredCars(data.results);
      } catch (error) {
        console.error("Error cargando subastas:", error);
      }
    }
    loadCars();
  }, []);

  useEffect(() => {
    async function loadBids() {
      try {
        const data = await getAllBids();
        setBids(data); // asumiendo que es un array directo
      } catch (error) {
        console.error("Error cargando pujas:", error);
      }
    }
    loadBids();
  }, []);

  // Cargar categorías dinámicamente
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data.results);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    }
    loadCategories();
  }, []);

  // Filtrado general
  const filterCars = (search, price, cat) => {
    const filtered = cars.filter((car) => {
      const matchesSearch = car.title.toLowerCase().includes(search);
      const matchesPrice = car.price <= price;
      const matchesCategory = cat === "all" || car.category === parseInt(cat);
      return matchesSearch && matchesPrice && matchesCategory;
    });
    setFilteredCars(filtered);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterCars(query, maxPrice, category);
  };

  const handleMaxPriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    setMaxPrice(newMax);
    filterCars(searchQuery, newMax, category);
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    filterCars(searchQuery, maxPrice, newCat);
  };

  return (
    <div>
      <Header />
      <div className={styles.content}>
        <h2 className={styles.searchTitle}>Resultados de Búsqueda</h2>

        <div className={styles.searchbar}>
          <input
            type="text"
            placeholder="Buscar subastas..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.filters}>
          <label>Precio máximo</label>
          <input
            type="range"
            min="20000"
            max="300000"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
          <span>{maxPrice}€</span>

          <label>Categoría</label>
          <select value={category} onChange={handleCategoryChange}>
          <option value="all">Todas</option>
          {Array.isArray(categories) && categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        </div>

        <div className={styles.auctionResults}>
          {filteredCars.length === 0 ? (
            <p>No se han encontrado subastas.</p>
          ) : (
            filteredCars.map((car) => (
              <AuctionItem key={car.id} car={car} bids={bids}/>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
