const WINDOW_SKETCH = true

const SEED = 'FX'
const NUM_GENERATIONS = 7
const NUM_SYSTEMS = 9

const ROWS = WINDOW_SKETCH ? 9 : 3
const COLS = WINDOW_SKETCH ? 1 : 3
const LINE_LENGTH = WINDOW_SKETCH ? 15 : 25
const LINE_WEIGHT = WINDOW_SKETCH ? 2 : 3

const TRANSFORMATIONS = {
  'X': ['X+YF+', 'XF+YF+', 'XX+YF+', 'F+Y', 'X++YF-F', '-FX-Y+', 'X+FX-Y', 'X+FX-FY', 
        'XF-Y+F', 'X++FY-X', 'X-FY+F-', 'X+YF-X-FY+', 'X+F-FY+', 'X++YF--XF', 'X+FY-FX+Y'],
  'Y': ['-FX-Y', '-FX-FY', '-FX-YY', '-FYX', 'Y+FX-F', 'YF++X-', 'Y-FY+X', '-FY+X', 
        'YF-X++', '-FY+XF', 'Y-+FXY', '-FX+YF+FX-', '+FX-F', 'Y-+FXYF+X', 'YF++X-FY-'],
  'F': 'F',
  '+': '+',
  '-': '-'
}
const DRAWING_RULES = {
  'F': (system) => {   
    let endX = system.x + cos(system.angle) * system.lineLength
    let endY = system.y + sin(system.angle) * system.lineLength

    line(system.x, system.y, endX, endY)

    // wrapping to grid 
    if(endX < 0) endX += (floor(width / LINE_LENGTH) * LINE_LENGTH) + LINE_LENGTH
    else if (endX > width) endX -= (floor(width / LINE_LENGTH) * LINE_LENGTH) + LINE_LENGTH
    if(endY < 0) endY += (floor(height / LINE_LENGTH) * LINE_LENGTH) + LINE_LENGTH
    else if(endY > height) endY -= (floor(height / LINE_LENGTH) * LINE_LENGTH) + LINE_LENGTH

    system.x = endX
    system.y = endY
    system.hue++
  },
  '-': (system) => {
    system.angle -= 90 // left 
  },
  '+': (system) => {
    system.angle += 90 // right
  },
  'X': (system) => {},
  'Y': (system) => {},
}

let systems = [];

function getTransformation() {
  let index = floor(random(TRANSFORMATIONS['X'].length)) // can view specific system types 
  
  return {
    'X': TRANSFORMATIONS['X'][index],
    'Y': TRANSFORMATIONS['Y'][index],
    'F': TRANSFORMATIONS['F'],
    '+': TRANSFORMATIONS["+"],
    '-': TRANSFORMATIONS['-'],
  };
}

function setup() {
  createCanvas(WINDOW_SKETCH ? 390 : windowWidth, WINDOW_SKETCH ? 1215 : windowHeight);
  angleMode(DEGREES)
  colorMode(HSB)

  gridBackground()

  strokeWeight(LINE_WEIGHT)
  for(let i = 0; i < NUM_SYSTEMS; i++){
    systems.push(initSystem(i))
  }
}

function gridBackground() {
  background(240, 75, 20)
  stroke(0, 0, 70, 0.25)
  strokeWeight(0.5)

  for(let x = 0; x < width; x+=LINE_LENGTH){
    for(let y = 0; y < height; y+=LINE_LENGTH){
      line(x, y, x, y+LINE_LENGTH)
      line(x, y, x+LINE_LENGTH, y)
    }
  }
}

function initSystem(index) {
  let axiom = `${SEED}`
  const transformation = getTransformation()
  const hue = floor(random(0, 360))

  for(let i = 0; i < NUM_GENERATIONS; i++) {
    let newString = ""
    for(let j = 0; j < axiom.length; j++) {
      newString += transformation[axiom[j]] || axiom[j]
    }
    axiom = `${newString}`
  }

  let col = (index % COLS)
  let row = (index % ROWS)
  let centerX = random(width * (col) / (COLS), width * (col + 1) / (COLS))
  let centerY = random(height * (row) / (ROWS), height * (row + 1) / (ROWS))

  // snap to grid
  centerX = floor(centerX / LINE_LENGTH) * LINE_LENGTH
  centerY = floor(centerY / LINE_LENGTH) * LINE_LENGTH

  let system = {
    axiom,
    index: 0,
    x: centerX,
    y: centerY,
    angle: 0,
    lineLength: LINE_LENGTH,
    hue: hue,
  }

  return system;
}

function draw() {
  for (let system of systems) {
    stroke(system.hue % 360, 100, 75);
    const i = system.axiom[system.index];
    if (DRAWING_RULES[i]) {
      DRAWING_RULES[i](system);
    }
    system.index = (system.index + 1) % system.axiom.length;
  }
}
