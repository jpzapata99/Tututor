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
function centerCanvas(){
  var x = (windowWidth - width)/2;
  var y = (windowHeight - height)/2;
  cnv.position(x,y);
}

function windowResized(){
  centerCanvas();
}

function setup() {
 cnv=createCanvas(1600, 800);
 centerCanvas();
 background(88,114,70);
}

function activarLapiz() {
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
function draw() {
 // Muestra la imagen en su tamaño original en la posición (0,0)
 //image(img, 0, 0);
 // Muestra la imagen en la posición (0, height/2) a la mitad del tamaño
 //image(img, 0, height/2, img.width/2, img.height/2);
 if (circulo==true) {
   ellipse(pcx,pcy,pcx-mouseX);
 }
}

function mouseDragged(){
  if(Borrador==true){
	 noStroke();
	 fill(88,114,70);
	 ellipse(mouseX,mouseY,60,60);
  }

  if(lapiz==true){
	 noStroke();
	 fill(255,255,255);
	 ellipse(mouseX,mouseY,30,30);
  }
  if(circulo==true){
    redraw();
    if (pocisionCirculo==true) {
      pcx=mouseX;
      pcy=mouseY;
      pocisionCirculo=false;
    }

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
}
