var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var urlencondedParser = bodyParser.urlenconded({extended : false});
var app = express();

const PORT = 8080;

var con = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'prueba03',
   port: 9001
});

con.connect(function(err) {
 if (err) throw err;
 else console.log("Conexión realizada");
});

app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.set('view engine','ejs');
app.use('/css',express.static('css'));

app.get('/', function(req, res){
  res.render('index');
});

app.listen(PORT);

con.query("SELECT * FROM personaje WHERE nombre = 'Nicolas'",function (err, result) {
  if (err) throw err;
  console.log(result[0].biografia);
});

con.end();
