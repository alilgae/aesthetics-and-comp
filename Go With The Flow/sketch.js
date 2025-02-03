const NOISE_SCALE = 0.005
const LINE_GAP = 5 // 1 -> 10 range
const WEIGHT = 75

const CENTER = {x: 400, y: 300}
const SPEED = 0.25
const MIN_LINE_LENGTH = 10
const MAX_LINE_LENGTH = 50
let lineLength = 30
const RING_WEIGHT = 75

let field = []
let pathTimer = 0;
let fieldIndex = 0
const TIME_SCALE = 500

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES)
  colorMode(HSB)
}

function draw() {
  background(0);
  strokeWeight(2)
  stroke(0, 0, 100)
  field.length = 0

  let ringCount = 0
  let deltaR = 0
  for(let r = 50; r < 500; r+=deltaR){
    deltaR = noise(r * 1000)*RING_WEIGHT
    let currField = []
    for(let i = 0; i < 360; i+=map(LINE_GAP, 0, TAU*r, 0, 360)) {
      let xPos = (CENTER.x + (cos(i) * (lineLength + r)))
      let yPos = (CENTER.y + (sin(i) * (lineLength + r)))
      let noiseDisplacement = map(noise(xPos*NOISE_SCALE, yPos*NOISE_SCALE), 0, 1, -WEIGHT, WEIGHT)
      
      currField.push({x: xPos + noiseDisplacement, y: yPos + noiseDisplacement }) 
      point(xPos + noiseDisplacement, yPos + noiseDisplacement)
    }
    ringCount++
    field.push(currField)
  }

  let flowField = field[fieldIndex]

  stroke(getColor(), 100, 100, 0.75)
  strokeWeight(10)
  line(flowField[pathTimer % flowField.length].x, flowField[pathTimer % flowField.length].y, 
    flowField[(pathTimer+1) % flowField.length].x, flowField[(pathTimer+1) % flowField.length].y)

  pathTimer++

  lineLength = map(sin(frameCount * SPEED), -1, 1, MIN_LINE_LENGTH, MAX_LINE_LENGTH)
}

function mousePressed() {
  fieldIndex = (fieldIndex+1) % field.length
}

function getColor() {
  return lerp(0, 360, (pathTimer / TIME_SCALE)) % 360
}