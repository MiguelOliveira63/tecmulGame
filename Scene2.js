class Scene2 extends Phaser.scene{
	constructor(){
		super("playGame");
	}

	create(){
		this.add.text(20, 20, "Playing game", {font: "25px Arial", fill: "yellow"});
	}
}