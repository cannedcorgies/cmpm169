let mic;
let worms = [];
let spawnDelay = 100; // delay in milliseconds between worm spawns
let lastSpawnTime = 0;
let flashThreshold = 0.1; // adjust this threshold for when the worms start flashing
let cameraDistance = 1500; // initial camera distance
let rotationAngle = 130; // initial rotation angle in degrees

function setup() {

  createCanvas(windowWidth, windowHeight, WEBGL);
  mic = new p5.AudioIn();
  mic.start();

}

function draw() {

  background(220);

  // camera setup
  camera(0, 0, cameraDistance, 0, 0, 0, 0, 1, 0);

  // set the scene
  rotateY(radians(0));
  rotateX(radians(60));
  rotateZ(radians(-55));

  // move worms
  for (let worm of worms) { worm.move(); }

  // spawn new worms
  if (millis() - lastSpawnTime > spawnDelay && worms.length < 500) {

    let worm = new Worm(-450, random(height)); // start on the left side
    worms.push(worm);
    lastSpawnTime = millis();   // update to current time

  }

  // analyze the microphone input
  let vol = mic.getLevel();

  // apply audio to worm shape
  for (let worm of worms) { worm.visualize(vol); }

}

class Worm {

  constructor(x, y) {

    this.x = x;
    this.y = y;
    this.z = 0;
    this.speed = 200;
    this.segmentWidth = 20;
    this.segmentHeight = 10;
    this.eyeSize = 4;
    this.color = color(random(255), random(255), random(255));
    this.flashing = false;

  }

  move() {
    
    this.x += this.speed;

    // RESET WORM -- is despawning more taxing?
    if (this.x > width * 4) {

      this.x = 0;
      this.y = random(height);

    }

  }

  visualize(vol) {

    // adjust segment height
    let adjustedHeight = this.segmentHeight + vol * 200;

    // adjust speed with volume
    this.speed = 500 * vol;

    // COLORRRRRR
    fill(this.color);
    noStroke();

    // inchworm up
    for (let i = 0; i < 5; i++) {

      let segmentX = this.x - i * this.segmentWidth;
      let segmentZ = this.z + adjustedHeight * sin(frameCount * 0.1 * i); // adjust y for bending effect
      push();
      translate(segmentX - width / 2, this.y, segmentZ - height / 2);
      box(this.segmentWidth, adjustedHeight, this.segmentWidth);
      pop();

    }

    // flash colors if the audio is too loud
    if (vol > flashThreshold) { this.flashColors(); }

  }

  flashColors() {

    // FLASH RANDOMLY
    this.color = color(random(255), random(255), random(255));

  }
}
