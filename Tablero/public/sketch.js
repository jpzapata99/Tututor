var px,py,px2,py2 = 0;
var ban,regla,cuadrado,lapiz,firstclick,Borrador,circulo,imprimir_imagen,triangulo,texto = false;
var cnv=null;
var xArriba,yArriba,xIzquierda,yIzquierda, xDerecha, yDerecha,pcx,pcy = 0;
var EsquinaTriangulo = 0;
var lapiztamano=65;
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
ArregloDeImagenes = new Array();
var input;
function setup() {
  //me permite conectarme al server y manener una coneccion con el host
  socket = io.connect('http://localhost:3000');
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
//windowWidth devuelve el ancho de la pantalla del ordenador en donde se abre el proyecto
  var x=windowWidth;
  //windowWidth devuelve el largo de la pantalla del ordenador en donde se abre el proyecto
  var y=windowHeight-140;
  //permite crear un acanvaz o lienzo sobre una pagina, los parametros hacen referencia al tamaño que se desea tener
  //cnv pemite tener el canvas como un objeto y manipularlo
 cnv=createCanvas(x,y);
 //este metodo permite centrar el canvas en la mitad de la pantalla
 centerCanvas();
 //este metodo le da color al canvas, los parametros son una referencia al color en RGB
 background(88,100,70);
 //este operacion permite arrastrar y soltar objetos de tipo fichero(archivos o imagenes) sobre el canvas
 cnv.drop(gotFile);
 input = createInput();
 input.id("mitexto");
 input.style("position:absolute;left:35%;top:94%");
 input.style("background-color: olive;");
 input.style("font: 50px Arial");
 input.style("display: none");
 textStyle(NORMAL);
}

function draw() {
  if (texto==true) {
    input.style("display:block");
  }else{
    input.style("display:none");
  }
}
//este metodo permite centrar el canvas en medio de la pantalla
function centerCanvas(){
  var x = (windowWidth - width)/2;
  var y = (windowHeight - height)/2;
  cnv.position(x,y);
}

function windowResized(){
  centerCanvas();
}

function transmitirBorrar(){
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
  CambioDeEsquina();
}
function CambioDeEsquina(){
  EsquinaTriangulo++;
  if(EsquinaTriangulo==5){
    var dataT={
        x1:xArriba,
        y1:yArriba,
        x2:xIzquierda,
        y2:yIzquierda,
        x3:xDerecha,
        y3:yDerecha
      }
    socket.emit('triangulo',dataT);
    triangle(xArriba,yArriba,xIzquierda,yIzquierda,xDerecha,yDerecha);
    EsquinaTriangulo=2;
  }
}

function activarImagen(){
  document.getElementById("color-tamaño").style.display = "none"
  document.getElementById("ReglayborradorTamano").style.display = "none";
  document.getElementById("ImagenTamano").style.display = "none";
  indiceArregloDeControlZ
  c = document.getElementById("defaultCanvas0");
  imagencopia  = c.toDataURL("image/png");
  ArregloDeImagenes[indiceArregloDeControlZ]=imagencopia;
  indiceArregloDeControlZ++;
}
function activarMostrado(){
 var x=windowWidth;
 var y=windowHeight-140;
 var posicionx = (windowWidth - width)/2;
 var posiciony = (windowHeight - height)/2;
 if(indiceArregloDeControlZ-Aplicar>=0){
 var imagenParaPegar = createImg(ArregloDeImagenes[indiceArregloDeControlZ-Aplicar]).show();
 imagenParaPegar.style("display","none");
 imagenParaPegar.style("height",y+"px");
 imagenParaPegar.style("width", x+"px");
 imagenParaPegar.style("position", "absolute");
 imagenParaPegar.style("top",70+"px");
 image(imagenParaPegar,posicionx,posiciony-70);
   if(entroAlRuedo==0){
    entroAlRuedo++;
  }
  else if (entroAlRuedo==1){
    Aplicar++;
    entroAlRuedo=0;
  }
}
}



function LimpiarTotal(){
  //este metodo Borra todo lo dibujado y puesto sobre el canvas
  background(88,100,70);
  socket.emit('borrar');
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
  if(lapiztamano>=0 && lapiz==true){
  lapiztamano-=15;
}else if (regla==true && reglatamano>=0) {
  reglatamano-=1;
}else if (Borrador==true && borradortamano>=0) {
  borradortamano-=30;
}else if(imprimir_imagen==true){
    imgtamano-=50;
}else if(cuadrado==true && CuadradoTamanoP>=0){
    CuadradoTamanoP-=20;
}else if(circulo==true && CirculoTamano>=0){
    CirculoTamano-=10;
}else if (texto==true && tamanoLetra>=0) {
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
    b:B
  }
//aqui se emiten los valores recogidos por data hacia el server
  socket.emit('lapiz' , data);
   fill(R,G,B);
 }

//este metodo pse ejecuta cuando el ussuario hace un click derecho contante del raton
function mouseDragged(){
  if(mouseY>50){

   //esto permite borrar usando una ellipse de igual color al del tablero
    if(Borrador==true){
      var dataB={
      x:mouseX,
      y:mouseY,
      w:borradortamano
    }
    socket.emit('borrador',dataB);
  	   noStroke();
       //borradortamano es una variable global que varia de acuerdo a los metodos tamanomas y tamanomenos
       //mouseX y mouseY devuelven la pocision del mouse con respecto al eje X  y  Y
       fill(88,100,70);
  	    ellipse(mouseX,mouseY,borradortamano,borradortamano);
    }
    //Esto permite dibujar sobre el tablero
    if(lapiz==true){
      var data={
      x:mouseX,
      y:mouseY,
      w:lapiztamano
    }
      socket.emit('lapiz' , data);
  	   noStroke();
       //cuando se da clic sobre un boton de color este metodo cambia el color de lapiz
  	tipoColor();
    //lapiztamano es una variable global que varia de acuerdo a los metodos tamanomas y tamanomenos
    ellipse(mouseX,mouseY,lapiztamano,lapiztamano);
    }
  }
}
//este metodo se activa cuando el usuario hace click sobre canvas
function mouseClicked(){
  if(mouseY>50 && windowHeight-165 > mouseY){
    if(input.value!=''){
      escribir();
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
            a:reglatamano
        }
              //esta ellpise ayuda a indicar en donde se hizo click como para conocer el inicio  y final de la recta
          socket.emit('regla', dataR);
          strokeWeight(reglatamano);
          //este metodo permite dibujar rectas sobre el tablero,los dos primeros parametros son,
          //el punto de inicio de la linea y los otros dos el punto de fin.
          line(px,py,px2,py2);
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
          m:CuadradoTamanoP
      }
      socket.emit('cuadrado',dataC);
      rect(mouseX,mouseY,CuadradoTamanoP,CuadradoTamanoP);
    }
    if(circulo==true){
      var dataCi={
        c:mouseX,
        d:mouseY,
        e:CirculoTamano
      }
        socket.emit('circulo',dataCi);
        ellipse(mouseX,mouseY,CirculoTamano,CirculoTamano);
    }
    if(triangulo==true){
        if(EsquinaTriangulo==2){
          xArriba = mouseX;
          yArriba = mouseY;
          CambioDeEsquina();
          ellipse(xArriba,yArriba,8);
      }
      else if(EsquinaTriangulo==3){
          xIzquierda = mouseX;
          yIzquierda = mouseY;
          CambioDeEsquina();
          ellipse(xIzquierda,yIzquierda,8);
      }
      else if(EsquinaTriangulo==4){
          xDerecha = mouseX;
          yDerecha = mouseY;
          CambioDeEsquina();
          ellipse(xDerecha,yDerecha,8);
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
      h:imgtamano
    }
    for (var i = 0; i <=1; i++) {
      socket.emit('user image' , dataI);
    }
      //este metodo permite poner una imagen sobre el canvas
      image(img, mouseX, mouseY,imgtamano,imgtamano);
      imprimir_imagen=false;
    }
  }
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

function escribir() {
  var name = input.value();
  dataText={
    nam:name,
    x:mouseX,
    y:mouseY,
    tam:tamanoLetra
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
