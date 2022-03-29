//Global Variables
var clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
var pattern = [5,9,1,3,4,7,4,3,2];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var mistakes;

function randomPattern(){
  for(let i = 0; i<9; i++){
  return pattern[i] = Math.floor(Math.random() * Math.floor(9) + 1);
}
}

function startGame() {
  mistakes=0;
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  randomPattern(9);
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}


function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime;
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  clueHoldTime -= 90;
}

function winGame() {
  playTone3();
  stopGame();
  alert("Hooray! Yow Won");
}

function lostGame() {
  playTone2();
  stopGame();
  alert("Sorry You Lost");

  
  
}

function guess(btn) {
  console.log("User Guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  
  if(btn == pattern[guessCounter]){
    if(guessCounter == progress){
      if(progress == pattern.length-1){
        winGame();
      }
      else{
        progress++;
        playClueSequence();
      }
    }
    else{
      guessCounter++;
    }
  }
  else{
    mistakes++;
    if(mistakes == 3){
    lostGame();
    } else{
      playTone1();
      alert("Wrong Guess, " + (3-mistakes) + " Guess left")
    }
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 310.2,
  2: 329.6,
  3: 422,
  4: 466.2,
  5: 478,
  6: 600,
  7: 200,
  8: 510,
  9: 600
};
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function playTone1(){
  document.getElementById("myAudio1").play();
}

function playTone2(){
  document.getElementById("myAudio").play();
}

function playTone3(){
  document.getElementById("myAudio2").play();
}

function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}
// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
