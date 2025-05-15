'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import Footer from '../../components/footer';
import styles from './page.module.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (username, password) => {
        try {
            setLoading(true);
            setError("");

            // 1. Petición para obtener token
            const tokenRes = await fetch("http://127.0.0.1:8000//api/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!tokenRes.ok) {
                const err = await tokenRes.json();
                throw new Error(err.detail || "Credenciales incorrectas");
            }

            const tokenData = await tokenRes.json();
            const accessToken = tokenData.access;

            // 2. Obtener perfil de usuario
            const profileRes = await fetch("http://127.0.0.1:8000/api/users/profile/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!profileRes.ok) {
                throw new Error("Error al obtener el perfil de usuario");
            }

            const userData = await profileRes.json();

            // Guardar en localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("username", userData.username);
            localStorage.setItem("user", JSON.stringify(userData));

            console.log("✅ Login correcto. Redirigiendo...");
            router.push("/");
        } catch (err) {
            console.error("Error en el login:", err);
            setError(err.message || "Error inesperado al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const iniciarSesion = async (event) => {
        event.preventDefault();
        if (!username || !password) {
            setError("Por favor, completa ambos campos.");
            return;
        }
        await handleLogin(username, password);
    };

    return (
        <div className={styles.body}>
            <Header />
            <main className={styles.main}>
                <div className={styles.login}>
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={iniciarSesion}>
                        <label htmlFor="username">Nombre de Usuario:</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                            className={styles.inputField}
                        />

                        <label htmlFor="password">Contraseña:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className={styles.inputField}
                        />

                        {error && <p className={styles.error}>{error}</p>}

                        <input 
                            type="submit" 
                            value={loading ? "Iniciando sesión..." : "Iniciar Sesión"} 
                            className={styles.submitButton}
                            disabled={loading}
                        />
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
