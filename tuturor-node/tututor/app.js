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
   database: 'prueba05',
   port: 9002
});

function conectar_mysql() {
  pool.getConnection(function(err, con){
    con.query("SELECT * FROM usuario WHERE usuario = 'Nicolas'", function(err, res) {
      console.log(res.length);
    });
  });
}


app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.set('view engine','ejs');
app.use('/css',express.static('css'));

app.get('/', function(req, res){
  res.render('index');
});

app.post('/', urlencodedParser, function(req, res){
  console.log(req.body.user);
  conectar_mysql();
  res.render('index');
});

app.listen(PORT);
