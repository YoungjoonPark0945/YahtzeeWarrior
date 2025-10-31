// Yahtzee Warrior - Checkpoint 1
// Creator: Youngjoon Park
// Description: Title screen + instruction screen with animations

// START SCREEN

function drawStartScreen() {
  background(10, 10, 30);

  // Title
  fill(255);
  textSize(48);
  text("YAHTZEE WARRIOR", width / 2, height / 2 - 120);

  // Creator name
  textSize(20);
  fill(200);
  text("Created by Youngjoon Park", width / 2, height / 2 - 70);

  // --- Dice rolling animation ---
  push();
  translate(width / 2, height / 2 + 30);
  rotate(radians(diceAngle));
  imageMode(CENTER);

  // Cycle through dice faces every few frames
  image(diceFaces[diceAnimFrame], 0, 0, 100, 100);

  pop();

  diceAngle += 2;
  diceTimer++;
  if (diceTimer % 6 === 0) { // switch face every few frames
    diceAnimFrame++;
    if (diceAnimFrame > 6) diceAnimFrame = 1;
  }

  // Animated text hint
  fill(180, 220, 255);
  textSize(24);
  if (frameCount % 120 < 60) {
    text("Click to Start", width / 2, height - 100);
  }

  // Player & Monster silhouettes (for now)
  drawCharacters();
}

// INSTRUCTION / MENU SCREEN
function drawMenuScreen() {
  background(25, 25, 60);

  fill(255);
  textSize(36);
  text("How to Play", width / 2, 80);

  textSize(20);
  fill(220);
  text(
    "Roll 5 dices each turn to attack the monster.\n" +
    "You can lock each dice and reroll up to 3 times.\n" +
    "Different Yahtzee combinations deal different damage.\n" +
    "Defeat the monster before your dices are all disabled!",
    width / 2,
    height / 2 - 30
  );


  push();
  translate(width / 2, height / 2 + 120);
  rotate(radians(diceAngle));
  fill(255, 220, 100);
  rectMode(CENTER);
  rect(0, 0, 60, 60, 10);
  fill(0);
  ellipse(0, 0, 10, 10);
  pop();
  diceAngle += 1.5;

  // Hint to start
  fill(180, 220, 255);
  textSize(24);
  if (frameCount % 100 < 50) {
    text("Click to Begin Battle", width / 2, height - 80);
  }

  drawCharacters();
}

// Actual Game Play
function drawGame() {
  background(40);
  fill(255);
  textSize(32);
  text("Gameplay Coming Soon...", width / 2, height / 2);
}

function drawCharacters() {
  // Draw Warrior
  if (warriorImg) {
    push();
    imageMode(CENTER);
    image(warriorImg, 400, 400);
    pop();
  }

  // Draw Monster
  if (monsterImg) {
    push();
    imageMode(CENTER);
    image(monsterImg, 400, 400);
    pop();
  }
}

// Input
function mousePressed() {
  if (gameState === "start") {
    gameState = "menu";
  } else if (gameState === "menu") {
    gameState = "play";
  }
}

// Game state controller
let gameState = "start";

// Images
let warriorImg, monsterImg, hitImg, warriorAttack, monsterAttack;
let diceFaces = [];
let diceAngle = 0;
let diceAnimFrame = 1;
let diceTimer = 0;

function preload() {
  warriorImg = loadImage("assets/Warrior 1 - Axe - Idle_088.png");
  monsterImg = loadImage("assets/Bringer-of-Death_Attack_10.png");
  monsterImg.resize(300, 0);
  hitImg = loadImage("assets/hit.png");
  warriorAttack = loadImage("assets/Warrior 1 - Axe - Attack 1_039.png");
  monsterAttack = loadImage("assets/Bringer-of-Death_Attack_5.png");

  for (let i = 1; i <= 6; i++) {
    diceFaces[i] = loadImage(`assets/d6_white_${i}.png`);
  }
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textFont("Times New Roman");
}

function draw() {
  background(20);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "menu") {
    drawMenuScreen();
  } else if (gameState === "play") {
    drawGame(); // Future gameplay
  }
}