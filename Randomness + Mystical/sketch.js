let xScale = 0.015;
let yScale = 0.02;

let gap = 20;
let offset = 0;

const colors = [200, 0, 110, 325, 270, 165, 25];
let timer;
let hue;
let desireHue;
let startingHue;

let lineSize
const lineWidths = [5, 10, 15, 20, 25, 50]
let lines = []
let currentLine = []
let lineCount = 0;
const lineColors = [15, 75, 90, 120, 140, 160, 175, 190, 215, 240, 250, 270, 285, 300, 315, 345]
let lineColor
let lineLayer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB)
  noStroke();

  timer = 0;
  startingHue = colors[floor(random(colors.length))];
  desireHue = getDesireHue()
  hue = startingHue

  lineSize = lineWidths[floor(random(lineWidths.length))]
  let firstLine = addLine()
  accentLine(firstLine.x, firstLine.y)
  lineColor = lineColors[floor(random(lineColors.length))]

  lineLayer = createGraphics(width, height)
  lineLayer.colorMode(HSB)
  lineLayer.stroke(lineColor, 25, 100, 4 / lineSize)
  lineLayer.strokeWeight(lineSize)
}

function draw() {
  background(230, 70, 20);
  timer += deltaTime / 5000
  if(timer <= 1) {
    hue = lerp(startingHue, desireHue, timer)
  }
  else {
    startingHue = hue;
    desireHue = getDesireHue()
    timer-=1;
  }
  fill(hue, 25, 75);

  //perlin noise circles 
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale, millis() / 3000);
      let diameter = noiseValue * gap;
      circle(x, y, diameter);
    }
  }
  filter(BLUR, 1.75)

  //overlayed accent line
  accentLine(currentLine[currentLine.length-1].x, currentLine[currentLine.length-1].y)

  lineLayer.line(currentLine[currentLine.length-1].x, currentLine[currentLine.length-1].y, 
    currentLine[currentLine.length-2].x, currentLine[currentLine.length-2].y)


  image(lineLayer, 0, 0)


}

function getDesireHue() {
  let color = startingHue;
  while(color == startingHue){
    color = colors[floor(random(colors.length))]
  }
  return color;
}

function accentLine(x, y) {
  if(y < 0) {
    currentLine = []
    let line = addLine()
    x = line.x
    y = line.y
    currentLine.push({x, y})
  } else {
    x += (floor(random(0, 2)) - 0.5) * 25
    y += (floor(random(0, 2))) * -10
  }
  
  currentLine.push({x, y})
}

function addLine() {
  return {x: random(100, width-100), y: random(height-100, height)}
}