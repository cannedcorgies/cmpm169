let standardFramerate = 60;
let slowedFramerate = 7;

let pixelIndexMultiplier = 4;

let canvasX = 400;
let canvasY = 400;

let firstLinePos = 0;            //  tv line
let secondLinePos = -canvasY/2;  //  following one 
let lineSpeed = 3;

let frameSize = 100;

let osc; // sound oscillator

function setup() {
  createCanvas(canvasX, canvasY);
  pixelDensity(1);

  osc = new p5.Oscillator();
  osc.setType('sine');        // start at 0, then oscillate up and down
  osc.start();
}

function draw() {
  
  //// ==== SLOWDOWN ====
  if (mouseIsPressed) {
    frameRate(slowedFramerate);
  } else {
    frameRate(standardFramerate);
  }

  //// ==== STATIC GENERATION ====
  //clear();
  loadPixels();

  for (let y = 0; y < height; y++) {
    
    for (let x = 0; x < width; x++) {
      
      let index = (x + y * width) * pixelIndexMultiplier;
      let randomColor = random(255);
      pixels[index + 0] = randomColor;  // blue
      pixels[index + 1] = randomColor;  // red
      pixels[index + 2] = randomColor;  // yellow
      pixels[index + 3] = 255;          // transparency/alpha
      
    }
    
  }

  updatePixels();
  
  //// ==== LINE GENERATION ====
  stroke(0, 0, 0);
  line(0, firstLinePos, canvasY, firstLinePos);
  firstLinePos += lineSpeed;
  if (firstLinePos>canvasY) { firstLinePos = 0; }
  
  line(0, secondLinePos, canvasX, secondLinePos);
  secondLinePos += lineSpeed;
  if (secondLinePos>canvasY) { secondLinePos = 0; }
  
  //// ==== MUSIC FRAME ====
  noFill();
  stroke(255, 0, 0); 
  rect(mouseX, mouseY, frameSize, frameSize);

  //// ==== SOUND GENERATION ====
  // further right and further down, higher the pitch
  let frequency = map(mouseX + mouseY, 0, height, 100, 1000);

  // check pixels touching square
  for (let y = mouseY; y < mouseY + frameSize; y++) {
    
    for (let x = mouseX; x < mouseX + frameSize; x++) {
      
      let index = (x + y * width) * pixelIndexMultiplier;
      let darkness = 255 - pixels[index]; // get darkness from pixel
      osc.freq(frequency + darkness);     // darker the pixel, higher the frequency
      
    }
    
  }
  
}
