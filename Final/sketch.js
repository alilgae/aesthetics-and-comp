let shaderProgram;
let vertexShader;
let fragShader;
let dog;
let webcam;
let activeVisual
let timeOffset = 0;

function preload() {
  vertexShader = loadStrings('shader.vert');
  fragShader = loadStrings('shader.frag');
  dog = loadImage('Shorkie.jpg')
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

  shader(shaderProgram);
  
  // shaderProgram.setUniform('sampledImage', webcam)
  shaderProgram.setUniform('sampledImage', activeVisual)
  shaderProgram.setUniform('time', (millis() - timeOffset) / 1000);
  shaderProgram.setUniform('resolution', [width, height]);
  shaderProgram.setUniform('mouseCoords', [mouseX, mouseY])
  // shaderProgram.setUniform('mouseCoords', [width/2, height/2])
  
  rect(-width/2, -height/2, width, height); // drawing the shader
}

function mouseClicked() {
  timeOffset = millis();
}

function keyPressed() {
  if (key === '1') activeVisual = dog
  else if (key === '2') activeVisual = webcam
}