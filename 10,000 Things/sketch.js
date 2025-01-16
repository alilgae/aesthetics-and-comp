let shapes;
let clearx;
let cleary;

function setup() {
  createCanvas(400, 400);
  shapes = 0;
  clearx=0;
  cleary=-10;
}

function draw() {
  strokeWeight(2);
  if(shapes < 100) drawShape(createShape())
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
  fill(0,0,0,20);
  noStroke();
  rect(clearx, cleary, 400, 10);
  cleary++;
  if(cleary > 400) cleary = -10;
}