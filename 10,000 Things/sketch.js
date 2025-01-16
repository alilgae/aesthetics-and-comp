let shapes;

function setup() {
  createCanvas(400, 400);
  shapes = 0;
}

function draw() {
  strokeWeight(2);
  if(shapes < 10000) drawShape(createShape())
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