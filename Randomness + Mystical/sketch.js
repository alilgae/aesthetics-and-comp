let xScale = 0.015;
let yScale = 0.02;

let gap = 15;
let offset = 0;

const colors = [200, 0, 110, 325, 270, 165, 25];
let timer;
let hue;
let desireHue;
let startingHue;

let lineD
const lineWidths = [15, 25, 25, 50, 75]
let lines = []
let currentLine = []
let lineCount = 0;
const lineColors = [15, 75, 90, 120, 140, 160, 175, 190, 215, 240, 250, 270, 285, 300, 315, 345]
let lineColor

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB)
  timer = 0;
  startingHue = colors[floor(random(colors.length))];
  desireHue = getDesireHue()
  hue = startingHue
  lineD = lineWidths[floor(random(lineWidths.length))]
  let firstCircle = addLine()
  accentLine(firstCircle.x, firstCircle.y)
  lineColor = lineColors[floor(random(lineColors.length))]
}

function draw() {
  background(230, 100, 20);
  noStroke();
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
  accentLine(currentLine[currentLine.length-1].x, currentLine[currentLine.length-1].y)

}

function getDesireHue() {
  let color = startingHue;
  while(color == startingHue){
    color = colors[floor(random(colors.length))]
  }
  return color;
}

function accentLine(x, y) {
  stroke(lineColor, 25, 100, 2 / lineD)
  strokeWeight(lineD)
  if(y > 0) {
    x += (floor(random(0, 2)) - 0.5) * 25
    y += (floor(random(0, 2))) * -10
  } else {
    lines.push(currentLine)
    lineCount++
    currentLine = []
    let circle = addLine()
    x = circle.x
    y = circle.y
  }
  
  currentLine.push({x, y})

  for(let j = 0; j < lines.length; j++) {
    for(let i = 1; i < lines[j].length; i++) {
      line(lines[j][i].x, lines[j][i].y, lines[j][i-1].x, lines[j][i-1].y)
    }
  }
  
  for(let i = 1; i < currentLine.length; i++) {
    line(currentLine[i].x, currentLine[i].y, currentLine[i-1].x, currentLine[i-1].y)
  }
}

function addLine() {
  return {x: random(100, width-100), y: random(height-100, height)}
}