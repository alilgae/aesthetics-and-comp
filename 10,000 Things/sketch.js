let shapes;
let lowerDiameterBound;
let upperDiameterBound;

// the number of circles drawn before clearing the screen
const maxShapes = 10000;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB)
  shapes = 0;
  lowerDiameterBound = 20;
  upperDiameterBound = 40;
  noStroke();
}

function draw() {
  if(lowerDiameterBound > 500) {
    lowerDiameterBound = 20;
    upperDiameterBound = 40;
    shapes = 0;
    clear();
    colorMode(HSB)
  }
  if(shapes < maxShapes) drawShape(createShape())
  else animateClear()
}

function createShape(){
  let x = random(400);
  let y = random(400); 
  let d = random(10, 20);
  let h = random(360)
  return { x, y, d, h };
}

function drawShape(shape){
  fill(shape.h, 45, 100)
  circle(shape.x, shape.y, shape.d);
  shapes++;
}

function animateClear() {
  colorMode(RGB)
  fill(0,0,0,100);
  circle(random(400), random(400), random(lowerDiameterBound, upperDiameterBound))
  lowerDiameterBound+=5;
  upperDiameterBound+=5;
}