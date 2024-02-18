let fallingLetters = [];
let ripples = [];
let font;
let surfaceHeight = 400

function preload() {
  font = loadFont('MOgent.otf'); // Replace with the path to your font file
}

function setup() {
  createCanvas(800, 800, WEBGL);
  textFont(font);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  rotateX(-45);

  // Update and display ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display();
    if (ripples[i].alpha <= 0) {
      ripples.splice(i, 1);
    }
  }

  // Update and display falling letters
  for (let i = fallingLetters.length - 1; i >= 0; i--) {
    fallingLetters[i].update();
    fallingLetters[i].display();

    // Check if the letter has reached its limit
    if (fallingLetters[i].y > surfaceHeight) {
      // Create a ripple at the landing position
      let newRipple = new Ripple(fallingLetters[i].x, fallingLetters[i].z);
      ripples.push(newRipple);

      // Remove the letter
      fallingLetters.splice(i, 1);
    }
  }
}

function keyPressed() {
  let newLetter = new FallingLetter(key, random(-width/2, width/2), -height/2, random(-width/2, width/2));
  fallingLetters.push(newLetter);
}

class FallingLetter {
  constructor(letter, x, y, z) {
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.z = z;
    this.speed = random(5, 7);
  }

  update() {
    this.y += random(this.speed - 2, this.speed + 2);
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    text(this.letter, 0, 0);
    pop();
  }
}

class Ripple {
  constructor(x, z) {
    this.x = x;
    this.y = surfaceHeight
    this.z = z;
    this.radius = 1;
    this.alpha = 255;
  }

  update() {
    this.radius += 5;
    this.alpha -= 2;
  }

  display() {
    push();
    translate(this.x, surfaceHeight, this.z); 
    rotateX(90); // Face the screen
    fill(0, this.alpha);
    noFill();
    ellipse(0, 0, this.radius * 2);
    pop();
  }
}