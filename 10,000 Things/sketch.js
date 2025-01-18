let shapes;
let lowerDiameterBound;
let upperDiameterBound;

// the number of circles drawn before clearing the screen
const maxShapes = 10000;

function setup() {
  createCanvas(400, 400);
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
  }
  if(shapes < maxShapes) drawShape(createShape())
  else animateClear()
}

function createShape(){
  let x = random(400);
  let y = random(400); 
  let d = random(10, 20);
  let c = { r: random(255), g: random(255), b: random(255)}
  return { x, y, d, c };
}

function drawShape(shape){
  fill(shape.c.r, shape.c.g, shape.c.b);
  circle(shape.x, shape.y, shape.d);
  shapes++;
}

function animateClear() {
  fill(0,0,0,100);
  circle(random(400), random(400), random(lowerDiameterBound, upperDiameterBound))
  lowerDiameterBound+=5;
  upperDiameterBound+=5;
}