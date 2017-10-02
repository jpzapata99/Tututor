var mysql = require('mysql');
var http = require('http');
var fs = require('fs');

const PORT = 8080;

var con = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'prueba01',
   port: 9001
});

con.connect(function(err) {
 if (err) throw err;
 else console.log("Conexión realizada");
});

http.createServer(function (req, res) {

      fs.readFile('index.html', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

}).listen(PORT);

con.query("SELECT * FROM personaje WHERE nombre = 'Nicolas'",function (err, result) {
  if (err) throw err;
  console.log(result[0].biografia);
});

con.end();
