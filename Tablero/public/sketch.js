
var px = 0;
var py = 0;
var px2=0;
var py2=0;
var ban = false;
var cnv=null;
var regla = false;
var lapiz = false;
var firstclick = false;
var Borrador=false;
var circulo=false;
var pocisionCirculo=false;
var pcx=0;
var pcy=0;
var lapiztamano=65;
var reglatamano=4;
var borradortamano=60;
var imprimir_imagen=false;
var img;
function setup() {
  //me permite conectarme al server y manener una coneccion con el host
  socket = io.connect('http://localhost:3000');
  //Esto me permite comunicarme con el servidor y señalar que quiero enviar
  //el primer parametro hace referencia a un id que se conparte entre el server y el modelo(sketch.js)
  //el segundo parametro hace referencia al metodo en el que dire que voy a enviar al server
socket.on('lapiz' , newLapiz);
socket.on('borrador' , newBorrador);
socket.on('regla' , newRegla);
//socket.on('imagen' , newImagen);
//windowWidth devuelve el ancho de la pantalla del ordenador en donde se abre el proyecto
  var x=windowWidth;
  //windowWidth devuelve el largo de la pantalla del ordenador en donde se abre el proyecto
  var y=windowHeight-100;
  //permite crear un acanvaz o lienzo sobre una pagina, los parametros hacen referencia al tamaño que se desea tener
  //cnv pemite tener el canvas como un objeto y manipularlo
 cnv=createCanvas(x,y);
 //este metodo permite centrar el canvas en la mitad de la pantalla
 centerCanvas();
 //este metodo le da color al canvas, los parametros son una referencia al color en RGB
 background(88,100,70);
 //este operacion permite arrastrar y soltar objetos de tipo fichero(archivos o imagenes) sobre el canvas
 cnv.drop(gotFile);

}

function draw() {}

//este metodo permite centrar el canvas en medio de la pantalla
function centerCanvas(){
  var x = (windowWidth - width)/2;
  var y = (windowHeight - height)/2;
  cnv.position(x,y);
}

function windowResized(){
  centerCanvas();
}
//este metodo sera el que permita enviar informacion sobre lo que se dibuje sobre el canvas al server,
//para luego ser conpartido a otros tableros
function newLapiz(data){
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

function newBorrador(dataB){
  noStroke();
  fill(88,100,70);
  ellipse(dataB.x, dataB.y,dataB.w,dataB.w);
}

function newRegla(dataR){
  strokeWeight(dataR.w);
  line(dataR.x,dataR.y,dataR.x2,dataR.y2);
}

//function newImagen(data){
  //img(data.i, data.x, data.y,300,300);
//}

//este metodo espera ser activado desde un boton puesto en el fichero index.html
function activarLapiz() {
  //este operacion fuerza al html o mostrar el objeto de nombre "divuno"
  document.getElementById("divuno").style.display = "block"
  //este operacion fuerza al html a desactivar el objeto de nombre "ReglayborradorTamano"
  document.getElementById("ReglayborradorTamano").style.display = "none";
  //esto permite solamente activar la metodo de dibujar y desactivar las demas herramientas
  lapiz=true;
  regla=false;
  Borrador=false;
  circulo=false;
}
//este metodo espera ser activado desde un boton puesto en el fichero index.html
function activarRegla(){
  document.getElementById("divuno").style.display = "none"
  document.getElementById("ReglayborradorTamano").style.display = "block";
    //esto permite solamente activar la metodo de crear lineas rectas y desactivar las demas metodos
  regla=true;
  firstclick = false;
  lapiz=false;
  Borrador=false;
  circulo=false;
}
//Este metodo permite tomar un pantallazo del canvas actual
function activarPantallazo(){
//este metodo recibe como parametro el canvas a guardar y la extension de la imagen generada
  saveCanvas(cnv,"Pantallazo","jpg");
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=false;
}
//este metodo activa la funcionalidad de borrar sobre el tablero
function activarBorrador(){
  document.getElementById("divuno").style.display = "none"
  document.getElementById("ReglayborradorTamano").style.display = "block";
  lapiz=false;
  regla=false;
  Borrador=true;
  circulo=false;
}
//este metodo permite activar la funcionalidad de crear circulos sobre el tablero
function activarCirculo(){
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=true;
  pocisionCirculo=true;
}
function LimpiarTotal(){
  //este metodo Borra todo lo dibujado y puesto sobre el canvas
  background(88,100,70);
}
  //este metodo permite aumentar el tamaño del borrador, el lapiz y la regla
function tamanomas(){
  if (lapiz==true) {
    lapiztamano+=15;

  } else if (regla==true) {
    reglatamano+=1;
  }else if (Borrador==true) {
    borradortamano+=30;
  }
}
//este metodo permite disminuir el tamaño del borrador, el lapiz y la regla
function tamanomenos(){
  if(lapiztamano>=0 && lapiz==true){
  lapiztamano-=15;
}else if (regla==true && reglatamano>=0) {
  reglatamano-=1;
}else if (Borrador==true && borradortamano>=0) {
  borradortamano-=30;
}
}
//este metodo permite arrastrar una archivo al canvas
function gotFile(file) {
// se pregunta si el archivo es de tipo imagen
if (file.type === 'image') {
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
 //esto permite borrar usando una ellipse de igual color al del tablero
  if(Borrador==true){
    var dataB={
    x:mouseX,
    y:mouseY,
    w:borradortamano
  }
  socket.emit('borrador',dataB);
	   noStroke();
	   fill(88,100,70);
     //borradortamano es una variable global que varia de acuerdo a los metodos tamanomas y tamanomenos
     //mouseX y mouseY devuelven la pocision del mouse con respecto al eje X  y  Y
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
//este metodo se activa cuando el usuario hace click sobre canvas
function mouseClicked(){
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
          x:px,
          y:py,
          x2:px2,
          y2:py2,
          w:reglatamano
        }
        socket.emit('regla', dataR);
        //este metodo permite cambiar el groso de las rectas dibujadas
        strokeWeight(reglatamano);
        //este metodo permite dibujar rectas sobre el tablero,los dos primeros parametros son,
        //el punto de inicio de la linea y los otros dos el punto de fin.
        line(px,py,px2,py2);
      }
    }
    firstclick = true;
    //esta ellpise ayuda a indicar en donde se hizo click como para conocer el inicio  y final de la recta
    ellipse(mouseX, mouseY, 15, 15);
  }
  //parte aun en desarrollo
  if (pocisionCirculo==true) {
    pcx=mouseX;
    pcy=mouseY;
    pocisionCirculo=false;
  }
  //luego de arrastrar la imagen al canvas se debe hacer click sobre cualquier parte de este para que aparezca
  if (imprimir_imagen==true) {
    //var data={
    //i:img,
    //x:mouseX,
    //y:mouseY
  //}
    //socket.emit('imagen' , data);
    //este metodo permite poner una imagen sobre el canvas
    image(img, mouseX, mouseY,250,250);
    imprimir_imagen=false;
  }
}
