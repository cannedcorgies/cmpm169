////  NOTES  ////
//  LAST UPDATED: 1-16-2024
//  -  look for Time.deltaTime

// DEFAULTS
let growthRate = 0.075;  // the step of the scale for ripple to reach max diameter
let maxDiameter = 75;    // the target size each ripple will strive for
let pond = [];           // ripples will be stored here - updated in a queue
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let minArcs = 3;
let maxArcs = 7;
let arcDecay = 0.02;
let rippleDifference = -0.5;

let chanceDilution = 0.1;
let distanceDilution = 0.6;

let rippleCap = 4;


function setup() {
  createCanvas(canvasWidth, canvasHeight);
}


function draw() {
  
  background(0, 0, 0);
  
  // RIPPLE UPDATE - update ripples in a queue
  for (let i = 0; i < pond.length; i++) {
  
    pond[i].Grow();    // first, update size
    pond[i].DrawMe();  // then, display on screen
    
    if (pond[i].anglePerArc < 0) {
      
      pond.splice(i, 1);
      
    }
    
  }
  
}


//// MOUSECLICKED() ////
//  - generates ripples when click occurs
//  - ripples generated based on click position
//  
//  STEPS:
//  - values set-up
//  - 
function mouseClicked() {
  
  //// we get some basic values of where the mouse clicked
  var distance = canvasHeight - mouseY;           // distance to click from bottom of the screen
  var distancePercent = distance/canvasHeight;    // what percent it is to the top of the screen
  var percentScalar = distancePercent;            // copy of percent of distance will be used to determine chance of next skip

  // we set up a couple of values to determine the placement of concurrent ripples
  var currDisplacement = 0;     // position offset of current ripple
  var growthStunt = 0;          // growth offset of current ripple ( negative value will result in delay )


  //// ripple generation
  var i = 0;
  
  while (true) {
    
    // ripple cap
    if (i >= rippleCap) {   // if max ripples generated...
      
      break;                  // stop process
      
    }
    
    skip(mouseX, mouseY - currDisplacement, 0 - growthStunt);   // generate a ripple based on offset and delay

    // chance for another ripple
    var window = Math.sin(percentScalar * PI);  // sin so that there is a sweetspot - middle of screen
    var chance = Math.random();
    
    if (chance > window) {    // if "roll" is below chance...
      
        break;                  // generation is done
      
    }
    
    i++;
    percentScalar *= chanceDilution;    // subsequent skips are always less likely
    distance *= distanceDilution;       // ..they are also a bit closer

    // next ripple offsets (pos and time)
    currDisplacement += distance;
    growthStunt += distancePercent * 10;
    
  }
  
}

function skip(posX, posY, growthStart) {
  
  // NEW RIPPLE - add a new ripple to queue every click
  var randomInt = randomInterval(minArcs, maxArcs);
  const newRipple = new Ripple(posX, posY, growthRate, maxDiameter, randomInt, arcDecay, randomPiAngle(), growthStart);
  pond.push(newRipple);
  
  const followRipple = new Ripple(posX, posY, growthRate, maxDiameter, randomInt, arcDecay, randomPiAngle(), growthStart);
  pond.push(followRipple);
  
  var randomInt2 = randomInterval(randomInt, maxArcs + 1);
  const secondRipple = new Ripple(posX, posY, growthRate, maxDiameter, randomInt2, arcDecay, randomPiAngle(), growthStart - rippleDifference);
  pond.push(secondRipple);
  
}


class Ripple {
  
  constructor(posX, posY, rate, maxDiameter, arcsNum, decay, rippleStart, growthStart) {
    
    //// values for ripple - the whole
    this.pos = createVector(posX, posY);
    this.growthScale = growthStart
    this.growthRate = rate;              // scale step
    this.maxDiameter = maxDiameter;      // target size
    
    // values for ripple - the individual segments
    this.arcs = [];
    this.anglePerArc = (2 * PI) / arcsNum;
    this.halfAngle = this.anglePerArc/2;
    this.angleDecay = decay;
    
    //// generate arcs with data needed to draw them
    var currAngle = rippleStart;
    for (let i = 0; i < arcsNum; i++) {
  
      const newArc = {x: posX, 
                      y: posY,
                      d: 0,
                      start: currAngle,
                      stop: currAngle + this.anglePerArc,
                      center: currAngle + this.halfAngle,
                      debugHello: 0}
      
      this.arcs.push(newArc);
      currAngle += this.anglePerArc;

    }
    
  }
  
  Grow() {
    
    if (this.growthScale >= 0) {
      
      for (let i = 0; i < this.arcs.length; i++) {

        // recalculate length of ripple segments given their origin points
        this.arcs[i].start = this.arcs[i].center - this.halfAngle;
        this.arcs[i].stop = this.arcs[i].center + this.halfAngle;

        // interpolate segments to smaller size
        this.arcs[i].d = lerp(0, this.maxDiameter, this.growthScale);

        // eliminate arcs when they reach small enough size
        if (this.arcs[i].start >= this.arcs[i].center) {

            this.arcs.splice(i, 1);

        }
        
      }
      
      // whole ripple getting smaller
      this.anglePerArc -= this.angleDecay;
      this.halfAngle = this.anglePerArc/2;

    }
    
    // update for interpolation
    this.growthScale += this.growthRate;
    
  }
  
  DrawMe() {
    
    stroke(255, 255, 255);   // outline color
    noFill();                // we just want the edge
    
    // draw out each arc
    for (let i = 0; i < this.arcs.length; i++) {
  
      var currArc = this.arcs[i];
      arc(currArc.x, currArc.y, currArc.d, currArc.d, currArc.start, currArc.stop);

    }
    
  }
  
}

function randomInterval(min, max) {
  
  return Math.floor(Math.random() * (max - min + 1) + min)
  
}

function randomPiAngle() {
  
  return Math.random() * ((2 * PI) - 0.01 + 1) + 0.01;
  
}