function comprobarClave() {
  var clave1 = document.getElementById('password1').value;
  var clave2 = document.getElementById('password2').value;

  for (var i = 0; i < clave1.length; i++) {
    console.log(clave1.charAt(i));
    if (clave1.charAt(i) == ' '){
      alert("La contraseña no puede tener espacios");
      return false;
    }
  }

  if (clave1 != clave2){
    alert("Las contraseñas no coinciden");
    return false;
  }
  return true;
}
