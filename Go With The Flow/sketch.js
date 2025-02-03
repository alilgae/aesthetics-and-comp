const NOISE_SCALE = 0.005
const LINE_LENGTH = 25
const LINE_GAP = 7.5 // range 1 -> 7.5
const WEIGHT = 75

const CENTER = {x: 400, y: 300}
const RADIUS = 20;

let field = []

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES)
  strokeWeight(5)

  for(let r = RADIUS; r < 600; r+=RADIUS){
    for(let i = 0; i < 360; i+=(LINE_GAP * 360)/(TAU * r)) {
      let xPos = (CENTER.x + (cos(i) * (LINE_LENGTH + r)))
      let yPos = (CENTER.y + (sin(i) * (LINE_LENGTH + r)))
      let noiseDisplacement = map(noise(xPos*NOISE_SCALE, yPos*NOISE_SCALE), 0, 1, -WEIGHT, WEIGHT)
      
      field.push({x: xPos + noiseDisplacement, y: yPos + noiseDisplacement })
    }
  }
}

function draw() {
  background(255);

  //plot center for visualizing
  // point(CENTER.x, CENTER.y)

  //draw circular field
  field.forEach(l => point(l.x, l.y))

}