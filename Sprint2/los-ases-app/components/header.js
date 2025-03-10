import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter para redirigir
import styles from './header.module.css';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      fetch("https://das-p2-backend.onrender.com/api/users/profile/", {
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

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Eliminar token
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    router.push('/'); // Redirigir a la página de inicio
  };

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
              <button className={styles.profileBtn}>Acount</button>
            </Link>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}
