document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", function (event) {
      event.preventDefault();
      registrarUsuario();
  });

  document.getElementById("contraseña").addEventListener("input", validarContraseña);
  document.getElementById("contraseña2").addEventListener("input", compararContraseñas);
  document.getElementById("dni").addEventListener("input", function () {
      validarDNI();
  });
  document.getElementById("email").addEventListener("input", function () {
      validarEmail();
  });
  document.getElementById("fnac").addEventListener("input", validarEdad);
  checkLoginStatus()
});
const provinciasPorComunidad = {
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

function actualizarProvincias() {
  const comunidad = document.getElementById("comunidad").value;
  const provinciaSelect = document.getElementById("provincia");

  provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>';

  if (comunidad && provinciasPorComunidad[comunidad]) {
      provinciasPorComunidad[comunidad].forEach(provincia => {
          const option = document.createElement("option");
          option.value = provincia;
          option.textContent = provincia;
          provinciaSelect.appendChild(option);
      });
  }
}

function validarEdad() {
  const fechaNacimiento = document.getElementById("fnac").value;
  const edadError = document.getElementById("edad-error");

  if (!fechaNacimiento) {
    edadError.textContent = "Por favor, introduce tu fecha de nacimiento.";
    return false;
  }

  const fechaActual = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = fechaActual.getFullYear() - nacimiento.getFullYear();
  const mesDiferencia = fechaActual.getMonth() - nacimiento.getMonth();

  if (mesDiferencia < 0 || (mesDiferencia === 0 && fechaActual.getDate() < nacimiento.getDate())) {
    edad--;
  }

  if (edad < 18) {
    edadError.textContent = "Debes ser mayor de 18 años para registrarte.";
    edadError.style.color = "red";
    return false;
  } else {
    edadError.textContent = "";
    return true;
  }
}

function validarContraseña() {
  const password = document.getElementById("contraseña").value;
  const warningBox = document.getElementById("password-warnings");

  let warnings = [];

  if (password.length < 8) {
      warnings.push("Debe tener al menos 8 caracteres.");
  }
  if (!/[A-Z]/.test(password)) {
      warnings.push("Debe contener al menos una letra mayúscula.");
  }
  if (!/[a-z]/.test(password)) {
      warnings.push("Debe contener al menos una letra minúscula.");
  }
  if (!/[0-9]/.test(password)) {
      warnings.push("Debe contener al menos un número.");
  }
  if (!/[\W_]/.test(password)) {
      warnings.push("Debe contener al menos un símbolo (@, #, $, etc.).");
  }

  if (warnings.length > 0) {
      warningBox.innerHTML = warnings.map(w => `<p style="color: red; margin: 5px 0;">${w}</p>`).join('');
  } else {
      warningBox.innerHTML = "";
  }
}

function compararContraseñas() {
  let pass1 = document.getElementById("contraseña").value;
  let pass2 = document.getElementById("contraseña2").value;
  let errorMsg = document.getElementById("error");

  if (pass1 !== pass2) {
      errorMsg.textContent = "Las contraseñas no coinciden.";
      return false;
  } else {
      errorMsg.textContent = "";
      return true;
  }
}

function validarDNI() {
  let dni = document.getElementById("dni").value;
  let dniError = document.getElementById("dni-error");

  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

  if (dniRegex.test(dni) || nieRegex.test(dni)) {
      dniError.textContent = "";
      return true;
  } else {
      dniError.textContent = "DNI/NIE inválido";
      return false;
  }
}

function validarEmail() {
  let email = document.getElementById("email").value;
  let emailError = document.getElementById("email-error");

  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailRegex.test(email)) {
      emailError.textContent = "";
      return true;
  } else {
      emailError.textContent = "Correo electrónico inválido";
      return false;
  }
}

function validarCamposObligatorios() {
  const campos = [
      { id: "username", mensaje: "Campo obligatorio vacío" },
      { id: "dni", mensaje: "Campo obligatorio vacío", validar: validarDNI, mensajeError: "DNI/NIE inválido" },
      { id: "email", mensaje: "Campo obligatorio vacío" },
      { id: "comunidad", mensaje: "Selecciona una comunidad" },
      { id: "provincia", mensaje: "Selecciona una provincia" },
  ];

  let esValido = true;

  campos.forEach(campo => {
      const input = document.getElementById(campo.id);
      const mensajeError = document.getElementById(campo.id + "-error");

      if (!input.value.trim()) {
          mensajeError.textContent = campo.mensaje;
          mensajeError.style.color = "red";
          esValido = false;
      } else {
          mensajeError.textContent = "";

          if (campo.validar && !campo.validar(input.value.trim())) {
              mensajeError.textContent = campo.mensajeError;
              mensajeError.style.color = "red";
              esValido = false;
          }
      }
  });

  return esValido;
}

function registrarUsuario() {
  const warnings = document.querySelectorAll("#edad-error, #password-error, #password-warnings, #error");
  for (const warning of warnings) {
    if (warning.textContent.trim() !== "") {
      alert("No te puedes registrar, hay campos que no son correctos.");
      return;
    }
  }
  
  if (!validarDNI() || !validarEmail() || !compararContraseñas()) {
      console.log("Errores en el formulario");
      return;
  }

  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("contraseña").value;
  let dni = document.getElementById("dni").value;
  let comunidad = document.getElementById("comunidad").value;
  let provincia = document.getElementById("provincia").value;
  let fnac = document.getElementById("fnac").value;

  if (username === "" || comunidad === "" || provincia === "" || fnac === "") {
      alert("Todos los campos deben estar completos.");
      return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.some(user => user.email === email)) {
      alert("Este correo ya está registrado. Intenta con otro.");
      return;
  }

  usuarios.push({ email, password, username, dni, comunidad, provincia });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", email);

  document.getElementById("register-form").reset();

  window.location.href = "index.html";
}

function iniciarSesion(event) {
  event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("contraseña").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let usuario = usuarios.find(user => user.email === email && user.password === password);

  if (usuario) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", email);
      window.location.href = "index.html";
  } else {
      document.getElementById("error").textContent = "Correo o contraseña incorrectos";
  }
}

function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
      const authButtons = document.getElementById("auth-buttons");
      if (authButtons) {
          authButtons.style.display = "none";
      }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("contraseña").addEventListener("input", validarContraseña);
});


document.addEventListener("DOMContentLoaded", function() {
  let provinciaSelect = document.getElementById("provincia");
  if (provinciaSelect) {
    provinciaSelect.addEventListener("change", actualizarComunidades);
  }
});