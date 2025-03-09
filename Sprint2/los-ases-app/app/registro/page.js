'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import Footer from '../../components/footer';
import styles from './page.module.css';

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        username: '',
        dni: '',
        email: '',
        fnac: '',
        comunidad: '',
        provincia: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        dni: '',
        email: '',
        fnac: '',
        edad: '',
        password: '',
        confirmPassword: ''
    });

    const [warnings, setWarnings] = useState([]);

    const [provincias, setProvincias] = useState([]);

    const [loading, setLoading] = useState(false);  // ✅ Se agregó para evitar el error
    const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();

    const comunidadesProvincias = {
        "Andalucía": ["Almería", "Cádiz", "Córdoba", "Granada", "Huelva", "Jaén", "Málaga", "Sevilla"],
        "Aragón": ["Huesca", "Teruel", "Zaragoza"],
        "Asturias": ["Oviedo"],
        "Baleares": ["Palma de Mallorca"],
        "Canarias": ["Santa Cruz de Tenerife", "Las Palmas de Gran Canaria"],
        "Cantabria": ["Santander"],
        "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
        "Castilla y León": ["Ávila", "Burgos", "León", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora"],
        "Cataluña": ["Barcelona", "Gerona", "Lérida", "Tarragona"],
        "Comunidad Valenciana": ["Alicante", "Castellón de la Plana", "Valencia"],
        "Extremadura": ["Badajoz", "Cáceres"],
        "Galicia": ["La Coruña", "Lugo", "Orense", "Pontevedra"],
        "Madrid": ["Madrid"],
        "Murcia": ["Murcia"],
        "Navarra": ["Pamplona"],
        "País Vasco": ["Bilbao", "San Sebastián", "Vitoria"],
        "La Rioja": ["Logroño"]
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Validación en tiempo real
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Entrando en handleSubmit...");
    
        setLoading(true);  // ✅ Ya no generará error
        setErrors({});
        setSuccessMessage('');
    
        // Validar todos los campos antes de enviar
        const newErrors = {};
        validateField('username', formData.username, newErrors);
        validateField('dni', formData.dni, newErrors);
        validateField('email', formData.email, newErrors);
        validateField('fnac', formData.fnac, newErrors);
        validateField('password', formData.password, newErrors);
        validateField('confirmPassword', formData.confirmPassword, newErrors);
    
        if (Object.keys(newErrors).length > 0) {
            console.log("Errores detectados:", newErrors);
            setErrors(newErrors);
            setLoading(false);
            return;
        }
    
        // Datos formateados para la API
        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            birth_date: new Date(formData.fnac).toISOString().split("T")[0], // Formato YYYY-MM-DD
            locality: formData.provincia,
            municipality: formData.comunidad
        };
    
        console.log("Enviando datos al backend:", userData);
    
        // Enviar solicitud al backend
        await handleRegister(userData);
    };
    

    const handleRegister = async (userData) => {
        console.log("Entrado en handleRegister con datos:", userData);
    
        try {
            const response = await fetch("https://das-p2-backend.onrender.com/api/users/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
    
            console.log("Respuesta del servidor:", response);
    
            const data = await response.json();
            console.log("Datos recibidos del backend:", data);
    
            if (!response.ok) {
                throw new Error(data.message || "Error en el registro.");
            }
    
            setSuccessMessage("¡Usuario registrado con éxito!");
            setErrors({});
            setWarnings([]);
    
            setTimeout(() => {
                router.push('/'); // Redirigir a la pantalla de inicio después de 2 segundos
            }, 2000);
    
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setErrors({ general: error.message });
        } finally {
            setLoading(false);  // ✅ Ya no generará error
        }
    };

    const validateField = (field, value, newErrors) => {
        let updatedErrors = { ...newErrors }; // ✅ Crear una copia del objeto para evitar problemas de referencia
    
        switch (field) {
            case 'username':
                updatedErrors.username = value.trim() ? '' : 'El nombre de usuario es obligatorio';
                break;
    
            case 'dni':
                const dniRegex = /^[0-9]{8}[A-Z]$/;
                const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
                updatedErrors.dni = value.trim()
                    ? dniRegex.test(value) || nieRegex.test(value)
                        ? ''
                        : 'DNI/NIE inválido'
                    : 'El DNI/NIE es obligatorio';
                break;
    
            case 'email':
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                updatedErrors.email = value.trim()
                    ? emailRegex.test(value)
                        ? ''
                        : 'Correo electrónico inválido'
                    : 'El correo electrónico es obligatorio';
                break;
    
            case 'fnac':
                if (!value) {
                    updatedErrors.edad = 'Debe proporcionar su fecha de nacimiento';
                } else {
                    const birthDate = new Date(value);
                    const age = new Date().getFullYear() - birthDate.getFullYear();
                    updatedErrors.edad = age >= 18 ? '' : 'Debe ser mayor de 18 años para registrarse';
                }
                break;
    
            case 'password':
                if (!value) {
                    updatedErrors.password = 'La contraseña es obligatoria';
                } else {
                    let passwordWarnings = [];
                    if (value.length < 8) passwordWarnings.push("Debe tener al menos 8 caracteres.");
                    if (!/[A-Z]/.test(value)) passwordWarnings.push("Debe contener al menos una letra mayúscula.");
                    if (!/[a-z]/.test(value)) passwordWarnings.push("Debe contener al menos una letra minúscula.");
                    if (!/[0-9]/.test(value)) passwordWarnings.push("Debe contener al menos un número.");
                    if (!/[\W_]/.test(value)) passwordWarnings.push("Debe contener al menos un símbolo (@, #, $, etc.).");
    
                    updatedErrors.password = passwordWarnings.length > 0 ? passwordWarnings.join(' ') : '';
                }
                break;
    
            case 'confirmPassword':
                updatedErrors.confirmPassword = value === formData.password ? '' : 'Las contraseñas no coinciden';
                break;
    
            default:
                break;
        }
    
        return updatedErrors;
    };
    

    const handleComunidadChange = (e) => {
        const comunidadSeleccionada = e.target.value;
        setFormData({ ...formData, comunidad: comunidadSeleccionada, provincia: '' });
        setProvincias(comunidadesProvincias[comunidadSeleccionada] || []);
    };
    
    const handleReset = () => {
        setFormData({
            username: '',
            dni: '',
            email: '',
            fnac: '',
            comunidad: '',
            provincia: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({
            username: '',
            dni: '',
            email: '',
            edad: '',
            password: '',
            confirmPassword: ''
        });
        setWarnings([]);
    };

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <div className={styles.register}>
                    <h2>Registrar Usuario</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Nombre Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                        {errors.username && <p className={styles.error}>{errors.username}</p>}

                        <label htmlFor="dni">DNI/NIE:</label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                        {errors.dni && <p className={styles.error}>{errors.dni}</p>}

                        <label htmlFor="email">Correo electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                        {errors.email && <p className={styles.error}>{errors.email}</p>}

                        <label htmlFor="fnac">Fecha de nacimiento:</label>
                        <input
                            type="date"
                            id="fnac"
                            name="fnac"
                            value={formData.fnac}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                        {errors.edad && <p className={styles.error}>{errors.edad}</p>}

                        <label htmlFor="comunidad">Comunidad Autónoma:</label>
                        <select
                            id="comunidad"
                            name="comunidad"
                            value={formData.comunidad}
                            onChange={handleComunidadChange}
                            required
                            className={styles.inputField}
                        >
                            <option value="">Seleccione una comunidad</option>
                            {Object.keys(comunidadesProvincias).map((comunidad) => (
                                <option key={comunidad} value={comunidad}>
                                    {comunidad}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="provincia">Provincia:</label>
                        <select
                            id="provincia"
                            name="provincia"
                            value={formData.provincia}
                            onChange={handleChange}
                            className={styles.inputField}
                            disabled={!formData.comunidad}
                        >
                            <option value="">Seleccione una provincia</option>
                            {provincias.map((provincia) => (
                                <option key={provincia} value={provincia}>
                                    {provincia}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                        {errors.password && <p className={styles.error}>{errors.password}</p>}

                        <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

                        <input 
                            type="submit" 
                            value={loading ? "Registrando..." : "Registrar"} 
                            className={styles.submitButton} 
                            disabled={loading}  // 🔹 Deshabilita el botón mientras se envía
                        />
                        <input
                            type="reset"
                            onClick={handleReset}
                            value="Limpiar campos"
                            className={styles.resetButton}
                        />
                        {warnings.length > 0 && (
                            <div className={styles.warningBox}>
                                {warnings.map((warning, index) => (
                                    <p key={index} style={{ color: 'red', margin: '5px 0' }}>
                                        {warning}
                                    </p>
                                ))}
                            </div>
                        )}
                        {errors.general && <p className={styles.error}>{errors.general}</p>}
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterUser;
