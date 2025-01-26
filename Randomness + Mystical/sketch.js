let xScale = 0.015;
let yScale = 0.02;

let gap = 4;
let offset = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  noStroke();
  
  fill(0);

  //perlin noise circles 
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale, millis() / 2500);
      let diameter = noiseValue * gap;
      circle(x, y, diameter);
    }
  }
}