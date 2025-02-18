const PIXEL_SCALE = 5
const FULLSCREEN_SCALE = 10
const SEED_POINTS = []
const NUM_POINTS = 24;
const N_INDEX = 0;
const SPEED = 1.5

// green, blue, yellow, pink, teal, purple
const HUE_RANGE = [{min: 65, max: 125}, {min: 155, max: 250}, {min: 25, max: 50}, 
  {min: 285, max: 360}, {min: 135, max: 200}, {min: 235, max: 275}]

let currentZ = 0
let hueRange;
let zRange;

function setup() {
  createCanvas(400, 400);

  noStroke()
  colorMode(HSB)

  hueRange = HUE_RANGE[floor(random(0, HUE_RANGE.length))]

  init()
}

function init() {
  SEED_POINTS.length = 0;

  for(let i = 0; i < NUM_POINTS; i++) {
    let x = random(width)
    let y = random(height)
    let z = random(width) 
    SEED_POINTS.push({x, y, z})
  }

  zRange = width / 2
}

function draw() {
  currentZ+=(deltaTime / 100) * SPEED

  for(let x = 0; x < width; x+=fullscreen() ? FULLSCREEN_SCALE : PIXEL_SCALE) {
    for(let y = 0; y < height; y+=fullscreen() ? FULLSCREEN_SCALE : PIXEL_SCALE){
      let sorted = generateNoise(x, y)

      let hue = map(sorted[N_INDEX], 0, zRange, hueRange.min, hueRange.max)
      let saturation  = map(sorted[N_INDEX + 1], 0, zRange, 25, 50)
      let brightness = map(sorted[N_INDEX + 2], 0, zRange, 25, 100)

      fill(hue, saturation, brightness)
      rect(x, y, fullscreen() ? FULLSCREEN_SCALE : PIXEL_SCALE, fullscreen() ? FULLSCREEN_SCALE : PIXEL_SCALE)
    }
  }

  updatePoints()

  // show the points: 
  // fill('pink')
  // SEED_POINTS.forEach(p => circle(p.x, p.y, 10))
}

function generateNoise(x, y){
  let distances = []
  SEED_POINTS.forEach(seedPoint => distances.push(dist(x, y, currentZ, seedPoint.x, seedPoint.y, seedPoint.z)))

  return sort(distances)
}

function updatePoints() {
  for(let i = 0; i < NUM_POINTS; i++) {
    if(SEED_POINTS[i].z < (currentZ - zRange)) {
      // remove out of bounds point
      let point = SEED_POINTS[i]
      SEED_POINTS.splice(i, 1)

      // add new point at higher z
      point.x += random(-50, 50)
      point.y += random(-50, 50)
      point.z += random(width, width * 1.5)
      SEED_POINTS.push(point)
    }
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    const fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  const fs = fullscreen()
  fs ? resizeCanvas(windowWidth, windowHeight) : resizeCanvas(400, 400)

  init()
}

// Inspo: 
// Smoke: https://www.reddit.com/r/generative/comments/1ihdlt3/smoke/?utm_source=share&amp;utm_medium=web3x&amp;utm_name=web3xcss&amp;utm_term=1&amp;utm_content=share_button
// Mist: https://www.reddit.com/r/generative/s/sbzzUROUgc 

// Cellular Noise: 
// https://thebookofshaders.com/12/ 
// https://editor.p5js.org/andrea270872/sketches/z8yozdOnl 

// Worley Noise: https://www.youtube.com/watch?v=4066MndcyCk 