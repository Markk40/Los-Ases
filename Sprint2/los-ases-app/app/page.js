'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function Home() {
  return (
    <div>
      <Header />
      <h1>Página de Inicio</h1>
      <nav>
        <ul>
          <li><Link href="/inicio">Inicio de Sesión</Link></li>
          <li><Link href="/subastas">Buscar Subastas</Link></li>
          <li><Link href="/registro">Registro</Link></li>
        </ul>
      </nav>
      <Footer />
    </div>
  );
}