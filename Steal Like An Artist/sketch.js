const PIXEL_SCALE = 5
const SEED_POINTS = []
const NUM_POINTS = 24;
const N_INDEX = 0;
// green, blue, yellow, pink, teal, purple
const HUE_RANGE = [{min: 65, max: 125}, {min: 155, max: 250}, {min: 25, max: 50}, 
  {min: 285, max: 360}, {min: 135, max: 200}, {min: 235, max: 275}]

let z = 0
let zScale = 1;
let hueRange;
let zRange;

function setup() {
  createCanvas(400, 400);

  for(let i = 0; i < NUM_POINTS; i++) {
    let x = random(width)
    let y = random(height)
    let z = random(width) 
    SEED_POINTS.push({x, y, z})
  }
  noStroke()
  colorMode(HSB)

  hueRange = HUE_RANGE[floor(random(0, HUE_RANGE.length))]
  zRange = width / 2
}

function draw() {
  z+=zScale

  for(let x = 0; x < width; x+=PIXEL_SCALE) {
    for(let y = 0; y < height; y+=PIXEL_SCALE){
      let distances = []
      for(let i = 0; i < NUM_POINTS; i++) {
        let seedPoint = SEED_POINTS[i]
        distances.push(dist(x, y, z, seedPoint.x, seedPoint.y, seedPoint.z))
      }
      let sorted = sort(distances)
      let hue = map(sorted[N_INDEX], 0, zRange, hueRange.min, hueRange.max)
      let saturation  = map(sorted[N_INDEX + 1], 0, zRange, 25, 50)
      let brightness = map(sorted[N_INDEX + 2], 0, zRange, 25, 100)

      fill(hue, saturation, brightness)
      rect(x, y, PIXEL_SCALE, PIXEL_SCALE)
    }
  }

  updatePoints()

  // if(z > width) zScale = -1
  // if(z < 0) zScale = 1

  // show the points: 
  // fill('pink')
  // SEED_POINTS.forEach(p => circle(p.x, p.y, 10))
}

function updatePoints() {
  for(let i = 0; i < NUM_POINTS; i++) {
    if(SEED_POINTS[i].z < (z - zRange)) {
      let point = SEED_POINTS[i]
      SEED_POINTS.splice(i, 1)
      point.z += random(width, width * 1.5)
      SEED_POINTS.push(point)
      console.log(point)
    }
  }
}

// Inspo: 
// Smoke: https://www.reddit.com/r/generative/comments/1ihdlt3/smoke/?utm_source=share&amp;utm_medium=web3x&amp;utm_name=web3xcss&amp;utm_term=1&amp;utm_content=share_button
// Mist: https://www.reddit.com/r/generative/s/sbzzUROUgc 

// Cellular Noise: 
// https://thebookofshaders.com/12/ 
// https://editor.p5js.org/andrea270872/sketches/z8yozdOnl 

// Worley Noise: https://www.youtube.com/watch?v=4066MndcyCk 
/* 
Implementation: 
1. Randomly distribute points in space 
2. Calculate distances 
- Fn(x) = distance to n closest point 
- x = pixel (x, y)
*/