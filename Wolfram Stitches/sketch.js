const PIXEL_SCALE = 25
const SEED = { sizeX: 0, sizeY: 0, dataX: [], dataY: [], weightX: 0.5, weightY: 0.5, wDepthX: 30, wDepthY: 30, ruleTable: [], }
const STITCHES = [[], []]

// Rules: 30, 54, 150, 60, 62, 90, 122
const ruleTable = [
  [0, 1, 1, 1, 1, 0, 0, 0], 
  [0, 0, 1, 1, 0, 1, 1, 0], 
  [1, 0, 0, 1, 0, 1, 1, 0], 
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 1, 1, 0, 1, 0],
  [0, 1, 1, 1, 1, 0, 1, 0]
];

let xIndex = 0
let yIndex = 0
let xLevel = 0
let yLevel = 0

let xIndexStart;
let yIndexStart;
let xLevelStart;
let yLevelStart;

let endX
let endY
let resetTimer

function setup() {
  createCanvas(802, 602);
  colorMode(HSB)
  strokeWeight(4)
  stroke(0, 0, 100)
  frameRate(12)

  init()
}

function init() {
  SEED.ruleTable = ruleTable[floor(random(ruleTable.length))]
  console.log(SEED.ruleTable)

  SEED.sizeX = width / PIXEL_SCALE
  SEED.sizeY = height / PIXEL_SCALE
  SEED.wDepthX = floor(random(3, 60))
  SEED.wDepthY = floor(random(3, 60))
  SEED.dataX = getWolfram(SEED.sizeX, SEED.weightX, SEED.wDepthX)
  SEED.dataY = getWolfram(SEED.sizeY, SEED.weightY, SEED.wDepthY)

  setupStitch()

  yLevelStart = STITCHES[1].length - 1
  yIndexStart = STITCHES[1][yLevelStart].length - 1

  yLevel = yLevelStart
  yIndex = yIndexStart

  xLevelStart = 0
  xIndexStart = 0

  xLevel = xLevelStart
  xIndex = xIndexStart

  endX = false
  endY = false
  resetTimer = 0;

  drawBackground()
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
    for (let i = 1; i < currentRow.length - 1; i++) {
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

function drawBackground() {
  let binary = getWolfram(9, 0.5, 2).join('')
  let parsed = parseInt(binary, 2)
  let h = floor(map(parsed, 0, 512, 140, 290))
  let s = 75
  let b = 80
  background(h, s, b)

  // circles 
  let numCircles = ceil(random(100, 500))
  for(let i = 0; i < numCircles; i++) {
    let x = random(width)
    let y = random(height)
    let circleWidth = random(75, 250)
    let hueOffset = floor(random(-20, 20))
    let saturationOffset = floor(random(-25, 25))
    let brightnessOffset = floor(random(-20, 5))
    let alpha = 0.25
    let alphaOffset = floor(random(-0.1, 0.1))

    let fillColor = color(h + hueOffset, s + saturationOffset, b + brightnessOffset, alpha + alphaOffset)
    fill(fillColor)
    stroke(h + hueOffset, s + saturationOffset, b / 2, alpha + alphaOffset)
    strokeWeight(2)
    circle(x, y, circleWidth)
  }
}

function getState(a, b, c) {
  let index = (a << 2) | (b << 1) | c;

  return SEED.ruleTable[index];
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
  STITCHES[0].length = 0
  STITCHES[1].length = 0

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
}

function draw() {
  if (!endX) drawStitch(0, xLevel, xIndex)
  if (!endY) drawStitch(1, yLevel, yIndex)

  xIndex++
  if (xIndex >= STITCHES[0][xLevel].length) {
    xIndex = xIndexStart;
    xLevel++
  }

  yIndex--
  if (yIndex < 0) {
    yIndex = yIndexStart
    yLevel--
  }

  if (xLevel < 0 || xLevel >= STITCHES[0].length) {
    endX = true
    xLevel = xLevelStart
  }
  if (yLevel < 0 || yLevel >= STITCHES[1].length) {
    endY = true
    yLevel = yLevelStart
  }
  if (endX && endY) resetTimer++
  if (resetTimer > 24) reset()
}

function drawStitch(axis, level, index) {
  strokeWeight(4)
  stroke(0, 0, 100)
  blendMode(BLEND)

  const stitch = STITCHES[axis][level][index]
  line(stitch.x1, stitch.y1, stitch.x2, stitch.y2)
}

function mousePressed() {
  const fs = fullscreen()
  fullscreen(!fs);
}

function windowResized() {
  const fs = fullscreen()
  fs ? resizeCanvas(windowWidth, windowHeight) : resizeCanvas(802, 602)

  reset()
}

function reset() {
  clear()
  init()
}