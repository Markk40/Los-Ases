'use client';
import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <Header />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Página de Subastas</h2>
          <nav className={styles.mainButtons}>
            <button className={styles.mainButton}>
              <Link href="/">Home</Link>
            </button>
            <button className={styles.mainButton}>
              <Link href="/subastas">Buscar Subastas</Link>
            </button>
            <button className={styles.mainButton}>
              <Link href="/vender">Vender Producto</Link>
            </button>
          </nav>
        </div>
      </section>
      <Footer />
    </div>
  );
}
