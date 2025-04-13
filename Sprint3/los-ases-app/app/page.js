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
            <Link href="/">
            <button className={styles.mainButton}>Home</button>
            </Link>

            <Link href="/subastas">
              <button className={styles.mainButton}>Buscar Subastas</button>
            </Link>
            
            <Link href="/vender">
              <button className={styles.mainButton}>Vender Producto</button>
            </Link>
          </nav>
        </div>
      </section>
      <Footer />
    </div>
  );
}
