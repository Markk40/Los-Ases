import Link from "next/link";
import styles from './header.module.css';
export default function Header() {
  return (
    <header className={styles.navbar}>
      <a href="/" className={styles.logo}>
        <img src="/logoAses2.jpg" alt="Logo Los Ases" />
      </a>
      <h1 className={styles.companyName}>LOS ASES</h1>
      <div className={styles.authButtons}>
        <button className={styles.loginBtn}><Link href="/inicio">Log In</Link></button>
        <button className={styles.signupBtn}><Link href="/registro">Sign Up</Link></button>
      </div>
      </header>
  );
}