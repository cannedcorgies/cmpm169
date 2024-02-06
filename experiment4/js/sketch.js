let movie;

let mySounds = [];

let strikes = 0;
  let strikesMax = 4;
  let strikeTime = 0;
  let strikeTimeMax = 3;
  let warning = false;

let cooldownTime = 0;
  let cooldownTimeMax = 15;

let maxVol = 0.0175;

let video;
  let prevFrame;
  let currentFrame;
  let camSensitivity = 50;
  let camWidth = 640;
  let camHeight = 480;
  let ctx;
  let old;
  let scalefactor;
  let sample_size = 25;
  let movementMax = 1000;
  let startUp = 0;

let ssh1;
let ssh2;
let ssh3;
let ssh4;

let setupComplete;

function preload() {

  console.log("preload...");

  ssh1 = loadSound('ssh01.mp3');
  ssh2 = loadSound('ssh02.mp3');
  ssh3 = loadSound('ssh03.mp3');
  ssh4 = loadSound('ssh04.mp3');
  console.log(" -- DONE! ^_^");

}

function setup() {

  console.log("setting up...");

  mySounds = [ssh1, ssh2, ssh3, ssh4];

  setupComplete = false;
  
  createCanvas(640, 480);

  movie = createVideo("nightofthelivingdead.mp4");
  movie.play();
    
  mic = new p5.AudioIn();
  mic.start();
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  context = canvas.getContext('2d');

  old = [];
  scalefactor = 1;
            
  setupComplete = true;
  console.log("we're done!");

}

function draw() {

  //console.log("draw!");

  if (!setupComplete) { return; }

  console.log(" -- with set-up");

  image(video, 0, 0, width, height);
  
  // ==== GAME OVER ====
  if (strikes > strikesMax) {   // if exceed strikes allowed..

    movie.stop();       // ..reset movie and everything else
    movie.play();
    strikes = 0;
    cooldownTime = 0;

  }

  StopMoving();

  // ==== STRIKING SYSTEM =====
  if (!warning) {   // if not invulnerable..

    TooNoisy();

    StrikeForgiveness();

  } else {    // otherwise..

    StrikeCooldown();   // "iframes"

  }

}



// ==== FUNCTIONS ====

// ==== mouseClicked() ====
//  - debugging function
//  - click and that's a strike
//  - to test if striking and cooldown
//    systems work effectively
function mouseClicked() {

  if (!warning) {

    Strike();
    movie.pause();

  }

}


// ==== StopMoving() ==== [2]
//  - raises an alert if too much movement
//  - uses pixel analysis and red value tracking
//  - returns an array of concerning pixels
function StopMoving() {

  var motion = [];
  image(video, 0, 0, width, height);
  var data = context.getImageData(0, 0, video.width, video.height).data;  // get latest frame data
  
  // ANALYZE ALL PIXELS
  for (var y = 0; y < video.height; y++) {

    for (var x = 0; x < video.width; x++) {

      var pos = (x + y * video.width) * 4;

      // separate RGB
      var r = data[pos];
      var g = data[pos+1];
      var b = data[pos+2];

      if(old[pos] && Math.abs(old[pos].red - r) > camSensitivity) { // if difference in red is greater than set sensitivity...

        // make note of the pixel by highlighting it
        context.fillStyle = "blue";
        context.fillRect(x * scalefactor, y * scalefactor, scalefactor, scalefactor);
        motion.push({x: x * scalefactor, y: y * scalefactor, r: r, g: g, b: b});

      }

      old[pos] = { red: r, green: g, blue: b};

    }

  }

  if (motion.length > movementMax && !warning) {

    if (startUp >= 2) {   // to account for a start-up bug

      console.log("STOP MOVING");
      Strike();
    
    }

    startUp ++;
  
  }
  
  return motion;

}


// ==== VizualizeMotion ==== [2]
//  - takes in array of pixels detected in motion
//  - highlights them on the canvas with big blocks
function VisualizeMotion(motion) {
  for (i = 0; i < motion.length; i++) {
      
    var m = motion[i];
    context.fillStyle = "blue";
    context.fillRect(m.x, m.y, sample_size, sample_size);
    
}
}


// ==== TooNoisy() ====
//  - gives a strike if player is too noisy
function TooNoisy() {

  let vol = mic.getLevel();
  if (vol > maxVol) {

    if (strikes < strikesMax) { mySounds[strikes].play(); }   // HUSH
    console.log("SHUT UP");
    Strike();

  }

}


// ==== Strike() ====
//  - gives user a strike
//  - small punishment by resetting
//    strike "forgiveness" counter
//  - setting warning to true starts
//    strike cooldown
function Strike() {

  movie.pause();
  warning = true;
  strikes++;
  strikeTime = 0;
  cooldownTime = 0;
  console.log("==== boy howdy, that's stike " + strikes + "! ====");

}


// ==== StrikeCooldown() ====
//  - small invulnerability for player
//  - prevents a barrage of strikes
//  - will give a bit of leniance
function StrikeCooldown() {

  if (warning) {

    strikeTime += deltaTime/1000;
    
    if (strikeTime > strikeTimeMax) {

      warning = false;
      movie.play();
      strikeTime = 0;

      console.log("back in the game!");

    }

  }

}


// ==== StrikeForgiveness() ====
//  - periodically forgives one strike
//  - wait time for forgiveness scales with
//    current number of strikes
function StrikeForgiveness() {

  if (strikes > 0) {    // if you currently have strikes..

    cooldownTime += (deltaTime/1000 * (1/(strikes + 1)));   // add time scaled by strikes to cooldown

    if (cooldownTime >= cooldownTimeMax) {    // if cooldown has been filled..

      strikes --;         // forgive a single strike
      cooldownTime = 0;
      console.log("==== minus 1 - " + strikes + " ====");

    }

  }

}

// ==== CREDITS ====
// Sshh.wav - jay-kelly007 [1]
//  - https://freesound.org/s/408744/
//  - https://creativecommons.org/licenses/by-nc/3.0/
//
// Motion Dection in Javascript - George Galanakis [2]
//  - https://medium.com/hackernoon/motion-detection-in-javascript-2614adea9325