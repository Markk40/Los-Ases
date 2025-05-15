'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import styles from './page.module.css';

const AccountPage = () => {
    const [userData, setUserData] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordWarning, setPasswordWarning] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await fetch("http://127.0.0.1:8000/api/users/profile/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    console.error("Error al obtener los datos del usuario:", response.status, response.statusText);
                    return;
                }

                const data = await response.json();

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
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            // Validar contraseñas
            if (password || confirmPassword) {
                if (password !== confirmPassword) {
                    setPasswordError("Las contraseñas no coinciden.");
                    return;
                }
                
                const payload = { 
                    old_password: currentPassword, 
                    new_password: password 
                };

                const passwordRes = await fetch("http://127.0.0.1:8000/api/users/change-password/", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!passwordRes.ok) {
                    const errData = await passwordRes.json().catch(() => null);
                    setPasswordWarning(
                    errData?.detail ||
                    errData?.old_password?.join(" ") ||
                    "No se pudo cambiar la contraseña."
                    );
                    return;
                } else {
                    setPasswordWarning("");
                }
            }

            // Guardar otros campos
            const response = await fetch("http://127.0.0.1:8000/api/users/profile/", {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert("Cambios guardados correctamente");
                setIsEditable(false);
                setPassword("");
                setConfirmPassword("");
                setPasswordError("");
            } else {
                console.error("Error al actualizar los datos del usuario");
            }
        } catch (error) {
            console.error("Hubo un problema al guardar los cambios:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        router.push("/");
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
                            <label htmlFor="first_name" className={styles.label}>Nombre:</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={userData.first_name || ""}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={styles.infoRow}>
                            <label htmlFor="last_name" className={styles.label}>Apellido:</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={userData.last_name || ""}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={styles.infoRow}>
                            <label htmlFor="locality" className={styles.label}>Localidad:</label>
                            <input
                                type="text"
                                id="locality"
                                name="locality"
                                value={userData.locality || ""}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className={styles.infoRow}>
                            <label htmlFor="municipality" className={styles.label}>Municipio:</label>
                            <input
                                type="text"
                                id="municipality"
                                name="municipality"
                                value={userData.municipality || ""}
                                onChange={handleChange}
                                className={styles.inputField}
                                disabled={!isEditable}
                            />
                        </div>

                        {isEditable && (
                            <>
                                <div className={styles.infoRow}>
                                <label htmlFor="currentPassword" className={styles.label}>Contraseña Actual:</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    className={styles.inputField}
                                />
                                </div>
                                <div className={styles.infoRow}>
                                    <label htmlFor="password" className={styles.label}>Nueva Contraseña:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={styles.inputField}
                                    />
                                </div>

                                <div className={styles.infoRow}>
                                    <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña:</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={styles.inputField}
                                    />
                                </div>

                                {passwordError && (
                                    <p className={styles.error}>{passwordError}</p>
                                )}
                                {passwordWarning && (
                                    <p className={styles.error}>{passwordWarning}</p>
                                )}
                            </>
                        )}
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={handleEditToggle} className={styles.submitButton}>
                            {isEditable ? 'Cancelar' : 'Editar'}
                        </button>

                        {isEditable && (
                            <button onClick={handleSaveChanges} className={styles.submitButton}>
                                Guardar Cambios
                            </button>
                        )}

                        <button onClick={handleLogout} className={styles.submitButton}>
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
