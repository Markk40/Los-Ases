'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import Footer from '../../components/footer';
import styles from './page.module.css';

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

const RegisterUser = () => {
  // Estado para los datos del formulario
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
  
  // Estados para errores y warnings (warnings en tiempo real)
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();

  // Función de validación para cada campo (devuelve un string con el warning o cadena vacía)
  const validateField = (field, value) => {
    let warningMessage = '';
    switch (field) {
      case 'username':
        if (!value.trim()) {
          warningMessage = 'El nombre de usuario es obligatorio.';
        }
        break;
      case 'dni':
        {
          const dniRegex = /^[0-9]{8}[A-Z]$/;
          const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
          if (!value.trim()) {
            warningMessage = 'El DNI/NIE es obligatorio.';
          } else if (!(dniRegex.test(value) || nieRegex.test(value))) {
            warningMessage = 'DNI/NIE inválido.';
          }
        }
        break;
      case 'email':
        {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!value.trim()) {
            warningMessage = 'El correo electrónico es obligatorio.';
          } else if (!emailRegex.test(value)) {
            warningMessage = 'Correo electrónico inválido.';
          }
        }
        break;
      case 'fnac':
        if (!value) {
          warningMessage = 'Debe proporcionar su fecha de nacimiento.';
        } else {
          const birthDate = new Date(value);
          const currentYear = new Date().getFullYear();
          const birthYear = birthDate.getFullYear();
          const age = currentYear - birthYear;
          if (age < 18) {
            warningMessage = 'Debe ser mayor de 18 años para registrarse.';
          }
        }
        break;
      case 'password':
        if (!value) {
          warningMessage = 'La contraseña es obligatoria.';
        } else {
          let passWarnings = [];
          if (value.length < 8) passWarnings.push("Debe tener al menos 8 caracteres.");
          if (!/[A-Z]/.test(value)) passWarnings.push("Debe contener una letra mayúscula.");
          if (!/[a-z]/.test(value)) passWarnings.push("Debe contener una letra minúscula.");
          if (!/[0-9]/.test(value)) passWarnings.push("Debe contener un número.");
          if (!/[\W_]/.test(value)) passWarnings.push("Debe contener un símbolo.");
          warningMessage = passWarnings.join(" ");
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          warningMessage = 'Las contraseñas no coinciden.';
        }
        break;
      default:
        warningMessage = '';
    }
    return warningMessage;
  };

  // Actualiza formData y warnings en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const warningForField = validateField(name, value);
    setWarnings((prev) => ({ ...prev, [name]: warningForField }));
  };

  const handleComunidadChange = (e) => {
    const comunidadSeleccionada = e.target.value;
    setFormData((prev) => ({
      ...prev,
      comunidad: comunidadSeleccionada,
      provincia: ''
    }));
    setProvincias(comunidadesProvincias[comunidadSeleccionada] || []);
  };

  const handleReset = () => {
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      dni: '',
      email: '',
      fnac: '',
      comunidad: '',
      provincia: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setWarnings({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    // Validar todos los campos antes de enviar (recalculando warnings)
    let newErrors = {};
    Object.keys(formData).forEach((field) => {
      const warning = validateField(field, formData[field]);
      if (warning) {
        newErrors[field] = warning;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Preparar datos para la API
    const userData = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      birth_date: new Date(formData.fnac).toISOString().split("T")[0],
      locality: formData.provincia,
      municipality: formData.comunidad
    };

    try {
      const response = await fetch("https://los-ases-backend.onrender.com/api/users/register/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error en el registro.");
      }

      setSuccessMessage("¡Usuario registrado con éxito!");
      setErrors({});
      setWarnings({});
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
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
            {warnings.username && <p className={styles.warning}>{warnings.username}</p>}
            {errors.username && <p className={styles.error}>{errors.username}</p>}
            <label htmlFor="first_name">Nombre:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className={styles.inputField}
            />

            <label htmlFor="last_name">Apellido:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
            <label htmlFor="dni">DNI/NIE:</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className={styles.inputField}
            />
            {warnings.dni && <p className={styles.warning}>{warnings.dni}</p>}
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
            {warnings.email && <p className={styles.warning}>{warnings.email}</p>}
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
            {warnings.fnac && <p className={styles.warning}>{warnings.fnac}</p>}
            {errors.fnac && <p className={styles.error}>{errors.fnac}</p>}

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
            {warnings.password && <p className={styles.warning}>{warnings.password}</p>}
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
            {warnings.confirmPassword && <p className={styles.warning}>{warnings.confirmPassword}</p>}
            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

            <input 
              type="submit" 
              value={loading ? "Registrando..." : "Registrar"}
              className={styles.submitButton}
              disabled={loading}
            />
            <input
              type="reset"
              onClick={handleReset}
              value="Limpiar campos"
              className={styles.resetButton}
            />
            {errors.general && <p className={styles.error}>{errors.general}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterUser;
