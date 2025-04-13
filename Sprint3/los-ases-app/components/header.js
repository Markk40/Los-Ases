import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from './header.module.css';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      fetch("http://localhost:8000/api/users/profile/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-type": "aplication/json"
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.username) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch(() => setIsLoggedIn(false));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Se elimina la función handleLogout en el header
  // porque la acción de cerrar sesión se moverá a la página de Usuario

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo}> 
        <img src="/logoAses2.jpg" alt="Logo Los Ases" />
      </Link>
      <h1 className={styles.companyName}>LOS ASES</h1>
      <div className={styles.authButtons}>
        {!isLoggedIn ? (
          <>
            <Link href="/inicio">
              <button className={styles.loginBtn}>Log In</button>
            </Link> 
            <Link href="/registro">
              <button className={styles.signupBtn}>Sign Up</button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/usuario">
              <button className={styles.profileBtn}>Cuenta</button>
            </Link>
            <Link href="/subastas/misSubastas">
              <button className={styles.profileBtn}>Mis Subastas</button>
            </Link>
            <Link href="/usuario/misPujas">
              <button className={styles.profileBtn}>Mis Pujas
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
