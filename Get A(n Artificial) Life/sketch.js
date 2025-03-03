const PIXEL_SCALE = 15
const GRID_SIZE = 40

let grid;

function setup()  {
  createCanvas(GRID_SIZE * PIXEL_SCALE, GRID_SIZE * PIXEL_SCALE)
  colorMode(HSB)
  noStroke()
  grid = create2DArray(GRID_SIZE, GRID_SIZE)
  for(let i = 0; i < GRID_SIZE; i++){
    for(let j = 0; j < GRID_SIZE; j++){
      grid[i][j] = floor(random(2))
    }
  }
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
      let c = grid[i][j] == 1 ? 340 : 210
      fill(c, 100, 100)
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
  if(x < 0 || x > width) return
  if(y < 0 || y > height) return
  if(x == 0 && y == 0) return

  loc.x = floor(x / PIXEL_SCALE)
  loc.y = floor(y / PIXEL_SCALE)

  return loc
}