'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import Footer from '../../components/footer';
import styles from './page.module.css';

const AccountPage = () => {
    const [userData, setUserData] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Obteniendo datos del usuario...");
    
                const token = localStorage.getItem("accessToken"); // 🔹 Obtener token de sesión
    
                if (!token) {
                    console.error("No hay token de acceso. Redirigiendo a login...");
                    router.push("/login"); // 🔹 Redirige a login si no hay token
                    return;
                }
    
                const response = await fetch("https://das-p2-backend.onrender.com/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}` // 🔹 Enviar token en la cabecera
                    },
                });
    
                console.log("Respuesta del servidor:", response);
    
                if (!response.ok) {
                    console.error("Error al obtener los datos del usuario:", response.status, response.statusText);
                    return;
                }
    
                const data = await response.json();
                console.log("Datos del usuario recibidos:", data);
    
                // Formatear fecha si existe
                if (data.birth_date) {
                    data.birth_date = data.birth_date.split("T")[0]; // Formato YYYY-MM-DD
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

    if (!userData) {
        return <div>Cargando...</div>; // Mostrar un mensaje mientras se obtiene la información
    }

    return (
        <div className={styles.body}>
            <Header />
            <main className={styles.main}>
                <div className={styles.account}>
                    <h2>Mi Cuenta</h2>
                    <div className={styles.userInfo}>
                        <img src="/defaultProfile.jpg" alt="Foto de perfil" className={styles.profileImage} />

                        {/* Nombre de Usuario */}
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

                        {/* Correo Electrónico */}
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

                        {/* Fecha de Nacimiento */}
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

                        {/* Contraseña */}
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

                    {/* Botones */}
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
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AccountPage;
