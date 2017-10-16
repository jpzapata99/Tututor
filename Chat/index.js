var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
users = [];
connections=[];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets onnected', connections.length);

    //Desconexion
    socket.on('disconnect',function(data){
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected: %s sockets connected',connections.length);
    });

    //Enviar Mensaje
    socket.on('chat message', function(mensaje){
    io.emit('new message', {data:mensaje,user:socket.nombreUsuario});
    });

    //new user
    socket.on('new user', function(msg,callback){
        callback(true);
        socket.nombreUsuario = msg;
        users.push(socket.nombreUsuario);
        io.emit('new user',socket.nombreUsuario);
    });
});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
