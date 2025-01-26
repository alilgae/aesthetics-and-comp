let xScale = 0.015;
let yScale = 0.02;

let gap = 10;
let offset = 0;

const colors = [200, 0, 110, 325, 270, 165, 25];
let timer;
let hue;
let desireHue;
let startingHue;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB)
  timer = 0;
  startingHue = colors[floor(random(colors.length))];
  desireHue = getDesireHue()
  hue = startingHue
}

function draw() {
  background(0);
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
  fill(hue, 100, 75);

  //perlin noise circles 
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale, millis() / 3000);
      let diameter = noiseValue * gap;
      circle(x, y, diameter);
    }
  }

}

function getDesireHue() {
  let color = startingHue;
  while(color == startingHue){
    color = colors[floor(random(colors.length))]
  }
  return color;
}