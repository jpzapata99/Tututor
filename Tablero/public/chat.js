
    $(function () {
    var socket = io.connect();
    var $userFormArea  = $('#userFormArea');
    var $userForm  = $('#userForm');
    var $users = $('#users');
    var $nombreUsuario = $('#nombreUsuario');
    var $formChat = $('#formChat');
    var $messages = $('#messages');
    //var $DivParaCuadrado = $('DivParaCuadrado');
    var $m = $('#m');
    $formChat.submit(function(e){
      e.preventDefault();
      socket.emit('chat message', $m.val());
      $m.val('');
      return false;
    });


    socket.on('new message', function(mensaje){
      var fecha = new Date();
      var horaDelEnvio = (fecha.getHours()+":"+fecha.getMinutes());
      $messages.append($('<li><font size=5><strong>'+mensaje.user+'</strong>:'+mensaje.data+"<p style='color:red;'>"+horaDelEnvio+'</p></font></li>'));
    });

    $userForm.submit(function(){
      socket.emit('new user', $nombreUsuario.val(),function(msg){
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
  
