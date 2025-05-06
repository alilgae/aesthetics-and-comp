let shaderProgram;
let vertexShader;
let fragShader;

let dog;
let webcam;
let austin;
let travis;
let schwartz;
let activeVisual
let timerActive = true
let shaderTimer = 0;
let timerModifier = 1;

function preload() {
  vertexShader = loadStrings('shader.vert');
  fragShader = loadStrings('shader.frag');
  dog = loadImage('Shorkie.jpg');
  austin = loadImage('austin.jpg');
  travis = loadImage('travis.jpg');
  schwartz = loadImage('schwartz.jpg');
}

function setup() {
  let xSize = windowWidth;
  let ySize = windowHeight;

  pixelDensity(1);
  createCanvas(xSize, ySize, WEBGL);

  shaderProgram = createShader(vertexShader.join('\n'), fragShader.join('\n'));

  webcam = createCapture(VIDEO);
  webcam.size(xSize, ySize);
  webcam.hide();

  activeVisual = dog
}

function draw() {
  background(0);
  // image(webcam, -width/2, -height/2, width, height)

  if (timerActive) {
    if (keyIsDown(LEFT_ARROW)) timerModifier = 0.5
    else if (keyIsDown(RIGHT_ARROW)) timerModifier = 2
    else timerModifier = 1

    shaderTimer += (deltaTime * timerModifier);
  }

  shader(shaderProgram);

  shaderProgram.setUniform('sampledImage', activeVisual)
  shaderProgram.setUniform('time', shaderTimer / 1000);
  shaderProgram.setUniform('resolution', [width, height]);
  shaderProgram.setUniform('mouseCoords', [mouseX, mouseY])
  // shaderProgram.setUniform('mouseCoords', [width/2, height/2])

  rect(-width / 2, -height / 2, width, height); // drawing the shader
}

function mouseClicked() {
  shaderTimer = 0;
}

function keyPressed() {
  if (key === '1') activeVisual = dog
  else if (key === '2') activeVisual = webcam
  else if (key === '3') activeVisual = austin
  else if (key === '4') activeVisual = travis
  else if (key === '5') activeVisual = schwartz
  else if (key === ' ') timerActive = !timerActive
}