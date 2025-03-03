const PIXEL_SCALE = 15
const GRID_SIZE = 40

let grid;
let baseHue;

const PATTERNS = {
  'Block': drawBlock, 
  'Beehive': drawBeehive, 
  'Loaf': drawLoaf, 
  'Boat': drawBoat, 
  'Tub': drawTub,
  'Blinker': drawBlinker,
  'Toad': drawToad,
  'Beacon': drawBeacon,
}

function setup()  {
  createCanvas(GRID_SIZE * PIXEL_SCALE, GRID_SIZE * PIXEL_SCALE)
  colorMode(HSB)
  noStroke()
  frameRate(10)

  grid = create2DArray(GRID_SIZE, GRID_SIZE)
  for(let i = 0; i < GRID_SIZE; i++){
    for(let j = 0; j < GRID_SIZE; j++){
      grid[i][j] = floor(random(2))
    }
  }

  baseHue = floor(random(360))
}

function create2DArray(cols, rows) {
  let array = new Array(cols)
  for(let i = 0; i < cols; i++) {
    array[i] = new Array(rows)
  }

  return array;
}

function draw() {
  // background(220)

  for(let i = 0; i < GRID_SIZE; i++){
    for(let j = 0; j < GRID_SIZE; j++){
      let x = i * PIXEL_SCALE
      let y = j * PIXEL_SCALE
      let c = grid[i][j] == 1 ? baseHue : (baseHue + 90) % 360
      fill(c, 60, 90)
      rect(x, y, PIXEL_SCALE, PIXEL_SCALE)
    }
  }


    grid = getNext()
}

function getNext() {
  let next = create2DArray(GRID_SIZE, GRID_SIZE)

  for(let i = 0; i < GRID_SIZE; i++){
    for(let j = 0; j < GRID_SIZE; j++){
      let neighbors = getNeighbors(grid, i, j)
      
      if(grid[i][j] == 1){
        if(neighbors < 2 || neighbors > 3) next[i][j] = 0
        else next[i][j] = 1
      } else if(neighbors == 3) {
        next[i][j] = 1
      } else {
        next[i][j] = 0
      }
      
    }
  }

  let mouseLocation = getMouseGridLoc()
  if(mouseLocation) next[mouseLocation.x][mouseLocation.y] = 1

  return next;
}

function getNeighbors(grid, x, y) {
  let aliveNeighbors = 0;
  for(let i = -1; i < 2; i++) {
    for(let j = -1; j < 2; j++) {
      if(i == 0 && j == 0) continue
      if(x + i < 0 || x + i > GRID_SIZE-1) continue
      if(y + j < 0 || y + j > GRID_SIZE-1) continue
      
      aliveNeighbors += grid[x + i][y + j]
    }
  }

  return aliveNeighbors
}

function getMouseGridLoc() {
  let x = mouseX
  let y = mouseY

  let loc = {x: -1, y: -1}
  if(x < 0 || x > width - PIXEL_SCALE/2) return
  if(y < 0 || y > height - PIXEL_SCALE/2) return
  if(x == 0 && y == 0) return

  loc.x = floor(x / PIXEL_SCALE)
  loc.y = floor(y / PIXEL_SCALE)

  return loc
}

function mousePressed() {
  let mouseLocation = getMouseGridLoc()
  if(mouseLocation) generatePattern(grid, mouseLocation.x, mouseLocation.y)
  // if(mouseLocation) drawBeacon(grid, mouseLocation.x, mouseLocation.y)

}

function generatePattern(grid, x, y) {
  let patterns = Object.keys(PATTERNS)
  let index = floor(random(patterns.length))
  PATTERNS[patterns[index]](grid, x, y)
}

function drawBlock(grid, x, y) {
  grid[x][y] = 1
  if(x + 1 < GRID_SIZE) grid[x+1][y] = 1
  if(y + 1 < GRID_SIZE) grid[x][y+1] = 1
  if(x + 1 < GRID_SIZE && y + 1 < GRID_SIZE) grid[x+1][y+1] = 1
}

function drawBeehive(grid, x, y) {
  grid[x][y] = 1
  if(x + 1 < GRID_SIZE && y - 1 > 0) grid[x+1][y - 1] = 1 
  if(x + 2 < GRID_SIZE && y - 1 > 0) grid[x+2][y - 1] = 1 
  if(x + 1 < GRID_SIZE && y + 1 < GRID_SIZE) grid[x+1][y + 1] = 1 
  if(x + 2 < GRID_SIZE && y + 1 < GRID_SIZE) grid[x+2][y + 1] = 1 
  if(x + 3 < GRID_SIZE) grid[x+3][y] = 1
}

function drawLoaf(grid, x, y) {
  grid[x][y] = 1
  if(x + 1 < GRID_SIZE && y - 1 > 0) grid[x+1][y-1] = 1
  if(x + 1 < GRID_SIZE && y + 1 < GRID_SIZE) grid[x+1][y+1] = 1
  if(x + 2 < GRID_SIZE && y - 1 > 0) grid[x+2][y-1] = 1
  if(x + 2 < GRID_SIZE && y + 2 < GRID_SIZE) grid[x+2][y+2] = 1
  if(x + 3 < GRID_SIZE) grid[x+3][y] = 1
  if(x + 3 < GRID_SIZE && y + 1 < GRID_SIZE) grid[x+3][y+1] = 1
}

function drawBoat(grid, x, y) {
  grid[x][y] = 1
  if(x + 1 < GRID_SIZE) grid[x+1][y] = 1
  if(y + 1 < GRID_SIZE) grid[x][y+1] = 1
  if(x + 2 < GRID_SIZE && y + 1 < GRID_SIZE) grid[x+2][y+1] = 1
  if(x + 1 < GRID_SIZE && y + 2 < GRID_SIZE) grid[x+1][y+2] = 1
}

function drawTub(grid, x, y){
  grid[x][y] = 1
  if(x - 1 > 0 && y + 1 < GRID_SIZE) grid[x-1][y+1] = 1
  if(x + 1 < GRID_SIZE) grid[x+1][y+1] = 1
  if(y + 2 < GRID_SIZE) grid[x][y+2] = 1
}

function drawBlinker(grid, x, y) {
  grid[x][y] = 1

  // no space horizontal 
  if(x - 1 < 0 || x + 1 > GRID_SIZE) {
    // only space vertical
    if(y - 1 > 0 && y + 1 < GRID_SIZE) {
      grid[x][y-1] = 1
      grid[x][y+1] = 1
    }
  }
  // no space vertical 
  if(y - 1 < 0 || y + 1 > GRID_SIZE) {
    // only space horizontal
    if(x - 1 > 0 && x + 1 < GRID_SIZE) {
      grid[x-1][y] = 1
      grid[x+1][y] = 1
    }
  }
  // space either way 
  else {
    let direction = floor(random(2))
    if(direction == 0){
      grid[x][y-1] = 1
      grid[x][y+1] = 1
    }
    else {
      grid[x-1][y] = 1
      grid[x+1][y] = 1
    }
  }
}

function drawToad(grid, x, y) {
  grid[x][y] = 1
  if(x + 1 < GRID_SIZE) grid[x+1][y] = 1
  if(x + 2 < GRID_SIZE) grid[x+2][y] = 1
  if(x + 1 < GRID_SIZE && y - 1 > 0) grid[x+1][y-1] = 1
  if(x + 2 < GRID_SIZE && y - 1 > 0) grid[x+2][y-1] = 1
  if(x + 3 < GRID_SIZE && y - 1 > 0) grid[x+3][y-1] = 1
}

function drawBeacon(grid, x, y) {
  grid[x][y] = 1
  if(x + 1 < GRID_SIZE) grid[x+1][y] = 1
  if(y + 1 < GRID_SIZE) grid[x][y+1] = 1
  if(x + 1 < GRID_SIZE && y + 1 < GRID_SIZE) grid[x+1][y+1] = 1

  if(x + 2 < GRID_SIZE && y + 2 < GRID_SIZE) grid[x+2][y+2] = 1
  if(x + 3 < GRID_SIZE && y + 2 < GRID_SIZE) grid[x+3][y+2] = 1
  if(x + 2 < GRID_SIZE && y + 3 < GRID_SIZE) grid[x+2][y+3] = 1
  if(x + 3 < GRID_SIZE && y + 3 < GRID_SIZE) grid[x+3][y+3] = 1
}