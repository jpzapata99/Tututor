<<<<<<< HEAD
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
function setup() {
  var x=windowWidth;
  var y=windowHeight-100;
 cnv=createCanvas(x,y);
 centerCanvas();
 background(88,100,70);
 cnv.drop(gotFile);

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
function gotFile(file) {
// If it's an image file
if (file.type === 'image') {
	// Create an image DOM element but don't show it
	var img = createImg(file.data).hide();
	// Draw the image onto the canvas
	image(img, mouseX, mouseY,150,150);
} else {
	println('Not an image file!');
}
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
function cargarImg(){}

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
=======
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
var lapiztamano=65;
var reglatamano=4;
var borradortamano=60;
var imprimir_imagen=false;
var img;
function setup() {
  var x=windowWidth;
  var y=windowHeight-100;
 cnv=createCanvas(x,y);
 centerCanvas();
 background(88,100,70);
 cnv.drop(gotFile);

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
  document.getElementById("divuno").style.display = "block"
  document.getElementById("ReglayborradorTamano").style.display = "none";
  lapiz=true;
  regla=false;
  Borrador=false;
  circulo=false;
}

function activarRegla(){
  document.getElementById("divuno").style.display = "none"
  document.getElementById("ReglayborradorTamano").style.display = "block";
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
function LimpiarTotal(){
  background(88,100,70);
}
function activarBorrador(){
  document.getElementById("divuno").style.display = "none"
  document.getElementById("ReglayborradorTamano").style.display = "block";
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
function gotFile(file) {
// If it's an image file
if (file.type === 'image') {
	// Create an image DOM element but don't show it
	img = createImg(file.data).hide();
	imprimir_imagen=true;
} else {
	println('Not an image file!');
}
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
 }
function mouseDragged(){
  if(Borrador==true){
	   noStroke();
	   fill(88,100,70);
	    ellipse(mouseX,mouseY,borradortamano,borradortamano);
  }

  if(lapiz==true){
	   noStroke();
	tipoColor();
  ellipse(mouseX,mouseY,lapiztamano,lapiztamano);
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
        strokeWeight(reglatamano);
        line(px,py,px2,py2);
      }
    }
    firstclick = true;
    ellipse(mouseX, mouseY, 15, 15);
  }
  if (pocisionCirculo==true) {
    pcx=mouseX;
    pcy=mouseY;
    pocisionCirculo=false;
  }
  if (imprimir_imagen==true) {
    image(img, mouseX, mouseY,250,250);
    imprimir_imagen=false;
    img=null;
  }
}
function tamanomas(){
  if (lapiz==true) {
    lapiztamano+=15;
  } else if (regla==true) {
    reglatamano+=1;
  }else if (Borrador==true) {
    borradortamano+=30;
  }
}
function tamanomenos(){
  if(lapiztamano>=0 && lapiz==true){
  lapiztamano-=15;
}else if (regla==true && reglatamano>=0) {
  reglatamano-=1;
}else if (Borrador==true && borradortamano>=0) {
  borradortamano-=30;
}
}
>>>>>>> 123bae8e935d22355d01c5ac1585d31a4f83909b
