let fallingLetters = [];
let ripples = [];
let font;
let surfaceHeight = 400

function preload() {

  font = loadFont('MOgent.otf');

}

function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font);
  angleMode(DEGREES);

}

function draw() {

  background(220);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0);
  rotateX(-45);

  // ==== UPDATE RIPLLES
  for (let i = ripples.length - 1; i >= 0; i--) {

    ripples[i].update();
    ripples[i].display();

    if (ripples[i].alpha <= 0) {
      ripples.splice(i, 1);
    }

  }

  // ==== UPDATE LETTERS
  for (let i = fallingLetters.length - 1; i >= 0; i--) {
    fallingLetters[i].update();
    fallingLetters[i].display();

    // have they reached "surface?"
    if (fallingLetters[i].y > surfaceHeight) {

      // create ripple where they land
      let newRipple = new Ripple(fallingLetters[i].x, fallingLetters[i].z);
      ripples.push(newRipple);

      // remove letter
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
    rotateX(90);
    fill(0, this.alpha);
    noFill();
    ellipse(0, 0, this.radius * 2);
    pop();

  }

}