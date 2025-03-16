const PIXEL_SCALE = 25
const SEED = { sizeX: 0, sizeY: 0, dataX: [], dataY: [], weightX: 0.5, weightY: 0.5}

function setup() {
  createCanvas(800, 600);
  colorMode(HSB)
  strokeWeight(4)
  stroke(0, 0, 100)

  init()

  noLoop()
}

function init() {
  SEED.sizeX = width / PIXEL_SCALE
  SEED.sizeY = height / PIXEL_SCALE
  SEED.dataX = generateSeed(SEED.sizeX, SEED.weightX)
  SEED.dataY = generateSeed(SEED.sizeY, SEED.weightY)
}

function generateSeed(length, weight) {
  let seed = []
  for (let i = 0; i < length; i++) {
    let rng = random()
    if (rng < weight) seed.push("0")
    else seed.push("1")
  }
  return seed;
}

function stitch() {
  for(let x = 0; x < SEED.sizeX; x++) {
    if(SEED.dataX[x] === "0") {
      for(let y = 0; y < SEED.sizeY; y+=2){
        line(x * PIXEL_SCALE, y * PIXEL_SCALE, x * PIXEL_SCALE, (y + 1) * PIXEL_SCALE)
      }
    }
    else if(SEED.dataX[x] === "1") {
      for(let y = 0; y < SEED.sizeY; y+=2){
        line(x * PIXEL_SCALE, (y + 1) * PIXEL_SCALE, x * PIXEL_SCALE, (y + 2) * PIXEL_SCALE)
      }
    }
  }

  for(let y = 0; y < SEED.sizeY; y++) {
    if(SEED.dataY[y] === "0") {
      for(let x = 0; x < SEED.sizeX; x+=2){
        line(x * PIXEL_SCALE, y * PIXEL_SCALE, (x + 1) * PIXEL_SCALE, y * PIXEL_SCALE)
      }
    }
    else if(SEED.dataY[y] === "1") {
      for(let x = 0; x < SEED.sizeX; x+=2){
        line((x + 1) * PIXEL_SCALE, y * PIXEL_SCALE, (x + 2) * PIXEL_SCALE, y * PIXEL_SCALE)
      }
    }
  }

}

function draw() {
  background(240, 75, 50);
  stitch()

}
