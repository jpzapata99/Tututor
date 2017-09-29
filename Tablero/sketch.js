var px = 0;
var py = 0;
var px2=0;
var py2=0;
var ban = false;
var cnv;
var regla = false;
var lapiz = false;
var firstclick = false;
var Borrador=false;
var circulo=false;
var pocisionCirculo=false;
var pcx=0;
var pcy=0;
var img;
var cargarImagen=false;
function setup() {

 cnv=createCanvas(1600, 800);
 centerCanvas();
 background(88,114,70);
 img=loadImage("Imagenes/Paisaje.jpg");

}
function centerCanvas(){
  var x = (windowWidth - width)/2;
  var y = (windowHeight - height)/2;
  cnv.position(x,y);
}

function windowResized(){
  centerCanvas();
}


function activarLapiz() {
  document.getElementById("divuno").style.visibility = "visible";
  lapiz=true;
  regla=false;
  Borrador=false;
  circulo=false;
}

function activarRegla(){
  regla=true;
  firstclick = false;
  lapiz=false;
  Borrador=false;
  circulo=false;
}

function activarPantallazo(){
  saveCanvas(cnv,"Pantallazo","jpg");
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=false;
}

function activarBorrador(){
  lapiz=false;
  regla=false;
  Borrador=true;
  circulo=false;
}

function activarCirculo(){
  lapiz=false;
  regla=false;
  Borrador=false;
  circulo=true;
  pocisionCirculo=true;
}
function cargarImg(){
  loadImage("Imagenes/Paisaje.jpg", function(img) {
    image(img, 300, 300);
    updatePixels();
  });
}
function draw() {
 if (circulo==true) {
   fill(100,100,100,100);
   noStroke();
   ellipse(400,400,300);
 }
}
function tipoColor(R,G,B){
   fill(R,G,B);
 	ellipse(mouseX,mouseY,30,30);
 }
function mouseDragged(){
  if(Borrador==true){
	   noStroke();
	   fill(88,114,70);
	    ellipse(mouseX,mouseY,60,60);
  }

  if(lapiz==true){
	   noStroke();
	tipoColor();
  }
}


function mouseClicked(){
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
        fill(255,255,255);
        line(px,py,px2,py2);
      }
    }
    firstclick = true;
    ellipse(mouseX, mouseY, 20, 20);
  }
  if (pocisionCirculo==true) {
    pcx=mouseX;
    pcy=mouseY;
    pocisionCirculo=false;
  }
}
