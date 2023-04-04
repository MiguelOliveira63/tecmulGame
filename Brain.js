class AIAction {
    constructor(isJump, holdTime, xDirection) {
        this.isJump = isJump;
        this.holdTime = holdTime;//number between 0 and 1
        this.xDirection = xDirection;
    }

    clone() {
        return new AIAction(this.isJump, this.holdTime, this.xDirection);
    }

    mutate() {
        this.holdTime += Phaser.Math.FloatBetween(-0.3, 0.3);
        this.holdTime = Phaser.Math.Clamp(this.holdTime, 0.1, 1);
    }
}


// let jumpChance = 0; //the chance that a random action is a jump
let jumpChance = 0.5; //the chance that a random action is a jump
let chanceOfFullJump = 0.2;
// let chanceOfFullJump = 0.2;

class Brain {
    constructor(size, randomiseInstructions = true) {
        this.instructions = [];
        this.currentInstructionNumber = 0;
        if (randomiseInstructions)
            this.randomize(size);
        this.parentReachedBestLevelAtActionNo = 0;
    }

    randomize(size) {
        for (let i = 0; i < size; i++) {
            this.instructions[i] = this.getRandomAction();
        }
    }

    getRandomAction() {
        let isJump = false;

        if (Phaser.Math.FloatBetween(0, 1) > jumpChance) {
            isJump = true;
        }

        let holdTime = Phaser.Math.FloatBetween(0.1, 1);
        if (Phaser.Math.FloatBetween(0, 1) < chanceOfFullJump) {
            holdTime = 1;
        }

        let directions = [-1, -1, -1, 0, 1, 1, 1]
        let xDirection = Phaser.Math.RND.pick(directions);

        return new AIAction(isJump, holdTime, xDirection);
    }

    getNextAction() {
        if (this.currentInstructionNumber >= this.instructions.length) {
            return null;
        }
        this.currentInstructionNumber += 1;
        return this.instructions[this.currentInstructionNumber - 1];
    }

    clone() {
        let clone = new Brain(this.instructions.length, false);
        clone.instructions = [];
        for (let i = 0; i < this.instructions.length; i++) {
            clone.instructions.push(this.instructions[i].clone())
        }
        return clone;
    }

    mutate() {
        let mutationRate = 0.1;
        let chanceOfNewInstruction = 0.02;
        for (let i = this.parentReachedBestLevelAtActionNo; i < this.instructions.length; i++) {
            if (Phaser.Math.FloatBetween(0, 1) < chanceOfNewInstruction) {
                this.instructions[i] = this.getRandomAction()
            } else if (Phaser.Math.FloatBetween(0, 1) < mutationRate) {
                this.instructions[i].mutate();
            }
        }
    }

    mutateActionNumber(actionNumber) {
        let chanceOfNewInstruction = 0.2;
        if (Phaser.Math.FloatBetween(0, 1) < chanceOfNewInstruction) {
            this.instructions[actionNumber - 1] = this.getRandomAction()
        } else {
            this.instructions[actionNumber - 1].mutate();
        }
    }

    increaseMoves(increaseMovesBy) {
        for (var i = 0; i < increaseMovesBy; i++) {
            this.instructions.push(this.getRandomAction());
        }
    }
}
