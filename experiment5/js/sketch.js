var particles = [];
var maxAge = 40;
  var agingScale = 3;
  var distanceCutoff = 20;

let mic;
  var boomDetected = false;
  var boomCLick = false;
  var volumeCutoff = 70;
  var volumeScaling = 10000;
  var volumeReduction = 500;

function setup() {

	angleMode(DEGREES);  // instead of radians
  
	createCanvas(windowWidth, windowHeight, WEBGL);
	background(100);
  
	for(var i = 0; i<1000; i++){ particles.push(new particle);} // initial explosion
	noStroke();

  mic = new p5.AudioIn();
  mic.start();

}

function draw() {
	
    offset = 0;
	background(51);

  // ===== PARTICLES SYSTEM
	for(var i = 0; i<particles.length; i++){    // update particles
		particles[i].update();
	}
  
	for(var i = 0; i<particles.length; i++){    // update particle list
      
		if(particles[i+offset].ded){
          
			particles.splice(i+offset, 1);
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
    console.log("BOOM DETECTED");

  }

}

class particle{
  
	constructor(volume){
      
    var velConst = volume/volumeReduction;

        // POSITION
		this.x = 0;
		this.y = 0;
		this.z = 0;
      
        // VELOCITY
		this.vel = [random(-velConst, velConst), random(-velConst, velConst), random(-velConst, velConst)];
		this.total = 0.5/(sqrt((this.vel[0]*this.vel[0])+(this.vel[1]*this.vel[1])+(this.vel[2]*this.vel[2]))+random(-0.9, -0.3));
		this.vel = [this.vel[0]*this.total, this.vel[1]*this.total, this.vel[2]*this.total];
      
        // AGE AND MISC
		this.color = random(50, 255);
		this.age = 0;
        this.maxAge = maxAge;
        this.ded = false;
      
	}
  
	update(){
      
        // AGING
        var distance = abs(this.x + this.y + this.z);
      
		this.age += random(0.2, 2);      // so that it sizzles...
		if(this.ded === false && this.maxAge < this.age) { this.ded = true; }  // age limit
        //if(this.ded === false && distance > distanceCutoff) { this.ded = true; }
      
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

function Explode(volume) {
  
	for(var i = 0; i<500; i++){        // push 500 particles
      
		particles.push(new particle(volume));
      
	}
  
}
