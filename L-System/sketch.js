const SEED = 'FX'
const NUM_GENERATIONS = 7
const TRANSFORMATIONS = {
  'X': 'X+YF+',
  'Y': '-FX-Y',
  'F': 'F',
  '+': '+',
  '-': '-'
}
const DRAWING_RULES = {
  'F': () => {
    const endX = state.x + cos(state.angle) * state.lineLength
    const endY = state.y + sin(state.angle) * state.lineLength

    line(state.x, state.y, endX, endY)

    state.x = endX
    state.y = endY
    hue++
  },
  '-': () => {
    state.angle -= 90 // left 
  },
  '+': () => {
    state.angle += 90 // right
  },
  'X': () => {},
  'Y': () => {},
}

let axiom;
let state; 
let index = 0;
let hue = 0;

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES)
  colorMode(HSB)
  init()
}

function init() {
  state = {
    x: width / 2,
    y: height / 2,
    angle: 0,
    lineLength: 10,
  }

  axiom = `${SEED}`
  for(let i = 0; i < NUM_GENERATIONS; i++) {
    let newString = ""
    for(let j = 0; j < axiom.length; j++) {
      newString += TRANSFORMATIONS[axiom[j]] || axiom[j]
    }
    axiom = `${newString}`
  }
}

function draw() {
  // background(0);

  // for(let i = 0; i < axiom.length; i++) {
  //   DRAWING_RULES[axiom[i]]()
  // }

  stroke(hue, 100, 75)
  DRAWING_RULES[axiom[index]]()
  index = (index+1) % axiom.length

}
