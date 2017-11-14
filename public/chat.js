var sala = "";
    $(function () {
    var socket = io.connect();
    socket.on('newsala', function (url) {
    sala = url;
    socket.emit('create', sala);
  });
    var $userFormArea  = $('#userFormArea');
    var $userForm  = $('#userForm');
    var $users = $('#users');
    var $nombreUsuario = $('#nombreUsuario');
    var $formChat = $('#formChat');
    var $messages = $('#messages');
    //var $DivParaCuadrado = $('DivParaCuadrado');
    var $m = $('#m');
    $formChat.submit(function(e){
      var data={
        room:sala
      }
      e.preventDefault();
      socket.emit('chat message', data,$m.val());
      $m.val('');
      return false;
    });

    socket.on('new message', function(mensaje){
      var fecha = new Date();
      var horaDelEnvio = (fecha.getHours()+":"+fecha.getMinutes());
      $messages.append($('<li><font size=5><strong>'+mensaje.user+'</strong>:'+mensaje.data+"<p style='color:red;'>"+horaDelEnvio+'</p></font></li>'));
    });

    $userForm.submit(function(){
      var dataP = {
        room:sala,
        nombreUsuarioData:$nombreUsuario.val()
      }
      socket.emit('new user', dataP,function(msg){
        if (msg){
          $userForm.hide();
          $formChat.show();
          $messages.show();
        }
      });
      $('#nombreUsuario').val('');
      return false;
    });

  });
