const PIXEL_SCALE = 25
const SEED = { sizeX: 0, sizeY: 0, dataX: [], dataY: [], weightX: 0.5, weightY: 0.5, wDepthX: 3, wDepthY: 3, }
const STITCHES = [[], []]

const ruleTable = [0, 1, 1, 1, 1, 0, 0, 0]; // Rule 30

let xIndex = 0
let yIndex = 0
let xLevel = 0
let yLevel = 0

function setup() {
  createCanvas(1000, 600);
  colorMode(HSB)
  strokeWeight(4)
  stroke(0, 0, 100)

  init()
  setupStitch()

  background(240, 75, 50);
}

function init() {
  SEED.sizeX = width / PIXEL_SCALE
  SEED.sizeY = height / PIXEL_SCALE
  SEED.dataX = getWolfram(SEED.sizeX, SEED.weightX, SEED.wDepthX)
  SEED.dataY = getWolfram(SEED.sizeY, SEED.weightY, SEED.wDepthY)
}

function getWolfram(size, weight, depth) {
  // gives seed as center of generation 
  let startingRow = generateSeed(size, weight)
  let currentRow = []
  startingRow.forEach(e => currentRow.push(e))
  let finalRow;

  for (let x = 0; x < depth; x++) {
    let nextRow = []
    nextRow.push(currentRow[0])
    for (let i = 1; i < currentRow.length-1; i++) {
      let left = currentRow[i - 1]
      let right = currentRow[i + 1]
      let center = currentRow[i]

      let newVal = getState(left, center, right)
      nextRow.push(newVal)
    }
    nextRow.push(currentRow[currentRow.length - 1])
    finalRow = []
    currentRow = []
    nextRow.forEach(e => {
      finalRow.push(e)
      currentRow.push(e)
    })
  }
  return finalRow
}

function getState(a, b, c) {
  let index = (a << 2) | (b << 1) | c;

  return ruleTable[index];
}


function generateSeed(length, weight) {
  let seed = []
  for (let i = 0; i < length; i++) {
    let rng = random()
    if (rng < weight) seed.push(0)
    else seed.push(1)
  }
  return seed;
}

function setupStitch() {
  for (let x = 0; x < SEED.sizeX; x++) {
    STITCHES[0].push([])
    if (SEED.dataX[x] === 0) {
      for (let y = 0; y < SEED.sizeY; y += 2) {
        STITCHES[0][x].push({
          x1: x * PIXEL_SCALE, y1: y * PIXEL_SCALE,
          x2: x * PIXEL_SCALE, y2: (y + 1) * PIXEL_SCALE
        })
      }
    }
    else if (SEED.dataX[x] === 1) {
      for (let y = 0; y < SEED.sizeY; y += 2) {
        STITCHES[0][x].push({
          x1: x * PIXEL_SCALE, y1: (y + 1) * PIXEL_SCALE,
          x2: x * PIXEL_SCALE, y2: (y + 2) * PIXEL_SCALE
        })
      }
    }
  }

  for (let y = 0; y < SEED.sizeY; y++) {
    STITCHES[1].push([])
    if (SEED.dataY[y] === 0) {
      for (let x = 0; x < SEED.sizeX; x += 2) {
        STITCHES[1][y].push({
          x1: x * PIXEL_SCALE, y1: y * PIXEL_SCALE,
          x2: (x + 1) * PIXEL_SCALE, y2: y * PIXEL_SCALE
        })
      }
    }
    else if (SEED.dataY[y] === 1) {
      for (let x = 0; x < SEED.sizeX; x += 2) {
        STITCHES[1][y].push({
          x1: (x + 1) * PIXEL_SCALE, y1: y * PIXEL_SCALE,
          x2: (x + 2) * PIXEL_SCALE, y2: y * PIXEL_SCALE
        })
      }
    }
  }

  console.log(SEED)
  console.log(STITCHES)
}

function draw() {
  drawStitch(0, xLevel, xIndex)
  drawStitch(1, yLevel, yIndex)

  xIndex++
  if (xIndex >= STITCHES[0][xLevel].length) {
    xIndex = 0;
    xLevel++
  }

  yIndex++
  if (yIndex >= STITCHES[1][yLevel].length) {
    yIndex = 0
    yLevel++
  }

  // console.log("x: ", xIndex, "y: ", yIndex)
}

function drawStitch(axis, level, index) {
  const stitch = STITCHES[axis][level][index]
  line(stitch.x1, stitch.y1, stitch.x2, stitch.y2)
}