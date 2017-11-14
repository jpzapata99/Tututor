var px,py,px2,py2 = 0;
var ban,regla,cuadrado,lapiz,firstclick,Borrador,circulo,imprimir_imagen,triangulo,texto = false;
var cnv=null;
var xArriba,yArriba,xIzquierda,yIzquierda, xDerecha, yDerecha,pcx,pcy = 0;
var EsquinaTriangulo,rLapiz,gLapiz,bLapiz = 0;
var lapiztamano=15;
var imgtamano=200;
var reglatamano=4;
var borradortamano=50;
var tamanoLetra=60
var img,URLTemp=null;
var CuadradoTamanoP=20;
var CirculoTamano=10;
var indiceArregloDeControlZ=0;
var entroAlRuedo=0;
var Aplicar=1;
var savedImg;
ArregloDeImagenes = new Array();
var input;
var contLapiz=0;
var contBorrador=0;
var sala = "";
var colocar = document.getElementById('labelParaColocarTamañoTexto');
function setup() {
  //me permite conectarme al server y manener una coneccion con el host
  socket = io.connect('https://tututoreafit.herokuapp.com/',{
     reconnection: true,
     reconnectionDelay: 8000,
     reconnectionDelayMax : 10000,
     reconnectionAttempts: 99999
   });
    socket.on('newsala', function (url) {
    sala = url;
    socket.emit('create', sala);
  });

  //Esto me permite comunicarme con el servidor y señalar que quiero enviar
  //el primer parametro hace referencia a un id que se conparte entre el server y el modelo(sketch.js)
  //el segundo parametro hace referencia al metodo en el que dire que voy a enviar al server
    socket.on('lapiz' , transmitirLapiz);
    socket.on('borrador' , transmitirBorrador);
    socket.on('regla' , transmitirRegla);
    socket.on('cuadrado',transmitirCuadrado);
    socket.on('circulo',transmitirCirculo);
    socket.on('triangulo',transmitirTriangulo);
    socket.on('addimage',transmitirImagen);
    socket.on('texto',transmitirTexto);
    socket.on('borrar',transmitirBorrar);
    socket.on('controlZ',transmitirControlZ);
//windowWidth devuelve el ancho de la pantalla del ordenador en donde se abre el proyecto

  //permite crear un acanvaz o lienzo sobre una pagina, los parametros hacen referencia al tamaño que se desea tener
  //cnv pemite tener el canvas como un objeto y manipularlo
 cnv=createCanvas(1200,500);
 //este metodo permite centrar el canvas en la mitad de la pantalla
 cnv.position(80,75);
 //este metodo le da color al canvas, los parametros son una referencia al color en RGB
 background(88,100,70);
 //este operacion permite arrastrar y soltar objetos de tipo fichero(archivos o imagenes) sobre el canvas
 cnv.drop(gotFile);
 input = createInput();
 input.id("mitexto");
 input.style("position:absolute;left:26%;top:93% ; font: 30px Arial; ;display: none;height:40px;width:250px;");
 textStyle(NORMAL);
}

function draw() {
  if (texto==true) {
    document.getElementById("IndicadorParaElTexto").style.display = "block";
    input.style("display:block");
  }else{
    document.getElementById("IndicadorParaElTexto").style.display = "none";
    input.style("display:none");
  }
  if (lapiz==true) {
    colocar.innerHTML = 'Tamaño grosor: ' + lapiztamano + 'px';
  }else if (regla==true) {
      colocar.innerHTML = 'Tamaño grosor: ' + reglatamano + 'px';
  }else if (Borrador==true) {
      colocar.innerHTML = 'Tamaño radio: ' + borradortamano + 'px';
  }else if(imprimir_imagen==true){
      colocar.innerHTML = 'Tamaño largoAncho: ' + imgtamano + 'px';
  }else if(cuadrado==true){
      colocar.innerHTML = 'Tamaño lado: ' + CuadradoTamanoP + 'px';
  }else if(circulo==true){
      colocar.innerHTML = 'Tamaño: ' + CirculoTamano + 'px';
  }else if (texto==true) {
      colocar.innerHTML = 'Tamaño: ' + tamanoLetra + 'px';
  }
}
//este metodo permite centrar el canvas en medio de la pantalla
function transicionControlZ(){
    activarMostrado();
}
function keyPressed() {
  if (key=="½") {
       activarMostrado();
  }
}

function transmitirBorrar(dataBorrado){
  background(88,100,70);
}
function transmitirTexto(dataText){
  push();
  textSize(dataText.tam);
  translate(dataText.x, dataText.y);
  text(dataText.nam, 0, 0);
  pop();
}
function transmitirImagen(dataI){
  var imagen = createImg(dataI.i).hide();
  image(imagen, dataI.x, dataI.y, dataI.h, dataI.h);
}

//este metodo sera el que permita enviar informacion sobre lo que se dibuje sobre el canvas al server,
//para luego ser conpartido a otros tableros
function transmitirLapiz(data){
  //este metodo permite dibujar sin que quede un borde sobre el dibujo
  noStroke();
  //los parametros (data.r,data.g ... etc) hacen referencia a un objeto de tipo data
  //que permite recopilar datos de otras metodoes que se ejecutan localmente
  //este metodo le da color a toda figura debajo de este linea de codigo.
  fill(data.r,data.g,data.b);
  //este metodo permite dibujar una ellpise, los parametros hacen referencia al
  //tamaño y pocision de la ellipse
  ellipse(data.x, data.y,data.w,data.w);
var hexa=  "#" + ((1 << 24) + (data.r << 16) + (data.g << 8) + data.b).toString(16).slice(1);
document.getElementById('ColorActual').style.backgroundColor = hexa;
}

function transmitirCuadrado(dataC){
  rect(dataC.r,dataC.s,dataC.m,dataC.m);
}
function transmitirBorrador(dataB){
  noStroke();
  fill(88,100,70);
  ellipse(dataB.x, dataB.y,dataB.w,dataB.w);
}
function transmitirTriangulo(dataT){
  triangle(dataT.x1,dataT.y1,dataT.x2,dataT.y2,dataT.x3,dataT.y3);
}
function transmitirCirculo(dataCi){
  ellipse(dataCi.c, dataCi.d,dataCi.e,dataCi.e);
}

function transmitirRegla(dataR){
  strokeWeight(dataR.a);
  stroke(20);
  line(dataR.t,dataR.u,dataR.l,dataR.p);
}
function transmitirControlZ(data){
  var imagen = createImg(data.ctrlZ).hide();
  image(imagen, 0, 0, data.tamX, data.tamY);
}

//este metodo espera ser activado desde un boton puesto en el fichero index.html
function activarLapiz() {
  //este operacion fuerza al html o mostrar el objeto de nombre "divuno"
  document.getElementById("color-tamaño").style.display = "block"
  //este operacion fuerza al html a desactivar el objeto de nombre "ReglayborradorTamano"
  document.getElementById("ReglayborradorTamano").style.display = "none";
  //esto permite solamente activar la metodo de dibujar y desactivar las demas herramientas
  document.getElementById("ImagenTamano").style.display = "none";
  lapiz=true;
  regla=false;
  Borrador=false;
  circulo=false;
  cuadrado = false;
  triangulo=false;
  texto=false;
}
//este metodo espera ser activado desde un boton puesto en el fichero index.html
function activarRegla(){
  document.getElementById("color-tamaño").style.display = "none"
  document.getElementById("ReglayborradorTamano").style.display = "block";
  document.getElementById("ImagenTamano").style.display = "none";

    //esto permite solamente activar la metodo de crear lineas rectas y desactivar las demas metodos
  regla=true;
  firstclick = false;
  lapiz=false;
  Borrador=false;
  circulo=false;
  cuadrado = false;
  triangulo=false;
  texto=false;
}
//Este metodo permite tomar un pantallazo del canvas actual
function activarPantallazo(){
//este metodo recibe como parametro el canvas a guardar y la extension de la imagen generada
  saveCanvas(cnv,"Pantallazo","jpg");
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=false;
  cuadrado = false;
  triangulo=false;
  texto=false;
}
//este metodo activa la funcionalidad de borrar sobre el tablero
function activarBorrador(){
  document.getElementById("color-tamaño").style.display = "none"
  document.getElementById("ReglayborradorTamano").style.display = "block";
  document.getElementById("ImagenTamano").style.display = "none";
  lapiz=false;
  regla=false;
  Borrador=true;
  circulo=false;
  cuadrado = false;
  triangulo=false;
  texto=false;
}
function activarCuadrado(){
  document.getElementById("color-tamaño").style.display = "block"
  document.getElementById("ReglayborradorTamano").style.display = "none";
  document.getElementById("ImagenTamano").style.display = "none";
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=false;
  cuadrado = true;
  triangulo=false;
  texto=false;
}

//este metodo permite activar la funcionalidad de crear circulos sobre el tablero
function activarCirculo(){
  document.getElementById("color-tamaño").style.display = "block"
  document.getElementById("ReglayborradorTamano").style.display = "none";
  document.getElementById("ImagenTamano").style.display = "none";
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=true;
  cuadrado = false;
  triangulo=false;
  texto=false;
}

function activarTexto(){
  document.getElementById("ImagenTamano").style.display = "none";
  document.getElementById("ReglayborradorTamano").style.display = "none";
  document.getElementById("color-tamaño").style.display = "block"
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=false;
  cuadrado = false;
  triangulo=false;
  texto=true;

}

function activarTriangulo(){
  document.getElementById("color-tamaño").style.display = "block"
  document.getElementById("ReglayborradorTamano").style.display = "none";
  document.getElementById("ImagenTamano").style.display = "none";
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=false;
  cuadrado = false;
  triangulo=true;
  texto=false;
  EsquinaTriangulo = 0;
  CambioDeEsquina();
}
function CambioDeEsquina(){
  if(triangulo){
    EsquinaTriangulo++;
    if(EsquinaTriangulo==5){
      var dataT={
          x1:xArriba,
          y1:yArriba,
          x2:xIzquierda,
          y2:yIzquierda,
          x3:xDerecha,
          y3:yDerecha,
          room:sala
        }
      socket.emit('triangulo',dataT);
      retroceso();
      triangle(xArriba,yArriba,xIzquierda,yIzquierda,xDerecha,yDerecha);
      EsquinaTriangulo=2;
    }
  }
}
function activarMostrado(){
  if(indiceArregloDeControlZ-Aplicar>0){
    var ctx = document.getElementById('defaultCanvas0').getContext('2d');
    var img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0,width,height);
    };
    img.src = ArregloDeImagenes[indiceArregloDeControlZ-Aplicar-1];
    Aplicar++;
    var data={
      ctrlZ:img.src,
      tamX:width,
      tamY :height,
      room:sala
    }
        socket.emit('controlZ',data);

  }
}



function LimpiarTotal(){
  retroceso();
  var dataBorrado = {
    room:sala
  }
  background(88,100,70);
  socket.emit('borrar',dataBorrado);
}
  //este metodo permite aumentar el tamaño del borrador, el lapiz y la regla
function tamanoMas(){
  if (lapiz==true) {
    lapiztamano+=15;

  } else if (regla==true) {
    reglatamano+=1;
  }else if (Borrador==true) {
    borradortamano+=30;
  }
  else if(imprimir_imagen==true){
    imgtamano+=50;
  }
  else if(cuadrado==true){
    CuadradoTamanoP+=20;
  }else if(circulo==true && CirculoTamano>=0){
    CirculoTamano+=10;
  }else if (texto==true) {
      tamanoLetra+=10;
  }
}
//este metodo permite disminuir el tamaño del borrador, el lapiz y la regla
function tamanoMenos(){
  var colocar = document.getElementById('labelParaColocarTamañoTexto');
  if(lapiztamano>0 && lapiz==true){
  lapiztamano-=15;
  }else if (regla==true && reglatamano>0) {
    reglatamano-=1;
  }else if (Borrador==true && borradortamano>0) {
    borradortamano-=30;
  }else if(imprimir_imagen==true && imgtamano>0){
      imgtamano-=50;
  }else if(cuadrado==true && CuadradoTamanoP>0){
      CuadradoTamanoP-=20;
  }else if(circulo==true && CirculoTamano>0){
      CirculoTamano-=10;
  }else if (texto==true && tamanoLetra>0) {
    tamanoLetra-=10;
  }
}
//este metodo permite arrastrar una archivo al canvas
function gotFile(file) {
// se pregunta si el archivo es de tipo imagen
if (file.type === 'image') {
  document.getElementById("color-tamaño").style.display = "none"
  document.getElementById("ReglayborradorTamano").style.display = "none";
  document.getElementById("ImagenTamano").style.display = "block";
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=false;
  cuadrado = false;
  triangulo=false;
  texto=false;
      URLTemp=file.data;
	//Crea un  image DOM element y lo esconde
	img = createImg(file.data).hide();
  //permite activar un la metodoalidad de poner una imagen
	imprimir_imagen=true;
} else {
	println('Not an image file!');
}
}

//este metodo permite alternar entre colores para el lapiz,
//s reciben los colores por parametro desde el fichero index.html de acuerdo a cada boton de color
function tipoColor(R,G,B){
  //aqui se crea una variable data que almacena un conjunto de valores
  var data={
    r:R,
    g:G,
    b:B,
    room:sala
  }
  socket.emit('lapiz',data);
   fill(R,G,B);
 }
//este metodo pse ejecuta cuando el ussuario hace un click derecho contante del raton
function mouseDragged(){
  var hamburguesaEjemplo = document.getElementById('HamburguesaIzquierda');
  var anchoDelMenú = ((3.5*windowWidth)/100);
  if((hamburguesaEjemplo.className == 'hamburger') || (hamburguesaEjemplo.className == 'hamburger is-active' && mouseX>anchoDelMenú)){
    if(mouseY>35){
     //esto permite borrar usando una ellipse de igual color al del tablero
      if(Borrador==true){
        var dataB={
        x:mouseX,
        y:mouseY,
        w:borradortamano,
        room:sala
      }
      socket.emit('borrador',dataB);
    	   noStroke();
         //borradortamano es una variable global que varia de acuerdo a los metodos tamanomas y tamanomenos
         //mouseX y mouseY devuelven la pocision del mouse con respecto al eje X  y  Y
         fill(88,100,70);
         if(contBorrador==50){
           retroceso();
           contBorrador=0;
         }
         contBorrador+=1;
    	    ellipse(mouseX,mouseY,borradortamano,borradortamano);
      }
      //Esto permite dibujar sobre el tablero
      if(lapiz==true){
        var data={
        x:mouseX,
        y:mouseY,
        w:lapiztamano,
        room:sala
      }
        socket.emit('lapiz' , data);
    	   noStroke();
         //cuando se da clic sobre un boton de color este metodo cambia el color de lapiz
    	tipoColor();
      if(contLapiz==50){
        retroceso();
        contLapiz=0;
      }
      //lapiztamano es una variable global que varia de acuerdo a los metodos tamanomas y tamanomenos
      ellipse(mouseX,mouseY,lapiztamano,lapiztamano);
      contLapiz+=1;
      }
    }
  }
}

//este metodo se activa cuando el usuario hace click sobre canvas
function mouseClicked(){
  var hamburguesaEjemplo = document.getElementById('HamburguesaIzquierda');
  var anchoDelMenú = ((3.5*windowWidth)/100);
  if((hamburguesaEjemplo.className == 'hamburger') || (hamburguesaEjemplo.className == 'hamburger is-active' && mouseX>anchoDelMenú)){
    if(mouseY>35 && windowHeight-165 > mouseY){
      if(input.value!=''){
        escribir();
        retroceso();
      }
      //cuando se activa la herramienta regla ser requiere hacer un click sobre el canvas y luego otro en otro punto
      //para generar una recta de un punto a otro
      if (regla==true) {
        stroke(20);
        if(firstclick == true){
          if (ban==false) {
            px=mouseX;
            py=mouseY;
            ban=true;
          }else{
            px2=mouseX;
            py2=mouseY;
            ban=false;
            var dataR={
              t:px,
              u:py,
              l:px2,
              p:py2,
              a:reglatamano,
              room:sala
          }
                //esta ellpise ayuda a indicar en donde se hizo click como para conocer el inicio  y final de la recta
            socket.emit('regla', dataR);
            strokeWeight(reglatamano);
            //este metodo permite dibujar rectas sobre el tablero,los dos primeros parametros son,
            //el punto de inicio de la linea y los otros dos el punto de fin.
            line(px,py,px2,py2);
            retroceso();
          }
        }
        firstclick = true;

            //este metodo permite cambiar el groso de las rectas dibujadas

        ellipse(mouseX, mouseY, 15, 15);
      }

      if (cuadrado==true){
        var dataC={
            r:mouseX,
            s:mouseY,
            m:CuadradoTamanoP,
            room:sala
        }
        socket.emit('cuadrado',dataC);
        rect(mouseX,mouseY,CuadradoTamanoP,CuadradoTamanoP);
        retroceso();
      }
      if(circulo==true){
        var dataCi={
          c:mouseX,
          d:mouseY,
          e:CirculoTamano,
          room:sala
        }
          socket.emit('circulo',dataCi);
          retroceso();
          ellipse(mouseX,mouseY,CirculoTamano,CirculoTamano);
      }
      if(triangulo==true){
          if(EsquinaTriangulo==2){
            xArriba = mouseX;
            yArriba = mouseY;
            CambioDeEsquina();
            ellipse(xArriba,yArriba,8);
            console.log('Primer vertice:'+ xArriba + ' ' +yArriba);
        }
        else if(EsquinaTriangulo==3){
            xIzquierda = mouseX;
            yIzquierda = mouseY;
            CambioDeEsquina();
            ellipse(xIzquierda,yIzquierda,8);
            console.log('Segundo vertice:'+ xIzquierda + ' ' +yIzquierda);
        }
        else if(EsquinaTriangulo==4){
            xDerecha = mouseX;
            yDerecha = mouseY;
            CambioDeEsquina();
            ellipse(xDerecha,yDerecha,8);
            console.log('Tercer vertice:'+ xDerecha + ' ' +yDerecha);

        }
        else{
          CambioDeEsquina();
        }

      }
      //luego de arrastrar la imagen al canvas se debe hacer click sobre cualquier parte de este para que aparezca
      if (imprimir_imagen==true) {
        var dataI={
        i:URLTemp,
        x:mouseX,
        y:mouseY,
        h:imgtamano,
        room:sala
      }
      for (var i = 0; i < 2; i++) {
        socket.emit('user image' , dataI);
      }
        //este metodo permite poner una imagen sobre el canvas
      retroceso();
        image(img, mouseX, mouseY,imgtamano,imgtamano);
        imprimir_imagen=false;
      }
    }
  }
}

function escribir() {
  var name = input.value();
  dataText={
    nam:name,
    x:mouseX,
    y:mouseY,
    tam:tamanoLetra,
    room:sala
  }
  socket.emit('texto', dataText);
  input.value('');
    push();
    tipoColor();
    textSize(tamanoLetra);
    translate(mouseX, mouseY);
    text(name, 0, 0);
    pop();
}

function retroceso(){
  cnv = document.getElementById('defaultCanvas0');
  savedImg = cnv.toDataURL();
  ArregloDeImagenes[indiceArregloDeControlZ]=savedImg;
  indiceArregloDeControlZ++;
  Aplicar=0;
}
