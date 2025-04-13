'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from './page.module.css';

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsUserLoggedIn(true);
    }
  }, []);

  return (
    <div className={styles.homeContainer}>
      <Header />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Página de Subastas</h2>
          <nav className={styles.mainButtons}>
            <Link href="/">
              <button className={styles.mainButton}>Home</button>
            </Link>

            <Link href="/subastas">
              <button className={styles.mainButton}>Buscar Subastas</button>
            </Link>

            {/* Condición para mostrar el botón "Vender Producto" si el usuario está logueado */}
            {isUserLoggedIn ? (
              <Link href="/subastas/crear">
                <button className={styles.mainButton}>Vender Producto</button>
              </Link>
            ) : (
              // Si no está logueado, agregamos un botón vacío o una acción alternativa
              <button className={styles.mainButton}>Vender producto</button>
            )}
          </nav>
        </div>
      </section>
      <Footer />
    </div>
  );
}
