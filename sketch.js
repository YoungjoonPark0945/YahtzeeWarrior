// Yahtzee Warrior - Checkpoint 2
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
    image(walkingMonster[walkFrame2], width / 3 + 220, 63, 200, 200);
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
    for (var k = 0; k < 2; k++) {
      enemyFaces[k] = floor(random(1, 7));
    }
  }

  // Player's 5 dices
  var diceY = height - 90;
  var diceX = width / 2 - 340;

  imageMode(CENTER);
  for (var j = 0; j < 5; j++) {
    image(diceFaces[playerFaces[j]], diceX + j * 80, diceY, 60, 60);
  }

  // Enemy dices
  var monsterX = width / 2 + 250;
  var monsterY = height / 2 + 40;

  image(enemyDice[enemyFaces[1]], monsterX - 50, monsterY + 160, 80, 80);
  image(enemyDice[enemyFaces[0]], monsterX + 50, monsterY + 160, 80, 80);

  // Start battle button
  fill(180, 220, 255);
  textSize(24);
  if (frameCount % 100 < 50) {
    text("Click to Begin Battle", width / 2, height / 2 + 120);
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

// Function to draw first game screen for Checkpoint 2
function drawGame() {
  // Game Background
  if (forestMap1) {
    imageMode(CORNER);
    image(forestMap1, scroll, 0, width, height);
    image(forestMap1, scroll + width, 0, width, height);
    scroll -= scrollSpeed * 0.5;
    if (scroll <= -width) {
      scroll = 0;
    }
  }

  // Characters
  drawWarrior();
  drawMonster1();

  // Player roll
  if (turnState === "playerRoll" && isRolling) {
    rollTimer++;
    if (frameCount % 4 === 0) {
      for (var j = 0; j < 5; j++) {
        if (!playerLocked[j]) {
          playerFaces[j] = floor(random(1, 7));
        }
      }
    }
    if (rollTimer > 80) {
      isRolling = false;
      rollTimer = 0;
      rollCount++;
    }
  }

  // Player attack
  if (turnState === "playerAttack") {
    // Wait until animation finishes
    if (!warriorAttacking) {
      // Apply damage only once when animation ends
      let dmg = calculatePlayerDamage();
      monsterHP -= dmg;
      if (monsterHP < 0) {
        monsterHP = 0;
      }

      monsterBlink = 12;
      if (monsterHP <= 0) {
        monsterDead = true;
      }

      // Move to enemy's turn
      monsterRolling = true;
      turnState = "enemyAttack";
    }
  }
  // Enemy attack
  if (turnState === "enemyAttack") {
    // Monster rolling animation
    if (monsterRolling) {
      monsterRollTimer++;
      if (frameCount % 4 === 0) {
        enemyFaces[0] = floor(random(1, 7));
        enemyFaces[1] = floor(random(1, 7));
      }

      if (monsterRollTimer > 90) {
        monsterRolling = false;
        monsterRollTimer = 0;

        let d1 = enemyFaces[0];
        let d2 = enemyFaces[1];

        if (d1 <= 3) {
          monsterAttackType = "normal";
          monsterAttacking = true;
        }
        else {
          monsterAttackType = "magic";
          monsterCasting = true;
        }
        // store pending damage to apply when animation ends
        monsterPendingDamage = d1 * d2 * (d1 <= 3 ? 1 : 0.7);
      }
    }
    // When monster finishes animation, return to player turn
    if (!monsterRolling && !monsterAttacking && !monsterCasting && !monsterDead) {
      autoRefreshDice();
      turnState = "playerRoll";
    }
  }

  // Player's dices
  var diceY = height - 100;
  var diceX = width / 2 - 340;
  imageMode(CENTER);
  for (var i = 0; i < 5; i++) {
    if (playerLocked[i]) {
      tint(150, 150);
    }
    else {
      noTint();
    }
    image(diceFaces[playerFaces[i]], diceX + i * 100, diceY, 80, 80);
  }
  noTint();

  // Enemy's dices
  var monsterX = width / 2 + 250;
  var monsterY = height / 2 + 40;
  image(enemyDice[enemyFaces[0]], monsterX - 60, monsterY + 160, 80, 80);
  image(enemyDice[enemyFaces[1]], monsterX + 60, monsterY + 160, 80, 80);

  // Draw buttons
  drawButtons();

  // Left Chances
  fill(255);
  textSize(18);
  text("Rolls left: " + (3 - rollCount), width / 2, height - 160);
  // Player HP Bar
  drawHealthBar(60, 40, width / 2 - 60, 30, playerHP, 100, color(0, 200, 0));
  // Monster HP Bar
  drawHealthBar(width / 2, 40, 340, 30, monsterHP, 150, color(200, 0, 0));
}

// Function to draw warrior with its actions
function drawWarrior() {
  push();
  imageMode(CENTER);

  // Blink effect when hurt
  if (warriorBlink > 0) {
    if (frameCount % 10 < 5) {
      tint(255, 80); // semi-transparent blink
    }
    warriorBlink--;
  }

  // Death Animation
  if (warriorDead) {
    // decrease opacity each frame
    warriorFade -= 5;
    if (warriorFade < 0) {
      warriorFade = 0;
    }

    push();
    imageMode(CENTER);
    tint(255, warriorFade);  // fade effect

    let lastFrame = warriorIdleFrames[warriorIdleFrames.length - 1];
    image(lastFrame, width / 2 - 200, height / 2 + 100);
    pop();

    // when fully dead, move to game over screen
    if (warriorFade === 0) {
      transitionTimer++;

      if (transitionTimer > 60) {
        gameState = "gameOver";
        transitionTimer = 0;
      }
    }
    return;
  }

  // Attack Animation
  if (warriorAttacking) {
    if (warriorAttackFrames[warriorFrame]) {
      image(warriorAttackFrames[warriorFrame], width / 2 - 200, height / 2 + 100);
    }
    warriorFrameTimer++;
    if (warriorFrameTimer % 10 === 0) {
      warriorFrame++;
    }
    if (warriorFrame >= warriorAttackFrames.length) {
      warriorFrame = 0;
      warriorFrameTimer = 0;
      warriorAttacking = false;
    }
  }
  // Idle Animation
  else if (warriorIdleFrames.length > 0) {
    if (warriorIdleFrames[warriorFrame]) {
      image(warriorIdleFrames[warriorFrame], width / 2 - 200, height / 2 + 100);
    }
    warriorFrameTimer++;
    if (warriorFrameTimer % 8 === 0) {
      warriorFrame++;
      if (warriorFrame >= warriorIdleFrames.length) {
        warriorFrame = 0;
      }
    }
  }
  pop();
}

// Function to draw monster with its actions
function drawMonster1() {
  push();
  imageMode(CENTER);

  // Blink effect when hart
  if (monsterBlink > 0) {
    if (frameCount % 10 < 5) {
      tint(255, 80);
    }
    monsterBlink--;
  }

  // Death Animation
  if (monsterDead) {
    let frame = monsterFrameIdle;

    if (monsterDeathFrames[frame]) {
      image(monsterDeathFrames[frame], width / 2 + 180, height / 2 + 40);
    }

    if (frameCount % 6 === 0) {
      monsterFrameIdle++;
    }

    // After last frame, move to reward screnn
    if (monsterFrameIdle >= monsterDeathFrames.length) {
      transitionTimer++;

      if (transitionTimer > 60) {
        gameState = "reward";
        transitionTimer = 0;
      }
    }
    pop();
    return;
  }

  // Normal Attack Animation
  if (monsterAttacking && monsterAttackFrames.length > 0) {
    if (monsterAttackFrames[monsterFrame]) {
      image(monsterAttackFrames[monsterFrame], width / 2 + 180, height / 2 + 40);
    }
    monsterFrameTimer++;
    if (monsterFrameTimer % 6 === 0) {
      monsterFrame++;
    }

    if (monsterFrame >= monsterAttackFrames.length) {
      monsterFrame = 0;
      monsterFrameTimer = 0;
      monsterAttacking = false;

      // apply damage after attack completes
      playerHP -= monsterPendingDamage;
      if (playerHP < 0) {
        playerHP = 0;
      }
      warriorBlink = 12;
      if (playerHP <= 0) {
        warriorDead = true;
      }
    }
    pop();
    return;
  }

  // Magic Cast Animation
  if (monsterCasting && monsterCastFrames.length > 0) {
    if (monsterCastFrames[monsterFrame]) {
      image(monsterCastFrames[monsterFrame], width / 2 + 180, height / 2 + 40);
    }
    monsterFrameTimer++;
    if (monsterFrameTimer % 6 === 0) {
      monsterFrame++;
    }

    if (monsterFrame >= monsterCastFrames.length) {
      monsterFrame = 0;
      monsterFrameTimer = 0;
      monsterCasting = false;

      // Apply magic damage after cast completes
      playerHP -= monsterPendingDamage;
      if (playerHP < 0) {
        playerHP = 0;
      }
      warriorBlink = 6;
      if (playerHP <= 0) {
        warriorDead = true;
      }
    }
    pop();
    return;
  }

  // Idle Animation
  if (monsterIdleFrames.length > 0) {
    if (monsterIdleFrames[monsterFrameIdle]) {
      image(monsterIdleFrames[monsterFrameIdle], width / 2 + 180, height / 2 + 40);
    }
    monsterFrameIdleTimer++;
    if (monsterFrameIdleTimer % 8 === 0) {
      monsterFrameIdle++;
      if (monsterFrameIdle >= monsterIdleFrames.length) {
        monsterFrameIdle = 0;
      }
    }
  }
  pop();
}

function drawBoss() {
  push();
  imageMode(CENTER);

  // Boss hit animation
  if (bossHit) {
    image(bossHitFrames[bossFrame], width / 2 + 180, height / 2 - 20);

    if (frameCount % 5 === 0) {
      bossFrame++;
    }

    if (bossFrame >= bossHitFrames.length) {
      bossHit = false;
      bossFrame = 0;  // return to idle
    }

    pop();
    return;
  }

  // Boss death animation
  if (bossDead) {
    if (bossFrame < bossDeathFrames.length) {
      image(bossDeathFrames[bossFrame], width / 2 + 180, height / 2 - 20);

      if (frameCount % 6 === 0) bossFrame++;
    } else {
      // after animation → go to game win
      gameState = "gameWin";
    }

    pop();
    return;
  }

  // Boss Attack Animation
  if (monsterAttacking) {
    image(bossAttackFrames[bossFrame], width / 2 + 180, height / 2 - 20);

    bossFrameTimer++;
    if (bossFrameTimer % 5 === 0) bossFrame++;

    // end of attack animation
    if (bossFrame >= bossAttackFrames.length) {
      bossFrame = 0;
      bossFrameTimer = 0;
      monsterAttacking = false;

      // apply pending damage
      playerHP -= monsterPendingDamage;
      if (playerHP < 0) playerHP = 0;
      warriorBlink = 12;

      // check if player died
      if (playerHP <= 0) warriorDead = true;
    }

    pop();
    return;
  }

  // Boss Idle Animation
  image(bossIdleFrames[bossFrame], width / 2 + 180, height / 2 - 20);

  if (frameCount % 8 === 0) {
    bossFrame++;
    if (bossFrame >= bossIdleFrames.length) bossFrame = 0;
  }

  pop();
}

// Function to calculate the damage of the player based on combination
function calculatePlayerDamage() {
  // Count occurrences of each face
  let counts = {};
  for (let v of playerFaces) {
    counts[v] = (counts[v] || 0) + 1;
  }

  const values = Object.keys(counts).map(Number).sort();
  const freq = Object.values(counts).sort((a, b) => b - a);

  // Check Yahtzee
  if (freq[0] === 5) {
    return 50;
  }

  // Check Four of a Kind
  if (freq[0] === 4) {
    let num = Number(Object.keys(counts).find(k => counts[k] === 4));
    return num * 4;
  }

  // Check Full House
  if (freq[0] === 3 && freq[1] === 2) {
    return 25;
  }

  // Check Three of a Kind
  if (freq[0] === 3) {
    let num = Number(Object.keys(counts).find(k => counts[k] === 3));
    return num * 3;
  }

  // Check Straights
  const uniqueSorted = [...new Set(values)];
  const seqs = ["1234", "2345", "3456"];
  const joined = uniqueSorted.join("");

  // Large straight
  if (joined === "12345" || joined === "23456") {
    return 40;
  }

  // Small straight
  for (let s of seqs) {
    if (joined.includes(s)) {
      return 30;
    }
  }

  // Default damage when player fails to make combination
  return 5;
}

// Function to draw health bar for each cahracter
function drawHealthBar(x, y, w, h, currentHP, maxHP, colorFill) {
  // Background 
  fill(80);
  rectMode(CORNER);
  rect(x, y, w, h, 5);

  // HP ratio
  let hpWidth = map(currentHP, 0, maxHP, 0, w);

  // Fill color
  fill(colorFill);
  rect(x, y, hpWidth, h, 5);

  // Outline
  noFill();
  stroke(255);
  rect(x, y, w, h, 5);
  noStroke();
}

// Function to draw game over screen
function drawGameOverScreen() {
  background(0);
  fill(255, 80, 80);
  textSize(60);
  text("GAME OVER", width / 2, height / 2 - 100);

  textSize(24);
  fill(220);
  text("Your warrior has fallen...", width / 2, height / 2 - 40);
  text("Click anywhere to restart", width / 2, height / 2 + 40);
}

function drawRewardScreen() {
  background(20, 20, 40);

  textSize(40);
  fill(255);
  text("Reward Chest!", width / 2, 80);

  imageMode(CENTER);

  // chest animation
  if (!chestOpened) {
    image(chestIdle, width / 2, height / 2 + 50, 140, 140);
    textSize(24);
    fill(180, 220, 255);
    text("Click to open chest", width / 2, height - 100);
  }
  else {
    var frameImg = chestOpenFrames[chestFrame];
    image(frameImg, width / 2, height / 2 + 50, 140, 140);

    if (frameCount % 4 === 0 && chestFrame < chestOpenFrames.length - 1) {
      chestFrame++;
    }

    // reveal item
    if (chestFrame === chestOpenFrames.length - 1) {
      if (rewardItem === "sword") {
        image(itemSword, width / 2, height / 2 - 50, 100, 100);
      }
      else {
        image(itemShield, width / 2, height / 2 - 50, 100, 100);
      }

      textSize(28);
      text("Click to continue", width / 2, height - 100);
    }
  }
}

function drawBossBattle() {
  if (forestMap2) {
    imageMode(CORNER);
    image(forestMap2, scroll, 0, width, height);
    image(forestMap2, scroll + width, 0, width, height);
    scroll -= scrollSpeed * 0.5;
    if (scroll <= -width) scroll = 0;
  }

  // Draw Characters
  drawWarrior();
  drawBoss();

  // Player roll
  if (turnState === "playerRoll" && isRolling) {
    rollTimer++;
    if (frameCount % 4 === 0) {
      for (var j = 0; j < 5; j++) {
        if (!playerLocked[j]) {
          playerFaces[j] = floor(random(1, 7));
        }
      }
    }
    if (rollTimer > 80) {
      isRolling = false;
      rollTimer = 0;
      rollCount++;
    }
  }

  // Player attack
  if (turnState === "playerAttack") {
    if (!warriorAttacking) {
      // Player damage
      let dmg = calculatePlayerDamage();
      dmg = dmg * playerDamageMultiplier;   // sword buff

      if (playerTemporaryNerf) {
        dmg *= 0.8;   // boss pair debuff
        playerTemporaryNerf = false;
      }

      // Apply damage to boss
      bossHP -= dmg;
      bossHit = true;
      bossFrame = 0;
      bossFrameTimer = 0;

      if (bossHP < 0) {
        bossHP = 0;
      }
      if (bossHP <= 0) {
        bossDead = true;
      }

      monsterRolling = true;
      turnState = "enemyAttack";
    }
  }

  // Enemy Attack
  if (turnState === "enemyAttack") {

    // Rplling animation
    if (monsterRolling) {
      monsterRollTimer++;
      if (frameCount % 4 === 0) {
        enemyFaces[0] = floor(random(1, 7));
        enemyFaces[1] = floor(random(1, 7));
      }

      if (monsterRollTimer > 90) {
        monsterRolling = false;
        monsterRollTimer = 0;

        let d1 = enemyFaces[0];
        let d2 = enemyFaces[1];

        // Boss damage logic
        let dmg = d1 * d2 * bossDamageMultiplier; // ×1.2

        // Nerf attack
        if (d1 === d2) {
          dmg = max(dmg, 8);       // min damage 8
          playerTemporaryNerf = true;  // nerf next player attack
        }

        // Shield damage reduction
        dmg = dmg * incomingDamageMultiplier;

        bossAttackType = "normal";
        monsterAttacking = true;

        monsterPendingDamage = dmg;
      }
    }
    if (!monsterRolling && !monsterAttacking && !bossDead) {
      autoRefreshDice();
      turnState = "playerRoll";
    }
  }

  // Player Dice
  var diceY = height - 100;
  var diceX = width / 2 - 340;
  imageMode(CENTER);
  for (var i = 0; i < 5; i++) {
    if (playerLocked[i]) {
      tint(150, 150);
    } else {
      noTint();
    }
    image(diceFaces[playerFaces[i]], diceX + i * 100, diceY, 80, 80);
  }
  noTint();

  // Enemy Dice
  var bossX = width / 2 + 250;
  var bossY = height / 2 + 40;
  image(enemyDice[enemyFaces[0]], bossX - 60, bossY + 160, 80, 80);
  image(enemyDice[enemyFaces[1]], bossX + 60, bossY + 160, 80, 80);

  // Buttons
  drawButtons();
  // Rolls left
  fill(255);
  textSize(18);
  text("Rolls left: " + (3 - rollCount), width / 2, height - 160);

  // Hp bars
  drawHealthBar(60, 40, width / 2 - 60, 30, playerHP, 100, color(0, 200, 0));
  drawHealthBar(width / 2, 40, 340, 30, bossHP, 200, color(200, 0, 0));
}

function drawGameWinScreen() {
  background(0);

  // Fade In
  if (winFade < 255) winFade += 4;
  tint(255, winFade);

  // Victory Title
  noStroke();
  fill(255, 220, 80);
  textSize(70);
  text("YOU WIN!", width / 2, height / 2 - 120);
  fill(220);
  textSize(30);
  text("You defeated the Demon King!", width / 2, height / 2 - 50);

  // Glow Effect
  let glow = sin(frameCount * 0.08) * 40 + 80;
  fill(255, 255, 255, glow);
  textSize(24);
  text("Click anywhere to restart", width / 2, height / 2 + 100);

  noTint();
}

// Function to check if mouse is clicked correctly
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (gameState === "start") {
      gameState = "menu";
    }
    else if (gameState === "menu") {
      // Check if user clicked inside button
      if (
        mouseX > width / 2 - 140 &&
        mouseX < width / 2 + 140 &&
        mouseY > height / 2 + 20 - 25 &&
        mouseY < height / 2 + 20 + 25
      ) {
        showRules = !showRules;
        return;
      }
      if (showRules) {
        if (
          mouseX > width / 2 - 250 &&
          mouseX < width / 2 + 250 &&
          mouseY > height / 2 - 250 &&
          mouseY < height / 2 + 250
        ) {
          showRules = false;
          return;
        }
      }
      if (
        mouseX > width / 2 - 140 &&
        mouseX < width / 2 + 140 &&
        mouseY > height / 2 + 120 - 25 &&
        mouseY < height / 2 + 120 + 25
      ) {
        gameState = "play";
        return;
      }
    }
    else if (gameState === "play") {
      var diceY = height - 100;
      var diceX = width / 2 - 340;

      // Detect Dice Click for Lock/Unlock 
      for (var i = 0; i < 5; i++) {
        var x = diceX + i * 100;
        var y = diceY;
        if (dist(mouseX, mouseY, x, y) < 40) {
          playerLocked[i] = !playerLocked[i];
          return;
        }
      }
      // Detect Dice Roll Button 
      let rollBtnX = width / 2 - 200;
      let rollBtnY = height / 2 - 40;
      if (
        mouseX > rollBtnX - 90 &&
        mouseX < rollBtnX + 90 &&
        mouseY > rollBtnY - 20 &&
        mouseY < rollBtnY + 20
      ) {
        if (turnState === "playerRoll" && !isRolling && rollCount < 3) {
          isRolling = true;
          rollTimer = 0;
        }
        return;
      }

      // Detect Attack Button
      let attackBtnX = width / 2 - 200;
      let attackBtnY = height / 2 - 100;
      if (
        mouseX > attackBtnX - 90 &&
        mouseX < attackBtnX + 90 &&
        mouseY > attackBtnY - 20 &&
        mouseY < attackBtnY + 20
      ) {
        if (turnState === "playerRoll" && !isRolling) {
          turnState = "playerAttack";
          warriorAttacking = true;
          warriorFrame = 0;
          warriorFrameTimer = 0;
        }
        return;
      }
    }
    else if (gameState === "bossBattle") {
      // Dice lock
      var diceY = height - 100;
      var diceX = width / 2 - 340;

      for (var i = 0; i < 5; i++) {
        var x = diceX + i * 100;
        var y = diceY;
        if (dist(mouseX, mouseY, x, y) < 40) {
          playerLocked[i] = !playerLocked[i];
          return;
        }
      }

      // Roll
      let rollBtnX = width / 2 - 200;
      let rollBtnY = height / 2 - 40;

      if (
        mouseX > rollBtnX - 90 &&
        mouseX < rollBtnX + 90 &&
        mouseY > rollBtnY - 20 &&
        mouseY < rollBtnY + 20
      ) {
        if (turnState === "playerRoll" && !isRolling && rollCount < 3) {
          isRolling = true;
          rollTimer = 0;
        }
        return;
      }

      // Attack 
      let attackBtnX = width / 2 - 200;
      let attackBtnY = height / 2 - 100;

      if (
        mouseX > attackBtnX - 90 &&
        mouseX < attackBtnX + 90 &&
        mouseY > attackBtnY - 20 &&
        mouseY < attackBtnY + 20
      ) {
        if (turnState === "playerRoll" && !isRolling && rollCount > 0) {
          turnState = "playerAttack";
          warriorAttacking = true;
          warriorFrame = 0;
          warriorFrameTimer = 0;
        }
        return;
      }
    }
    else if (gameState === "gameOver") {
      // Reset everything
      resetGame();
      turnState = "playerRoll";
      rollCount = 0;

      gameState = "start";
      return;
    }
    else if (gameState === "reward") {
      if (!chestOpened) {
        chestOpened = true;
        rewardItem = random(["sword", "shield"]);

        if (rewardItem === "sword") {
          playerDamageMultiplier = 1.2;
        }
        else {
          incomingDamageMultiplier = 0.8;
        }
      }
      else {
        // Move to boss stage
        chestOpened = false;
        chestFrame = 0;

        // Heal 50%
        playerHP = min(100, playerHP + 50);

        // Prepare boss
        bossHP = 200;
        bossDead = false;
        resetStage();
        turnState = "playerRoll";
        gameState = "bossBattle";
      }
    }
    else if (gameState === "gameWin") {
      // Restart for next monster
      resetGame();
      gameState = "start";
      return;
    }
  }
}

// Function to draw buttons for game screen
function drawButtons() {
  var btnX = width / 2 - 200;
  var rollBtnY = height / 2 - 40;
  var attackBtnY = rollBtnY - 60;

  rectMode(CENTER);
  textSize(22);
  fill(255);
  textAlign(CENTER, CENTER);

  // Roll Button
  if (turnState === "playerRoll") {
    if (isRolling || rollCount >= 3) {
      fill(120);
    }
    else {
      fill(60, 120, 200);
    }
    rect(btnX, rollBtnY, 180, 40, 10);
    fill(255);
    text("ROLL DICE", btnX, rollBtnY);
  }

  // Attack Button
  if (turnState === "playerRoll" && !isRolling && rollCount > 0) {
    fill(200, 100, 60);
    rect(btnX, attackBtnY, 180, 40, 10);
    fill(255);
    text("ATTACK", btnX, attackBtnY);
  }
}

// Refresh the players dice to prevent reuse of dice combination
function autoRefreshDice() {
  for (var j = 0; j < 5; j++) {
    playerFaces[j] = floor(random(1, 7));
    playerLocked[j] = false;
  }
  rollCount = 1;
}

function resetGame() {
  // HP
  playerHP = 100;
  monsterHP = 150;
  bossHP = 200;

  // Dice
  for (let i = 0; i < 5; i++) {
    playerFaces[i] = floor(random(1, 7));
    playerLocked[i] = false;
  }
  enemyFaces = [1, 1];
  rollCount = 0;
  isRolling = false;
  rollTimer = 0;

  // Player
  warriorDead = false;
  warriorBlink = 0;
  warriorAttacking = false;
  warriorFrame = 0;
  warriorFrameTimer = 0;
  warriorFade = 255;
  playerDamageMultiplier = 1.0;
  incomingDamageMultiplier = 1.0;
  playerTemporaryNerf = false;

  // Monster
  monsterDead = false;
  monsterBlink = 0;
  monsterRolling = false;
  monsterRollTimer = 0;
  monsterAttackType = "";
  monsterAttacking = false;
  monsterCasting = false;
  monsterPendingDamage = 0;
  monsterFrame = 0;
  monsterFrameTimer = 0;
  monsterFrameIdle = 0;
  monsterFrameIdleTimer = 0;

  // Boss
  bossDead = false;
  bossFrame = 0;
  bossFrameTimer = 0;
  bossHit = false;

  // Reward
  chestOpened = false;
  chestFrame = 0;
  rewardItem = "";
  winFade = 0;

  // Game flow
  turnState = "playerRoll";
  transitionTimer = 0;

  // Start screen animation
  walkFrame = 0;
  walkTimer = 0;
  walkFrame2 = 0;
  walkTimer2 = 0;
}

function resetStage() {
  // Reset dice for player
  for (let i = 0; i < 5; i++) {
    playerFaces[i] = floor(random(1, 7));
    playerLocked[i] = false;
  }
  enemyFaces = [1, 1];
  rollCount = 0;
  isRolling = false;
  rollTimer = 0;

  // Player state
  warriorAttacking = false;
  warriorBlink = 0;
  warriorFrame = 0;
  warriorFrameTimer = 0;

  monsterRolling = false;
  monsterAttacking = false;
  monsterCasting = false;
  monsterPendingDamage = 0;
  monsterFrame = 0;
  monsterFrameTimer = 0;
  monsterFrameIdle = 0;
  monsterFrameIdleTimer = 0;

  // Boss state fresh
  bossDead = false;
  bossHit = false;
  bossFrame = 0;
  bossFrameTimer = 0;

  // Combat state
  turnState = "playerRoll";
}


// Global Variables
// Game State
let gameState = "start";
let nextGameTimer = 0;
let comboRules;
let showRules = false;
let forestMap2;
var scroll = 0;
var scrollSpeed = 1;
let transitionTimer = 0;

// Dice System 
var diceFaces = [];
var enemyDice = [];
var playerFaces = [1, 2, 3, 4, 5];
var enemyFaces = [1, 1];
var playerLocked = [false, false, false, false, false];
var rollCount = 0;
var isRolling = false;
var rollTimer = 0;

// Start and Menu Animations
var walkingWarrior = [];
var walkFrame = 0;
var walkTimer = 0;
var walkingMonster = [];
var walkFrame2 = 0;
var walkTimer2 = 0;

// Combat 
var monsterHP = 150;
var playerHP = 100;
var turnState = "playerRoll";
var attackTimer = 0;

// Warrior Animation
var warriorIdleFrames = [];
var warriorAttackFrames = [];
var warriorFrame = 0;
var warriorFrameTimer = 0;
var warriorDead = false;
var warriorBlink = 0;
var warriorAttacking = false;
var warriorFade = 255;

// Monster Animation
var monsterIdleFrames = [];
var monsterAttackFrames = [];
var monsterCastFrames = [];
var monsterDeathFrames = [];
var monsterFrameIdle = 0;
var monsterFrameIdleTimer = 0;
var monsterFrame = 0;
var monsterFrameTimer = 0;
var monsterDead = false;
var monsterBlink = 0;
var monsterRolling = false;
var monsterRollTimer = 0;
var monsterAttackType = "";
var monsterAttacking = false;
var monsterCasting = false;
var monsterPendingDamage = 0;

// Temporary Variables
var faceTimer = 0;
var diceAngle = 0;
var diceFrame = 1;
var diceTimer = 0;
let warriorAttack, monsterAttack;
var winFade = 0;

// Reward & Boss System
let chestIdle;
var chestOpenFrames = [];
var chestFrame = 0;
var chestOpened = false;
var rewardItem = "";  // "sword" or "shield"
let itemSword, itemShield;

// Boss assets
var bossIdleFrames = [];
var bossAttackFrames = [];
var bossHitFrames = [];
var bossDeathFrames = [];
var bossHP = 200;
var bossDead = false;
var bossFrame = 0;
var bossFrameTimer = 0;
var bossHit = false;

// Modifiers
var playerDamageMultiplier = 1.0;
var incomingDamageMultiplier = 1.0;
var bossDamageMultiplier = 1.2;
var playerTemporaryNerf = false;

// Images
function preload() {
  // Rule
  comboRules = loadImage("assets/Combinations.png");
  // Maps
  forestMap1 = loadImage("assets/forest1.png");
  forestMap2 = loadImage("assets/forest2.png");

  // Dice 
  for (var i = 1; i <= 6; i++) {
    diceFaces[i] = loadImage("assets/d6_white_" + i + ".png");
  }
  for (var j = 1; j <= 6; j++) {
    enemyDice[j] = loadImage("assets/d6_red_" + j + ".png");
  }
  // Warrior Idle
  for (var i = 88; i <= 96; i++) {
    let num = nf(i, 3); // ensures 088, 089, etc.
    warriorIdleFrames.push(
      loadImage("assets/WarriorIdle/Warrior1-Axe-Idle_" + num + ".png")
    );
  }
  // Warrior Attack 
  for (var i = 35; i <= 42; i++) {
    let num = nf(i, 3); // ensures 035, 036, etc.
    warriorAttackFrames.push(
      loadImage("assets/WarriorAttack/Warrior1-Axe-Attack1_" + num + ".png")
    );
  }
  // Monster Idle 
  for (var i = 1; i <= 8; i++) {
    monsterIdleFrames.push(loadImage("assets/MonsterIdle/Bringer-of-Death_Idle_" + i + ".png"));
  }
  // Monster Attack
  for (var i = 1; i <= 10; i++) {
    monsterAttackFrames.push(loadImage("assets/MonsterAttack/Bringer-of-Death_Attack_" + i + ".png"));
  }
  // Monster Cast 
  for (var i = 1; i <= 9; i++) {
    monsterCastFrames.push(loadImage("assets/MonsterCast/Bringer-of-Death_Cast_" + i + ".png"));
  }
  // Monster Death
  for (var i = 1; i <= 9; i++) {
    monsterDeathFrames.push(loadImage("assets/MonsterDeath/Bringer-of-Death_Death_" + i + ".png"));
  }
  // Warrior Walking
  for (var i = 0; i <= 7; i++) {
    walkingWarrior[i] = loadImage(
      "assets/Warrior 1 - Axe - Walk_00" + i + ".png"
    );
  }
  // Monster Walking
  for (var i = 1; i <= 8; i++) {
    walkingMonster[i - 1] = loadImage("assets/Bringer-of-Death_Walk_" + i + ".png");
  }

  // Chest
  chestIdle = loadImage("assets/IdleChest.png");
  for (var i = 1; i <= 16; i++) {
    chestOpenFrames.push(loadImage("assets/ChestGold/Open(GoldLoot)" + i + ".png"));
  }

  // Reward items
  itemSword = loadImage("assets/IronSword.png");
  itemShield = loadImage("assets/IronShield.png");

  // Boss images
  for (var i = 1; i <= 6; i++) {
    bossIdleFrames.push(loadImage("assets/01_demon_idle/demon_idle_" + i + ".png"));
  }
  for (var i = 1; i <= 15; i++) {
    bossAttackFrames.push(loadImage("assets/03_demon_cleave/demon_cleave_" + i + ".png"));
  }
  for (var i = 1; i <= 5; i++) {
    bossHitFrames.push(loadImage("assets/04_demon_take_hit/demon_take_hit_" + i + ".png"));
  }
  for (var i = 1; i <= 22; i++) {
    bossDeathFrames.push(loadImage("assets/05_demon_death/demon_death_" + i + ".png"));
  }
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textFont("Times New Roman");
  angleMode(RADIANS);

  // Resize monster images
  const monsterGroups = [
    monsterIdleFrames,
    monsterAttackFrames,
    monsterCastFrames,
    monsterDeathFrames,
    walkingMonster
  ];
  for (let group of monsterGroups) {
    for (let img of group) {
      if (img) {
        img.resize(300, 0);
      }
    }
  }

  // Resize reward
  chestIdle.resize(140, 0);
  itemSword.resize(100, 0);
  itemShield.resize(100, 0);
  for (let img of chestOpenFrames) {
    if (img) img.resize(140, 0);
  }

  // Resize Boss
  const bossGroups = [bossIdleFrames, bossAttackFrames, bossHitFrames, bossDeathFrames];
  for (let group of bossGroups) {
    for (let img of group) {
      if (img) img.resize(600, 0);
    }
  }
}

function draw() {
  background(0);

  if (gameState === "start") {
    drawStartScreen();
  }
  else if (gameState === "menu") {
    drawMenuScreen();
  }
  else if (gameState === "play") {
    drawGame();
  }
  else if (gameState === "reward") {
    drawRewardScreen();
  }
  else if (gameState === "bossBattle") {
    drawBossBattle();
  }
  else if (gameState === "gameOver") {
    drawGameOverScreen();
  }
  else if (gameState === "gameWin") {
    drawGameWinScreen();
  }
}