var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const PORT = 8080;

var pool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'prueba',
   port: 9002
});

function conectar_mysql(sql_string) {
  pool.getConnection(function(err, con){
    con.query(sql_string, function(err, res) {
      console.log(res.length);
    });
    return res;
  });
  return null;
}


app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.set('view engine','ejs');
app.use('/css',express.static('css'));

app.get('/', function(req, res){
  res.render('index');
});

function comprobar(tam, tipo) {
    if (tam > 0){
      throw new TypeError(tipo + "No disponible");
    }
}

app.post('/', urlencodedParser, function(req, res){
  var data = req.body;
  if(body.Email){
    var res2 = conectar_mysql("SELECT * FROM usuario WHERE nombre_usuario = '" +
    data.user + "'");
    try{
      comprobar(res2.length, "Usuario");
    }catch(err){
      console.log(err.message);
    }
    var res3 = conectar_mysql("SELECT * FROM usuario WHERE correo_usuario = '" +
    data.Email + "'");
    try {

    } catch (e) {

    } finally {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    }

  }
  res.render('index');
});

app.listen(PORT);
