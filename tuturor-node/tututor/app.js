//Bloque de variables que se requieren como modulos en el programa
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var mysqlSync = require('sync-mysql');
var formidable = require('formidable');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var fs = require('fs');
const path = require('path');
var bcrypt = require('bcrypt');
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');
var app = express();

//Vairables de informacion necesarias para el programa
const saltRounds = 10; // Numero de potencia de incriptacion del bcrypt
var usuario= [];


//Permite obtener acceso a el cuerpo de los formularios
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//Puerto local donde se corre el programa
const PORT = 9001;
/*Inicialización y definición de la conexión a la base de datos de manera
sincrona*/
var connection = new mysqlSync({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'prueba',
  port: 3306
});
/*Inicialización y definición de la conexión ciclica a la base de datos de
manera asincrona*/
var pool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'prueba',
   port: 3306
});
//Funcion que permite leer mas de 1 carpeta de views
function enableMultipleViewFolders(express) {
    // proxy function to the default view lookup
    var lookupProxy =  function (view, options) {
        if (options.root instanceof Array) {
            // clones the options object
            var opts = {};
            for (var key in options) opts[key] = options[key];
            // loops through the paths and tries to match the view
            var matchedView = null,
                roots = opts.root;
            for (var i=0; i<roots.length; i++) {
                opts.root = roots[i];
                matchedView = lookupProxy.call(this, view, opts);
                if (matchedView.exists) break;
            }
            return matchedView;
        }

        return lookupProxy.call(express.view, view, options)
    };
}
enableMultipleViewFolders(express); //corremos la funcion de multi carpeta views
//funcion que se encarga de copiar un archivo
function copyFile(src, dest) {
  let readStream = fs.createReadStream(src); //creamos el archivo de la direccion
  readStream.once('error', (err) => {
    console.log(err);
  });
  readStream.once('end', () => {
  });
  readStream.pipe(fs.createWriteStream(dest));//pegamos el archivo en la direccion de destino
}
/*Comprueba si el usuario y/o el correo se encuentra disponible*/
function comprobar(tam,tipo) {
  console.log(tam);
  if (tam > 0){
    throw new TypeError(tipo + " no disponible");
  }
}
//Definición de todos los documentos estáticos
app.use('ejs', express.static(__dirname + '/views'));
app.use('ejs', express.static(__dirname + '/pag/views'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/js', express.static(__dirname + '/pag/js'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/images', express.static(__dirname + '/pag/images'));
app.set('view engine','ejs');
app.set('views', [__dirname + '/views', __dirname + '/pag/views']);
app.use('/css',express.static('css'));
app.use('/css',express.static('pag/css'));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
})) //Hacemos que la aplicacion use el sistema de sessiones
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
/*Métodos que se encarga de renderizar una pagina cuando esta se recibe en la
barra de navegación*/
//cuando entren solo la direccion principal
app.get('/', function(req, res){
  if(req.session.username){
    res.render('perfil',{nombre:req.session.username, foto: "../../uploads/" + req.session.username + "/perfil.jpg ",info:req.session.informacion});
  }else {
    res.render('index', {
        mensaje:false
    });
  }
});
// Cuando ingresamos al index ejs
app.get('/index.ejs', function(req, res){
    res.render('index', {
        mensaje:''
    });
});
//Cuando entran al perfil
app.get('/perfil.ejs',function(req,res){
  if(req.session.username){ //si hay un usuario inicado
    if(!req.session.informacion){ // si hay informacion sobre ese usuario
      var sql_string = "SELECT * FROM usuario WHERE nombre_usuario = '" + req.session.username + "'"; // hace una consulta
      var result = connection.query(sql_string);
      req.session.informacion = { name: req.session.username, correo: result[0].correo_usuario, carrera: '' }; //guarda la info de esa session
      req.session.id = result[0].usuario_id;
    }
    var rutUplo = 'uploads';
    let filename = 'perfil.jpg';
    if (!fs.existsSync(rutUplo)){ // si no existe la carpeta 'Uploads'
      fs.mkdirSync(rutUplo); // crea la carpeta 'Uploads'
    }
    if(!fs.existsSync('./uploads/' +req.session.username)){ // si no existe la carpeta 'uploads' + la carpeta con el nombre del usuario
        fs.mkdirSync('./uploads/' +req.session.username); // crea la carpeta con el nombre del usuario
        copyFile(__dirname + '/images/perfil.jpg', path.join(__dirname +'/uploads/' +req.session.username, filename)); // copiamos dentro de ella lo foto por defecto
    }
      res.render('perfil',{nombre:req.session.username, foto: "../../uploads/" + req.session.username + "/perfil.jpg ",info: req.session.informacion});
      //renderizamos el perfil
  }else{
    //si no hay ninguna session iniciada redireccionamos a la pantalla de logeo
    res.redirect('index.ejs');
  }
});

//Cuando ingresemos al index de la pagina normal
app.get('/index2.ejs',function(req,res){
  res.render('../pag/views/index2',{login:true,
  perfil:"Bienvenido " + req.session.username + " Has iniciado sesion " });
});
//cuando ingresamos al index desde otra pagina que no sea la de logeo
  app.get('/pag/views/index2.ejs', function(req, res){
  if(req.session.username){
        res.redirect('/perfil.ejs');
      }else{
      res.redirect('../../../index.ejs');
    }
});

//Recibe todo lo que termine con verify
app.get(/.*verify$/, function (req, res) {
  sql_string = "SELECT nombre_usuario FROM usuario WHERE link = '" + req.url + "'";
  var result = connection.query(sql_string);
  if(result.length != 0){
    sql_string = "UPDATE usuario "+
                 "SET verificado = 1, link = ''"+
                 "WHERE nombre_usuario = '" + result[0].nombre_usuario + "'"; // Actualiza el usuario como verificado
    var result2 = connection.query(sql_string);
    res.render('index', {
        mensaje:'Su cuenta ha sido verificada exitosamente'
    }); // verifica exitosamente al usuario
  }else{
    res.render('index', {
        mensaje:'Esta url NO EXISTE'
    }); // la url puesta no existe
  }
});
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
      res.render('index', {//Se le envia un mensaje de error diciendo que el correo no es admitido
          mensaje:'Lo sentimos pero este nombre de usuario no se encuentra disponible.'
      });
    }
    if(disponible){//Entra cuando el usuario es disponible
      sql_string = "SELECT correo_usuario FROM usuario WHERE correo_usuario = '" + data.Email + "'";
      var result2 = connection.query(sql_string);
      try{
        comprobar(result2.length, "Email");
      }catch(err){
        disponible = false;//Si el email existe, no se continua la verificación
        console.log(err.message);
        if(err.message == "Email no disponible"){
          res.render('index', {//Se le envia un mensaje de error diciendo que el correo no es admitido
            mensaje:'Lo sentimos pero esta dirección de email no se encuentra disponible.'
          });
        }
      }
    }
    if (disponible){//Entra cuando el usuario y el email estan disponibles
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync(data.Password[0], salt);
      //Se crea el link para enviar al correo del usuario
        var linkr = "/" + randomstring.generate(15) + "verify";
        var sql_string2 = "INSERT INTO usuario (nombre_usuario, correo_usuario, contra_usuario, verificado, link) VALUES ('" +
        data.username + "', '" + data.Email + "', '" + hash + "', 0, '" + linkr + "')";
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

      var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
          auth: {
              user: "tututoreafit@gmail.com",
              pass: "elchecoeslovaco123"
          }
        });
      // setup e-mail data with unicode symbols
      var mailOptions = {
            from: "Tututor✔ <tututoreafit@gmail.com>", // sender address
            to: data.Email+"", // list of receivers
            subject: "Bienvenido a Tututor", // Subject line
            text: "",
            html: "<h1>Hola " + data.username + ". </h1> <br> <p>Bienvenido a Tututor, para terminar tu" +
            " proceso de registro, por favor da clic en el siguiente enlace: </a> <a>localhost:8080" + linkr +"</a>" +
            "<br> <a> Si cree que no debio recibir este correo pruede ingresar a nuestra pagina y hacer su reclamo:</a>"+
            " localhost:8080/"
        }

        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Mensaje enviado");
            }

            // if you don't want to use this transport object anymore, uncomment following line
            smtpTransport.close(); // shut down the connection pool, no more messages
        });
      res.render('index', {//Se le envia un mensaje con el registro exitoso
          mensaje:'Su registro ha sido completado exitosamente'
      });
    }
  //Si es un post de inicio de sesión
  }else{
    sql_string = "SELECT * FROM usuario WHERE nombre_usuario = '" + req.body.username + "'";
    var result = connection.query(sql_string);
    if(result != ""){
      if(bcrypt.compareSync(data.password, result[0].contra_usuario)){
        if(result[0].verificado == 1){
          req.session.username = req.body.username;
          res.render('../pag/views/index2.ejs', {//Se le envia un mensaje de error diciendo que el correo no es admitido
              login:true,
              perfil:"Bienvenido " + req.session.username + " Se ha inciado sesion correctamente"
          });
        }else {
          res.render('index', {
              mensaje:'Debe verificar su cuenta primero para poder entrar'
          });
        }
        //Aquí se debe llevar a la pagina de inicio. FALTA!!
      }else{
        res.render('index',{mensaje:"Usuario o contraseña incorrecta"})
      }
    }else{
      res.render('index',{mensaje:"Este usuario no existe"})
    }
  }
});
app.post('/cambiar', urlencodedParser, function(req, res){
  sql_string = "SELECT * FROM usuario WHERE nombre_usuario = '" + req.session.username + "'";
  var result = connection.query(sql_string);
  console.log(req.body.contraA);
  if(bcrypt.compareSync(req.body.contraA, result[0].contra_usuario)){
    if(req.body.nuevaC != req.body.contraA){
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync(req.body.nuevaC, salt);
      sql_string = "UPDATE usuario "+
                   "SET contra_usuario = '" + hash +"' "+
                   "WHERE nombre_usuario = '" + result[0].nombre_usuario+ "'" ;
      var result2 = connection.query(sql_string);
      res.render('perfil',{nombre:"Contraseña exitosamente cambiada", foto: "../../uploads/" + req.session.username + "/perfil.jpg ",info: req.session.informacion});
    }else{
      res.render('perfil',{nombre:"La contraseña ingresada no puede ser igual a la anterior", foto: "../../uploads/" + req.session.username + "/perfil.jpg ",info: req.session.informacion});
    }
  }else{
    res.render('perfil',{nombre:"No ha ingresado su contraseña anterior", foto: "../../uploads/" + req.session.username + "/perfil.jpg ",info: req.session.informacion});
  }
});
//POST que se encarga del cambio de foto
app.post('/foto', function (req, res){
  var form = new formidable.IncomingForm(); //usamos formidable para el upload del archivo
  form.parse(req);
  form.on('fileBegin', function (name, file){ // cuando el archcivo este subiendo
    if(path.extname(file.name) == '.jpg' || path.extname(file.name) == '.png' || path.extname(file.name) == '.gif'){
      fs.unlinkSync(__dirname + '/uploads/' + req.session.username + '/perfil.jpg'); // borramos la imagen de perfil anterior
      file.path = __dirname + '/uploads/' + req.session.username +'/perfil.jpg' ; // ponemos el archivo en la carpeta del usuario
    }else {
      res.render('perfil',{nombre:"El archivo no es un formato de foto valido", foto: "../../uploads/" + req.session.username + "/perfil.jpg ",info:req.session.informacion});
    }
  });
  res.render('perfil',{nombre:req.session.username, foto: "../../uploads/" + req.session.username + "/perfil.jpg ",info:req.session.informacion});
});
// Funcion para cerrar sesion
app.post('/cerrar',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});
//Se corre el programa en el PORT definido anteriormente.
//app.listen(PORT);
var listener = app.listen(PORT, function () {
   console.log('Server started on port %d', listener.address().port);
});
