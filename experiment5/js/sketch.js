var particles = [];
var maxAge = 40;
  var agingScale = 3;
  var distanceCutoff = 20;
  var colorStep = 30;

var trails = [];
var posScale = 100;
  var originOffset = -4;
  var offsetMax = 4;
var maxVel_trail = 20;
  var minVel_trail = 5;
var deadVel = 0.5;
var maxAge_trail = 40;
var trailAvailable = false;
  var maxTrailCooldown = 4;
  var minTrailCooldown = 0.5;
  var nextCooldown = 1;
  var trailCooldown = 0;

let mic;
  var boomDetected = false;
  var boomCLick = false;
  var volumeCutoff = 100;
  var volumeScaling = 10000;
  var volumeReduction = 500;

function setup() {

	angleMode(DEGREES);  // instead of radians
  
	createCanvas(windowWidth, windowHeight, WEBGL);
	background(100);
  
	noStroke();

  mic = new p5.AudioIn();
  mic.start();

}

function draw() {
	
  offset = 0;
	background(0);


  // ===== PARTICLES SYSTEM
	for(var i = 0; i<particles.length; i++){    // update trails
		particles[i].update();
	}
  
	for(var i = 0; i<particles.length; i++){    // update trails list
      
		if(particles[i+offset].ded){
          
			particles.splice(i+offset, 1);
			offset--;
			i++;
          
		}
	}


  // ===== TRAILS SYSTEM
  if (!trailAvailable) {

    trailCooldown += (deltaTime/1000);

    if (trailCooldown >= nextCooldown) {

      trailCooldown = 0;
      nextCooldown = random(minTrailCooldown, maxTrailCooldown);
      var randStartPos = [int(random(-offsetMax, offsetMax)), int(random(-offsetMax, offsetMax))]
      trails.push(new trail(randStartPos));

    }

  }

  for(var i = 0; i<trails.length; i++){    // update trails
		trails[i].update();
	}
  
	for(var i = 0; i<trails.length; i++){    // update trails list
      
		if(trails[i].ded){
          
			trails.splice(i, 1);
			offset--;
			i++;
          
		}
	}


  // ===== AUDIO DETECTION
  let vol = mic.getLevel();
  vol *= volumeScaling;
  vol = round(vol);
  if (vol > volumeCutoff) {

    boomDetected = true;

  } else {

    boomDetected = false;
    boomCLick = false;

  }

  if (boomDetected && !boomCLick) {

    boomCLick = true;
    Explode(vol);
    console.log("BOOM DETECTED - " + vol);

  }

}

function Explode(volume) {
  
  if (trails.length > 0) {

    var currTrail = trails[0];
    var currPos = [currTrail.x, currTrail.y, currTrail.z];
    var currColor = currTrail.color;

    trails.shift();

    var partCount = (round(volume/100)) * 200

    for(var i = 0; i<partCount; i++){        // push 500 particles
        
      particles.push(new particle(volume, currPos, currColor));
        
    }

  }
  
}

class trail {


  constructor(startPos) {

        // POSITION
    this.x = startPos[0] * posScale;
    this.y = -originOffset * posScale;
    this.z = startPos[1] * posScale;
     
        // VELOCITY
    this.vel = random(minVel_trail, maxVel_trail)
    this.total = 0.5/this.vel;
    this.vel = 10;
     
        // AGE AND MISC
    var r = random(255); // r is a random number between 0 - 255
    var g = random(255); // g is a random number betwen 100 - 200
    var b = random(255); // b is a random number between 0 - 100
    this.color = [r, g, b];
    this.ded = false;
     
  }
 
  update(){
     
        // AGING
    if(this.ded === false && this.vel < deadVel) { this.ded = true; console.log("DIED")}  // age limit
     
        // VELOCITY MODIFICATION
    this.vel = this.vel * random(0.96, 1.001)
    this.y -= this.vel;
     
        // coloring?
    if(this.color<240){
      fill(this.color[0], this.color[0], this.color[0]);
    }
    else{
      fill(this.color);
    }
     
        // DISPLACEMENT
    translate(this.x, this.y, this.z);
    sphere(10, 8, 4);
    translate(-this.x, -this.y, -this.z);
    
  }


}


class particle{
  
	constructor(volume, startPos, color){
      
    var velConst = volume/volumeReduction;

        // POSITION
		this.x = startPos[0];
		this.y = startPos[1];
		this.z = startPos[2];
      
        // VELOCITY
		this.vel = [random(-velConst, velConst), random(-velConst, velConst), random(-velConst, velConst)];
		this.total = 0.5/(sqrt((this.vel[0]*this.vel[0])+(this.vel[1]*this.vel[1])+(this.vel[2]*this.vel[2]))+random(-0.9, -0.3));
		this.vel = [this.vel[0]*this.total, this.vel[1]*this.total, this.vel[2]*this.total];
      
        // AGE AND MISC
		this.color = color;
    this.primary = this.color[0];
    this.primaryIndex = 0;
    for (var i = 0; i < this.color.length; i++){

      if (this.color[i] > this.color[this.primaryIndex]) {

        this.primary = this.color[i];
        this.primaryIndex = i;

      }

    }

    this.color = [random(this.color[0] - colorStep, this.color[0 + colorStep]), 
                  random(this.color[1] - colorStep, this.color[1 + colorStep]), 
                  random(this.color[2] - colorStep, this.color[2 + colorStep])];
    this.color[this.primaryIndex] = this.primary;

		this.age = 0;
        this.maxAge = maxAge;
        this.ded = false;
      
	}
  
	update(){
      
        // AGING
		this.age += random(0.2, 2);      // so that it sizzles...
		if(this.ded === false && this.maxAge < this.age) { this.ded = true; }  // age limit
        
        // VELOCITY MODIFICATION
		this.vel = [this.vel[0]*random(0.99, 1.001), this.vel[1]*random(0.99, 1.001), this.vel[2]*random(0.99, 1.001)];  // more organic velocity
		this.x += this.vel[0];
		this.y += this.vel[1];
		this.z += this.vel[2];
      
        // coloring?
		if(this.color<240){
			fill(255, this.color, 0);
		}
		else{
			fill(this.color);
		}
      
        // DISPLACEMENT
		translate(this.x, this.y, this.z);
		sphere(10, 8, 4);
		translate(-this.x, -this.y, -this.z);

	}
}
