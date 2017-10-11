var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var mysqlSync = require('sync-mysql');
var app = express();
//Permite obtener acceso a el cuerpo de los formularios
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//Puerto local donde se corre el programa
const PORT = 8080;
/*Inicialización y definición de la conexión a la base de datos de manera
sincrona*/
var connection = new mysqlSync({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pruebas',
  port: 9001
});
/*Inicialización y definición de la conexión ciclica a la base de datos de
manera asincrona*/
var pool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'pruebas',
   port: 9001
});
//Definición de todos los documentos estáticos
app.use('ejs', express.static(__dirname + '/views'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.set('view engine','ejs');
app.use('/css',express.static('css'));

/*Métodos que se encarga de renderizar una pagina cuando esta se recibe en la
barra de navegación*/
app.get('/index.ejs', function(req, res){
  res.render('index');
});

app.get('/', function(req, res){
  res.render('index');
});

/*Comprueba si el usuario y/o el correo se encuentra disponible*/
function comprobar(tam, tipo) {
  console.log(tam);
  if (tam > 0){
    throw new TypeError(tipo + " no disponible");
  }
}
/*Es como un tipo de listener que se activa cuado se es enviado un formulario,
este se encarga de realizar las consultas necesarias para la validación de los
datos*/
app.post('/', urlencodedParser, function(req, res){
  var data = req.body;
  //Si es un post de registro
  if (data.Email) {
    var disponible =  true; //Variable usada para continuar la verificación
    var sql_string = "SELECT nombre_usuario FROM usuario WHERE nombre_usuario = '" + data.username + "'";
    var result = connection.query(sql_string);
    try{
      comprobar(result.length, "Usuario");
    }catch(err){
      disponible = false;//Si el usuario existe, no se continua la verificación
      console.log(err.message);
      res.render('nudisponible');//Se envia a la pagina de error de usuario
    }
    if(disponible){//Entra cuando el usuario es disponible
      sql_string = "SELECT correo_usuario FROM usuario WHERE correo_usuario = '" + data.Email + "'";
      var result2 = connection.query(sql_string);
      try{
        comprobar(result2.length, "Email");
      }catch(err){
        disponible = false;//Si el email existe, no se continua la verificación
        console.log(err.message);
        res.render('nedisponible');//Se envia a la pagina de error de email
      }
    }
    if (disponible){//Entra cuando el usuario y el email estan disponibles
      var sql_string2 = "INSERT INTO usuario (nombre_usuario, correo_usuario, contra_usuario) VALUES ('" +
      data.username + "', '" + data.Email + "', '" + data.Password[0] + "')";
      pool.getConnection(function(err, con){//Llamado a una conexión asincrona
        if(err){
          con.release();
          throw err;
        }
        con.query(sql_string2, function(err2, res2) {
          con.release();
          if(err2) throw err2;
        });
      });
      res.render('registroE');//Se envia a la pagina de registro exitoso
    }
  //Si es un post de inicio de sesión
  }else{
    sql_string = "SELECT * FROM usuario WHERE nombre_usuario = '" + data.username + "'";
    var result = connection.query(sql_string);
    if(result.conta_usuario == data.Password){
      console.log("Se ha iniciado sesión");
      //Aquí se debe llevar a la pagina de inicio. FALTA!!
    }else{
      console.log("Usuario o contraseña erronea");
    }
  }
});
//Se corre el programa en el PORT definido anteriormente.
app.listen(PORT);
