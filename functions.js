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

function compararContraseñas() {
  let first_password = document.getElementById("contraseña").value;
  let second_password = document.getElementById("contraseña2").value;
  let error_msg = document.getElementById("error");

  if (first_password !== second_password) {
      error_msg.textContent = "Las contraseñas no coinciden.";
      return false;
  } else if (first_password.length < 8) {
      error_msg.textContent = "La longitud mínima de la contraseña debe ser de 8 caracteres";
      return false;
  }
  error_msg.textContent = "";
  return true;
}

function registrarUsuario(event) {
  event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("contraseña").value;
  let username = document.getElementById("username").value;
  let provincia = document.getElementById("provincia").value;
  let comunidad = document.getElementById("comunidad").value;

  if (!compararContraseñas()) return;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.some(user => user.email === email)) {
      document.getElementById("error").textContent = "Este correo ya está registrado. Inicia sesión.";
      return;
  }

  usuarios.push({ email, password, username, provincia, comunidad });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", email);

  alert("Registro exitoso. Redirigiendo al inicio...");
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
      alert("Inicio de sesión exitoso");
      window.location.href = "index.html";
  } else {
      document.getElementById("error").textContent = "Correo o contraseña incorrectos";
  }
}

function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
      document.getElementById("auth-buttons").style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  let provinciaSelect = document.getElementById("provincia");
  if (provinciaSelect) {
      provinciaSelect.addEventListener("change", actualizarComunidades);
  }
  checkLoginStatus();
});
