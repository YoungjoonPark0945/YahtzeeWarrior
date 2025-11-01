// Yahtzee Warrior - Checkpoint 1
// Creator: Youngjoon Park

// START SCREEN
function drawStartScreen() {
  // Scrolling Background
  if (forestMap2) {
    imageMode(CORNER);
    image(forestMap2, scroll, 0, width, height);
    image(forestMap2, scroll + width, 0, width, height);
    scroll -= scrollSpeed;

    if (scroll <= -width) {
      scroll = 0;
    }
  }

  // Warrior Walking Animation
  if (walkingWarrior.length > 0) {
    imageMode(CENTER);
    image(walkingWarrior[walkFrame], width / 3, 120, 80, 80);
    walkTimer++;
    if (walkTimer % 8 === 0) {
      walkFrame++;
      if (walkFrame >= walkingWarrior.length) {
        walkFrame = 0;
      }
    }
  }

  // Monster Walking Animation
  if (walkingMonster.length > 0) {
    imageMode(CENTER);
    image(walkingMonster[walkFrame2], width / 3  + 220, 63, 200, 200);
    walkTimer2++;
    if (walkTimer2 % 15 === 0) {
      walkFrame2++;
      if (walkFrame2 >= walkingMonster.length) {
        walkFrame2 = 0;
      }
    }
  }

  // Title
  fill(255);
  textSize(48);
  text("YAHTZEE WARRIOR", width / 2, height / 2 - 120);

  // My name
  textSize(20);
  fill(200);
  text("Created by Youngjoon Park", width / 2, height / 2 - 70);

  // Dice animation
  push();
  translate(width / 2, height / 2 + 60);
  rotate(diceAngle);
  imageMode(CENTER);
  image(diceFaces[diceFrame], 0, 0, 100, 100);
  pop();

  diceAngle += 0.05;

  // switch face of dice
  diceTimer++;
  if (diceTimer % 40 === 0) {
    diceFrame++;
    if (diceFrame > 6) {
      diceFrame = 1;
    }
  }

  // Animated Start instruction
  fill(180, 220, 255);
  textSize(24);
  if (frameCount % 120 < 60) {
    text("Click to Start", width / 2, height - 100);
  }
}

// MENU SCREEN
function drawMenuScreen() {
  background(25, 25, 60);

  // Animations of attacking characters
  attackTimer++;
  if (attackTimer >= 60) {
    warriorAttacking = !warriorAttacking;
    monsterAttacking = !monsterAttacking;
    attackTimer = 0;
  }

  // Instructions of game
  fill(255);
  textSize(36);
  text("How to Play", width / 2, 80);

  textSize(20);
  fill(220);
  text(
    "Roll 5 dices each turn to attack the monster.\n" +
    "You can lock each dice and reroll up to 3 times.\n" +
    "Different Yahtzee combinations deal different damage.\n" +
    "Defeat the monster before your dices are all disabled!\n" +
    "Click the Button to see the example combinations",
    width / 2,
    height / 2 - 80
  );

  // Button to see Combinations
  var buttonX = width / 2;
  var buttonY = height / 2 + 20;

  fill(50, 100, 200);
  rectMode(CENTER);
  rect(buttonX, buttonY, 280, 50, 10);

  fill(255);
  textSize(22);
  text("Combination Rules", buttonX, buttonY);

  // Dice animation 
  faceTimer++;
  if (faceTimer % 30 === 0) {
    for (var i = 0; i < 5; i++) {
      playerFaces[i] = floor(random(1, 7));
    }
    for (var i = 0; i < 2; i++) {
      enemyFaces[i] = floor(random(1, 7));
    }
  }

  // Player's 5 dices
  var diceY = height - 90;
  var diceX = (width / 2) - 340;

  imageMode(CENTER);
  for (var i = 0; i < 5; i++) {
    image(diceFaces[playerFaces[i]], diceX + i * 80, diceY, 60, 60);
  }

  // Enemy dices
  if (monsterImg) {
    var monsterX = (width / 2) + 250;
    var monsterY = (height / 2) + 40;

    image(enemyDice[enemyFaces[1]], monsterX - 50, monsterY + 160, 80, 80);
    image(enemyDice[enemyFaces[0]], monsterX + 50, monsterY + 160, 80, 80);
  }

  // Start battle button
  fill(180, 220, 255);
  textSize(24);
  if (frameCount % 100 < 50) {
    text("Click to Begin Battle", (width / 2), (height / 2) + 120);
  }

  // Draw Characters
  drawWarrior();
  drawMonster1();

  // Image of Combinations
  if (showRules && comboRules) {
    push();
    imageMode(CENTER);
    image(comboRules, width / 2, height / 2, 500, 500);
    pop();
  }
}

// Actual Game Play
function drawGame() {
  background(40);
  fill(255);
  textSize(32);
  text("Wait For Next CheckPoint To See GamePlay", width / 2, height / 2);
}

// Function to draw warrior character
function drawWarrior() {
  // Draw Warrior
  push();
  imageMode(CENTER);
  if (warriorAttacking && warriorAttack) {
    image(warriorAttack, (width / 2) - 200, (height / 2) + 100);
  } else if (warriorImg) {
    image(warriorImg, (width / 2) - 200, (height / 2) + 100);
  }
  pop();
}

// Function to draw monster character
function drawMonster1() {
  // Draw Monster
  push();
  imageMode(CENTER);
  if (monsterAttacking && monsterAttack) {
    image(monsterAttack, (width / 2) + 180, (height / 2) + 40);
  } else if (monsterImg) {
    image(monsterImg, (width / 2) + 180, (height / 2) + 40);
  }
  pop();
}

// Function to check if mouse is clicked correctly
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (gameState === "start") {
      gameState = "menu";
    } else if (gameState === "menu") {
      // Check if user clicked inside button
      if (
        mouseX > ((width / 2) - 140) &&
        mouseX < ((width / 2) + 140) &&
        mouseY > (height / 2 + 20 - 25) &&
        mouseY < (height / 2 + 20 + 25)
      ) {
        showRules = !showRules;
        return;
      }
      if (showRules) {
        if (
          mouseX > (width / 2 - 250) &&
          mouseX < (width / 2 + 250) &&
          mouseY > (height / 2 - 250) &&
          mouseY < (height / 2 + 250)
        ) {
          showRules = false;
          return;
        }
      }
      if (
        mouseX > ((width / 2) - 140) &&
        mouseX < ((width / 2) + 140) &&
        mouseY > (height / 2 + 120 - 25) &&
        mouseY < (height / 2 + 120 + 25)
      ) {
        gameState = "play";
        return;
      }
    }
  }
}

// Global variables
let gameState = "start";
let warriorImg, monsterImg, hitImg, warriorAttack, monsterAttack;
var diceFaces = [];
var diceAngle = 0;
var diceFrame = 1;
var diceTimer = 0;
var enemyDice = [];
var playerFaces = [1, 2, 3, 4, 5];
var enemyFaces = [1, 1];
var faceTimer = 0;
let comboRules;
let showRules = false;
var attackTimer = 0;
let warriorAttacking = false;
let monsterAttacking = false;
let forestMap2;
var scroll = 0;
var scrollSpeed = 1
var walkingWarrior = [];
var walkFrame = 0;
var walkTimer = 0;
var walkingMonster = [];
var walkFrame2 = 0;
var walkTimer2 = 0;

// Images
function preload() {
  warriorImg = loadImage("assets/Warrior 1 - Axe - Idle_088.png");
  monsterImg = loadImage("assets/Bringer-of-Death_Attack_10.png", img => img.resize(300, 0));
  hitImg = loadImage("assets/hit.png");
  warriorAttack = loadImage("assets/Warrior 1 - Axe - Attack 1_039.png");
  monsterAttack = loadImage("assets/Bringer-of-Death_Attack_5.png", img => img.resize(300, 0));
  comboRules = loadImage("assets/Combinations.png");
  forestMap1 = loadImage("assets/forest1.png");
  forestMap2 = loadImage("assets/forest2.png");

  for (var i = 1; i <= 6; i++) {
    diceFaces[i] = loadImage("assets/d6_white_" + i + ".png");
  }
  for (var j = 1; j <= 6; j++) {
    enemyDice[j] = loadImage("assets/d6_red_" + j + ".png");
  }
  for (var k = 0; k <= 7; k++) {
    walkingWarrior[k] = loadImage("assets/Warrior 1 - Axe - Walk_00" + k + ".png");
  }
  for (var l = 1; l <= 8; l++) {
    walkingMonster[l - 1] = loadImage("assets/Bringer-of-Death_Walk_" + l + ".png", img => img.resize(300, 0));
  }
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textFont("Times New Roman");
  angleMode(RADIANS);
}

function draw() {
  background(0);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "menu") {
    drawMenuScreen();
  } else if (gameState === "play") {
    drawGame();
  }
}