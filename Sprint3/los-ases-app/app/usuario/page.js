'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './page.module.css';

const AccountPage = () => {
    const [userData, setUserData] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Obteniendo datos del usuario...");

                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.error("No hay token de acceso. Redirigiendo a login...");
                    router.push("/login");
                    return;
                }

                const response = await fetch("https://das-p2-backend.onrender.com/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                });

                console.log("Respuesta del servidor:", response);

                if (!response.ok) {
                    console.error("Error al obtener los datos del usuario:", response.status, response.statusText);
                    return;
                }

                const data = await response.json();
                console.log("Datos del usuario recibidos:", data);

                if (data.birth_date) {
                    data.birth_date = data.birth_date.split("T")[0];
                }

                setUserData(data);

            } catch (error) {
                console.error("Hubo un problema al cargar los datos del usuario:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleEditToggle = () => {
        setIsEditable(!isEditable);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch('https://das-p2-backend.onrender.com/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert("Cambios guardados correctamente");
                setIsEditable(false);
            } else {
                console.error('Error al guardar los cambios');
            }
        } catch (error) {
            console.error('Hubo un problema al guardar los cambios:', error);
        }
    };

    // Nueva función para cerrar sesión desde la página de usuario
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        router.push("/"); // Redirige a la página de inicio
    };

    if (!userData) {
        return <div>Cargando...</div>;
    }

    return (
        <div className={styles.body}>
            <Header />
            <main className={styles.main}>
                <div className={styles.account}>
                    <h2>Mi Cuenta</h2>
                    <div className={styles.userInfo}>
                        <img src="/defaultProfile.jpg" alt="Foto de perfil" className={styles.profileImage} />

                        <div className={styles.infoRow}>
                            <label htmlFor="username" className={styles.label}>Nombre de Usuario:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={styles.infoRow}>
                            <label htmlFor="email" className={styles.label}>Correo Electrónico:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={styles.infoRow}>
                            <label htmlFor="birth_date" className={styles.label}>Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                id="birth_date"
                                name="birth_date"
                                value={userData.birth_date}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={styles.infoRow}>
                            <label htmlFor="password" className={styles.label}>Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={userData.password || ""}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button
                            onClick={handleEditToggle}
                            className={styles.submitButton}
                        >
                            {isEditable ? 'Cancelar' : 'Editar'}
                        </button>

                        {isEditable && (
                            <button
                                onClick={handleSaveChanges}
                                className={styles.submitButton}
                            >
                                Guardar Cambios
                            </button>
                        )}
                        {/* Nuevo botón de cerrar sesión en la página de usuario */}
                        <button
                            onClick={handleLogout}
                            className={styles.submitButton}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AccountPage;
