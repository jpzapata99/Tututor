
var img;  // Declarar variable 'img'.
var var1;

function setup() {
 var1=createCanvas(720, 300);
 img = loadImage("download.png");  // Cargar la imagen
}

function draw() {
 // Muestra la imagen en su tamaño original en la posición (0,0)
 image(img, 0, 0);
 // Muestra la imagen en la posición (0, height/2) a la mitad del tamaño
 image(img, 0, height/2, img.width/2, img.height/2);
}
