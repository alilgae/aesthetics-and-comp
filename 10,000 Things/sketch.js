function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  strokeWeight(2);
  for(let i = 0; i < 10000; i++) {
    drawShape(createShape());
  }
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
}