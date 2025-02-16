const PIXEL_SCALE = 5
const SEED_POINTS = []
const NUM_POINTS = 24;
const N_INDEX = 0;

let timer = 0
let zScale = 1;

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
}

function draw() {
  timer+=zScale
  for(let x = 0; x < width; x+=PIXEL_SCALE) {
    for(let y = 0; y < height; y+=PIXEL_SCALE){
      let distances = []
      for(let i = 0; i < NUM_POINTS; i++) {
        let seedPoint = SEED_POINTS[i]
        let z = (timer)
        distances.push(dist(x, y, z, seedPoint.x, seedPoint.y, seedPoint.z))
      }
      let sorted = sort(distances)
      let hue = map(sorted[N_INDEX], 0, width/2, 0, 360)
      let saturation  = map(sorted[N_INDEX + 1], 0, width/2, 25, 80)
      let brightness = map(sorted[N_INDEX + 2], 0, width/2, 50, 100)

      fill(hue, saturation, brightness)
      rect(x, y, PIXEL_SCALE, PIXEL_SCALE)
    }
  }

  if(timer > width) zScale = -1
  if(timer < 0) zScale = 1

  // show the points: 
  // fill('pink')
  // SEED_POINTS.forEach(p => circle(p.x, p.y, 10))
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