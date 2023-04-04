var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);


let canvas = null;

let player = null;
let lines = [];
let backgroundImage = null;


let creatingLines = false;

let idleImage = null;
let squatImage = null;
let jumpImage = null;
let oofImage = null;
let run1Image = null;
let run2Image = null;
let run3Image = null;
let fallenImage = null;
let fallImage = null;
let showingLines = false;
let showingCoins = false;
let levelImages = [];

let placingPlayer = false;
let placingCoins = false;
let playerPlaced = false;

let testingSinglePlayer = true;


let fallSound = null;
let jumpSound = null;
let bumpSound = null;
let landSound = null;

let snowImage = null;


let population = null;
let levelDrawn = false;


let startingPlayerActions = 5;
let increaseActionsByAmount = 5;
let increaseActionsEveryXGenerations = 10;
let evolationSpeed = 1;



function preload() {

    this.load.image('background', 'images/levelImages/1.png');
    this.load.image('idle', 'images/poses/idle.png');
    this.load.image('squat', 'images/poses/squat.png');
    this.load.image('jump', 'images/poses/jump.png');
    this.load.image('oof', 'images/poses/oof.png');
    this.load.image('run1', 'images/poses/run1.png');
    this.load.image('run2', 'images/poses/run2.png');
    this.load.image('run3', 'images/poses/run3.png');
    this.load.image('fallen', 'images/poses/fallen.png');
    this.load.image('fall', 'images/poses/fall.png');

    this.load.image('snow', 'images/snow3.png');

    for (let i = 1; i <= 43; i++) {
        this.load.image('level' + i, 'images/levelImages/' + i + '.png');
    }

    this.load.audio('jump', 'sounds/jump.mp3');
    this.load.audio('fall', 'sounds/fall.mp3');
    this.load.audio('bump', 'sounds/bump.mp3');
    this.load.audio('land', 'sounds/land.mp3');
}

function create(){


    player = new Player();
    population = new Population(600);
    setupLevels();
    jumpSound.setDetune(0); // if you need to change the detune for the sustain mode, change it here
    jumpSound.setLoop(true);
    fallSound.setDetune(0);
    fallSound.setLoop(true);
    bumpSound.setDetune(0);
    bumpSound.setLoop(true);
    landSound.setDetune(0);
    landSound.setLoop(true);

    this.input.on('pointerdown', function (pointer) {
        if (creatingLines) {
          let snappedX = pointer.x - pointer.x % 20;
          let snappedY = pointer.y - pointer.y % 20;
          if (mousePos1 == null) {
            mousePos1 = createVector(snappedX, snappedY);
          } else {
            mousePos2 = createVector(snappedX, snappedY);
            lines.push(new Line(mousePos1.x, mousePos1.y, mousePos2.x, mousePos2.y));
            linesString += '\ntempLevel.lines.push(new Line(' + mousePos1.x + ',' + mousePos1.y + ',' + mousePos2.x + ',' + mousePos2.y + '));';
            mousePos1 = null;
            mousePos2 = null;
          }
        } else if (placingPlayer && !playerPlaced) {
          playerPlaced = true;
          player.currentPos = createVector(pointer.x, pointer.y);
        } else if (placingCoins) {
          // ...
        }
        print("levels[" + player.currentLevelNo + "].coins.push(new Coin( " + floor(pointer.x) + "," + floor(pointer.y - 50) + ' , "progress" ));');
    });
}



let levelNumber = 0;
let previousFrameRate = 60;



function update() {
    
         //draw
    this.cameras.main.setBackgroundColor('#0a0a0a');
    this.cameras.main.scrollY = 50;

    if (testingSinglePlayer) {
        this.add.image(0, 0, levels[player.currentLevelNo].levelImage);
        levels[player.currentLevelNo].show();
        player.Update();
        player.Show();
    } else if (replayingBestPlayer) {
        if (!cloneOfBestPlayer.hasFinishedInstructions) {
            for (let i = 0; i < evolationSpeed; i++) {
                cloneOfBestPlayer.Update();
            }
            showLevel(cloneOfBestPlayer.currentLevelNo);
            alreadyShowingSnow = false;
            cloneOfBestPlayer.Show();
        } else {
            replayingBestPlayer = false;
            mutePlayers = true;
        }
    } else {
        if (population.AllPlayersFinished()) {
            population.NaturalSelection();
            if (population.gen % increaseActionsEveryXGenerations === 0) {
                population.IncreasePlayerMoves(increaseActionsByAmount);
            }
        }
        for (let i = 0; i < evolationSpeed; i++) {
            population.Update();
        }
        // population.Update()
        // population.Update()
        population.Show();
    }

    if (showingLines || creatingLines) {
        showLines();
    }

    if (creatingLines) {
        drawMousePosition();
    }

    if (this.frame % 15 === 0) {
        previousFrameRate = Math.floor(this.game.loop.actualFps);
    }

    this.cameras.main.resetFX();

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, this.cameras.main.width, 50);

    if (!testingSinglePlayer) {
        let fpsText = this.add.text(this.cameras.main.width - 160, 35, 'FPS: ' + previousFrameRate, {
            font: '32px Arial',
            fill: '#fff'
        });
        let genText = this.add.text(30, 35, 'Gen: ' + population.gen, {
            font: '32px Arial',
            fill: '#fff'
        });
        let movesText = this.add.text(200, 35, 'Moves: ' + population.players[0].brain.instructions.length, {
            font: '32px Arial',
            fill: '#fff'
        });
        let bestHeightText = this.add.text(400, 35, 'Best Height: ' + population.bestHeight, {
            font: '32px Arial',
            fill: '#fff'
        });
    }

    //////////////////////////////////////////////////////////////////////////

        // Check if spacebar is pressed
        if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.SPACE)) {
            player.jumpHeld = true;
        }
    
        // Check if R key is pressed
        if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.R)) {
            population.ResetAllPlayers();
        }
    
        // Check if S key or any arrow key is pressed
        if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.S) ||
            this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT) ||
            this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) {
            bumpSound.stop();
            jumpSound.stop();
            landSound.stop();
            fallSound.stop();
        }
    
        // Check if left arrow key is pressed
        if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) {
            player.leftHeld = true;
        }
    
        // Check if right arrow key is pressed
        if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) {
            player.rightHeld = true;
        }

        
    replayingBestPlayer = false;
    cloneOfBestPlayer = null;

    function keyReleased(event) {

        switch (event.key) {
            case 'B':
                replayingBestPlayer = true;
                cloneOfBestPlayer = population.cloneOfBestPlayerFromPreviousGeneration.clone();
                evolationSpeed = 1;
                mutePlayers = false;
                break;


            case ' ':

                if (!creatingLines) {
                    player.jumpHeld = false
                    player.Jump()
                }
                break;
            case 'R':
                if (creatingLines) {
                    lines = [];
                    linesString = "";
                    mousePos1 = null;
                    mousePos2 = null;
                }
                break;
            case 'N':
                if (creatingLines) {
                    levelNumber += 1;
                    linesString += '\nlevels.push(tempLevel);';
                    linesString += '\ntempLevel = new Level();';
                    console.log(linesString);
                    lines = [];
                    linesString = '';
                    mousePos1 = null;
                    mousePos2 = null;
                } else {
                    player.currentLevelNo += 1;
                    console.log(player.currentLevelNo);
                }
                break;
            case 'D':
                if (creatingLines) {

                    mousePos1 = null;
                    mousePos2 = null;
                }
        }

        switch (event.keyCode) {
            case 37:
                player.leftHeld = false;
                break;
            case 39:
                player.rightHeld = false;
                break;
            case 40:
                evolationSpeed = Phaser.Math.Clamp(evolationSpeed - 1, 0, 50);
                console.log(evolationSpeed);
                break;
            case 38:
                evolationSpeed = Phaser.Math.Clamp(evolationSpeed + 1, 0, 50);
                console.log(evolationSpeed);
                break;
        }
    }

    let mousePos1 = null;
    let mousePos2 = null;
    let linesString = "";

    function drawMousePosition() {
        let snappedX = mouseX - mouseX % 20;
        let snappedY = mouseY - mouseY % 20;
        push();
    
    
        fill(255, 0, 0)
        noStroke();
        ellipse(snappedX, snappedY, 5);
    
        if (mousePos1 != null) {
            stroke(255, 0, 0)
            strokeWeight(5)
            line(mousePos1.x, mousePos1.y, snappedX, snappedY)
        }
    
        pop();
    }


    function showLevel(levelNumberToShow) {
        levels[levelNumberToShow].show();
    }
    
    function showLines() {
        if (creatingLines) {
            for (let l of lines) {
                l.Show();
            }
        } else {
            for (let l of levels[player.currentLevelNo].lines) {
                l.Show();
            }
        }
    }

}

//    function setupCanvas() {
//       canvas = createCanvas(1200, 950);
//       canvas.parent('canvas');
//       width = canvas.width;
//        height = canvas.height - 50;
//    }

//todo
// things to do
// - when a player lands in a new level, record the game state and start the next evolution at that point DONE
// - when a player falls into a previous level, end the players movements, and mutate that move which fucked them up with a 100% chance
// fix landing logic so it checks below maybe, or it checks after all the corrections are done that there is still something below it. actually lets do that now. i dont knwo why im still typing this


// - add a player replay, we could also include a generation replay, thats probably it
// - maybe consider adding a goal system for really hard levels
