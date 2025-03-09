'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter para redirigir
import Header from '../../components/header';
import Footer from '../../components/footer';
import styles from './page.module.css'; 

const Login = () => {
    const [username, setUsername] = useState(""); // 🔹 Cambiado de email a username
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // 🔹 Estado para deshabilitar el botón durante la petición
    const router = useRouter(); // Hook para la redirección

    const handleLogin = async (username, password) => {
        try {
            setLoading(true);
            setError("");

            console.log("Enviando credenciales...", { username, password });

            const response = await fetch("https://das-p2-backend.onrender.com/api/users/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (!response.ok) {
                throw new Error(data.message || "Usuario o contraseña incorrectos");
            }

            // Guardar el token en localStorage para futuras peticiones
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("username", data.username);

            console.log("Login exitoso. Redirigiendo...");
            router.push('/'); // 🔹 Redirigir a la página de inicio

        } catch (error) {
            console.error("Error en el login:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const iniciarSesion = async (event) => {
        event.preventDefault();

        if (!username || !password) {
            setError("Por favor, complete ambos campos.");
            return;
        }

        await handleLogin(username, password);
    };

    return (
        <div>
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
                            disabled={loading} // 🔹 Evita múltiples envíos
                        />
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
