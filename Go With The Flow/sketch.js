const NOISE_SCALE = 0.005
const LINE_LENGTH = 50
const LINE_GAP = 7.5
const WEIGHT = 75
const center = {x: 400, y: 300}

let field = []

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES)
  strokeWeight(5)

  for(let i = 0; i < 360; i+=LINE_GAP) {
    let xPos = (center.x + (cos(i) * LINE_LENGTH))
    let yPos = (center.y + (sin(i) * LINE_LENGTH))
    let noiseDisplacement = map(noise(xPos*NOISE_SCALE, yPos*NOISE_SCALE), 0, 1, -WEIGHT, WEIGHT)
    
    field.push({x: xPos + noiseDisplacement, y: yPos + noiseDisplacement })
  }
}

function draw() {
  background(255);

  //plot center for visualizing
  point(center.x, center.y)

  //draw circular field
  field.forEach(l => point(l.x, l.y))

}