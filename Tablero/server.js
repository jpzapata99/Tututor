
var express = require('express');
var app=express();
var server=app.listen(3000);
app.use(express.static('public'))
console.log("socket is running xd");

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log("new connection" + socket.id);

socket.on('lapiz' , lapizSocket);
function lapizSocket(data){
    socket.broadcast.emit('lapiz' , data);
  }
  socket.on('borrador' , borradorSocket);
  function borradorSocket(dataB){
      socket.broadcast.emit('borrador' , dataB);
    }
    socket.on('regla' , reglaSocket);
    function reglaSocket(dataR){
        socket.broadcast.emit('regla' , dataR);
      }
//socket.on('imagen', imagenSocket);
  //function imagenSocket(data){
    //  socket.broadcast.emit('imagen' ,  { image: true, buffer: buf.toString('base64') });
    //}
}
