"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuctionItem from "@/components/AuctionItem";
import styles from "./styles.module.css";

const API_BASE_URL = "http://127.0.0.1:8000/api/auctions/";

export default function SearchResults() {
  const [cars, setCars] = useState([]);
  const [bids, setBids] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(300000);
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  // filtros nuevos
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [ratingMin, setRatingMin] = useState(0);

  // carga pujas (igual que antes)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bids/")
      .then(r => r.ok ? r.json() : [])
      .then(setBids)
      .catch(console.error);
  }, []);

  // carga categorías (igual)
  useEffect(() => {
    fetch(`${API_BASE_URL}categories/`)
      .then(r => r.json())
      .then(d => setCategories(d.results))
      .catch(console.error);
  }, []);

  // carga subastas cada vez que cambian los filtros de backend
  useEffect(() => {
    const params = new URLSearchParams();
  if (onlyOpen)   params.set("is_open", "true");
  if (ratingMin)  params.set("rating_min", ratingMin);

  const queryString = params.toString();
  const fetchUrl = `${API_BASE_URL}${queryString ? `?${queryString}` : ""}`;
  console.log("Fetch auctions:", fetchUrl);
    fetch(fetchUrl)
      .then(r => {
        if (!r.ok) throw new Error("Error al cargar subastas");
        return r.json();
      })
      .then(d => setCars(d.results))
      .catch(console.error);
  }, [onlyOpen, ratingMin]);

  // filtrado local (search, price, category)
  const filtered = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchQuery);
    const matchesPrice  = car.price <= maxPrice;
    const matchesCat    = category === "all" || car.category === +category;
    return matchesSearch && matchesPrice && matchesCat;
  });

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
            onChange={e => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.priceFilter}>
            <label>Precio máximo</label>
            <input
              type="range"
              min="20000"
              max="300000"
              value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
            />
            <span>{maxPrice}€</span>
          </div>

          <div className={styles.categoryFilter}>
            <label>Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.openFilter}>
            <label>Estado</label>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={onlyOpen}
                onChange={() => setOnlyOpen(o => !o)}
              />
              <span className={styles.slider}></span>
            </label>
            <span className={styles.switchLabel}>
              {onlyOpen ? "Activas" : "Todas"}
            </span>
          </div>

          <div className={styles.ratingFilter}>
            <label>Valoración mínima</label>
            <div className={styles.starFilter}>
              {[1,2,3,4,5].map(i => (
                <span
                  key={i}
                  className={ i <= ratingMin ? styles.starFilled : styles.star }
                  onClick={() => setRatingMin(ratingMin === i ? 0 : i)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.auctionResults}>
          {filtered.length === 0
            ? <p>No se han encontrado subastas.</p>
            : filtered.map(car => (
                <AuctionItem key={car.id} car={car} bids={bids}/>
              ))
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}
