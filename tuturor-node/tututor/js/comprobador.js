  console.log("llegue");
function comprobarClave() {
  var clave1 = document.getElementById('password1').value;
  var clave2 = document.getElementById('password2').value;
  var correo = document.getElementById('email').value;

  for (var i = 0; i < clave1.length; i++) {
    console.log(clave1.charAt(i));
    if (clave1.charAt(i) == ' '){
      alert("La contraseña no puede tener espacios");
      return false;
    }
  }

  for (var i = 0; i < correo.length; i++) {
      if(correo.charAt(i) == '@'){
        var eafit = 'eafit.edu.co';
        var posicion = 0;
        for(var s = i+1; s < correo.length;s++){
          if(correo.charAt(s) != eafit.charAt(posicion)){
            alert("El correo debe ser de EAFIT");
            return false;
          }
          posicion++;
        }
      }
  }

  if (clave1 != clave2){
    alert("Las contraseñas no coinciden");
    return false;
  }
  return true;
}
