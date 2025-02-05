function compararContraseñas() {
    let first_password = document.getElementById("contraseña").value;
    let second_password = document.getElementById("contraseña2").value;
    let error_msg = document.getElementById("error");

    if (first_password !== second_password) {
      error_msg.textContent = "Las contraseñas no coinciden.";
      document.getElementById("contraseña2").style.backgroundColor = "red";
      return false;
    } else if (first_password.length<8){
      error_msg.textContent = "La longitud minima de la contraseña debe ser de 8 caracteres";
      document.getElementById("contraseña").style.backgroundColor = "red";
      return false;
    }
    else{
      error_msg.textContent = "";
      document.getElementById("contraseña2").style.backgroundColor = "";
      return true;
    }
  }

  