let webcam;
let model;

let personInFrame = false
let score = 0

let austinLayer;
let austinInFrame = false
let austin;
let austinLeft = -150
let austinRight = 150
let austinX = austinLeft + 25;
let austinY = 250;
let austinRotate = 25
let austinDirection = true // true = right, false = left 
let austinScreenSide = true // true = left, false = right

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  imageMode(CENTER)

  austin = loadImage('austin-a-pose.png')
  austinLayer = createGraphics(width, height)
  austinLayer.angleMode(DEGREES)

  webcam = createCapture(VIDEO)
  webcam.hide()

  cocoSsd.load().then(cocoSsd => {
    model = cocoSsd
  })
}

function draw() {
  background(0)
  image(webcam, width / 2, height / 2, webcam.width * 2, webcam.height * 2)

  // if the webcam is working and the model
  // has been loaded, go ahead...
  if (webcam.width > 0 && model !== undefined) {

    // tensorflow.js requires the input to
    // be in a specific format – we grab the
    // all the pixels (from 0,0 to width,height)
    // from 'drawingContext' (our canvas)...
    const imgData = drawingContext.getImageData(0, 0, width, height);

    // ...and feed that into the model to 
    // find objects in the frame!

    model.detect(imgData).then(predictions => {

      if (predictions.length === 0) {
        personInFrame = false
        // console.log("no predictions")
      }

      // the predictions come back as a list
      for (let p of predictions) {

        if (p.class === 'person') {
          personInFrame = true
          console.log("detected personInFrame")
        }
        else {
          personInFrame = false
          // console.log("other")
        }
      }

    });
  }

  // console.log(personInFrame)

  austinJumpscare()
  moveAustin()

  if (austinLayer) image(austinLayer, width / 2, height / 2, width, height)

  
  fill(255);
  stroke(0);
  strokeWeight(4);

  if (personInFrame && austinInFrame) {
    score--

    textSize(24);
    text("Avoid the \nevil austin!", width - 200, 100)
  } else {
    score++
  }

  textSize(32);
  text(score, width - 150, 50);
}

function austinJumpscare() {
  console.log("austin")
  austinLayer.clear()
  austinLayer.push()
  austinLayer.translate(austinX, austinY)
  austinLayer.rotate(austinRotate)
  austinLayer.image(austin, 0, 0, austin.width / 8, austin.height / 8)
  austinLayer.pop()
}

function moveAustin() {
  if (austinInFrame) {
    // if moving right 
    if (austinDirection === true) {
      // go right 
      austinX += 20

      // if on left side & hit 1/4 of the way across, bounce back 
      if (austinScreenSide && austinX > width / 4) austinDirection = false

      // if off screen, place on other side 
      else if (!austinScreenSide && austinX > width + austinRight) {
        austinInFrame = false
        austinScreenSide = true
        austinX = austinLeft
        austinRotate = 25
      }
    }
    // if moving left 
    else if (austinDirection === false) {

      // go left 
      austinX -= 20

      // if on right side & hit 1/4 of the way across, bounce back 
      if (!austinScreenSide && austinX < width * 3 / 4) {
        austinDirection = true
      }

      // if on the left side & off screen, place on other side 
      else if (austinScreenSide && austinX <= austinLeft) {
        austinInFrame = false
        austinScreenSide = false
        austinX = width + austinRight
        austinRotate = -25
      }
    }
  }
  else {
    // 50% chance for him to spawn 
    let chance = random()
    if (chance < 50) austinInFrame = true
  }
}