const express = require('express');
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.send();
});

users = [];
connections=[];

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

    function reglaSocket(dataR){
        socket.broadcast.emit('regla' , dataR);
    }
    
    socket.on('lapiz' , lapizSocket);
    function lapizSocket(data){
        socket.broadcast.emit('lapiz' , data);
    }
    socket.on('borrador' , borradorSocket);
    function borradorSocket(dataB){
      socket.broadcast.emit('borrador' , dataB);
    }
    socket.on('regla' , reglaSocket);
    

    socket.on('image' , imageSocket);
    function imageSocket(data){
        socket.broadcast.emit('image' , dataR);
    }
    socket.on('cuadrado', cuadradoSocket);
    function cuadradoSocket(dataC){
        socket.broadcast.emit('cuadrado' , dataC);       
    }
    socket.on('circulo', circuloSocket);
    function circuloSocket(dataCi){
        socket.broadcast.emit('circulo' , dataCi);     
    }
    socket.on('triangulo', trianguloSocket);
    function trianguloSocket(dataT){
        socket.broadcast.emit('triangulo' , dataT);             
    }
});

io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
