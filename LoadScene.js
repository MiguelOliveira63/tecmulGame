import { CST } from "../CST";
export class Loadscene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.LOAD
		})

	}
	init(){


	}
	preload(){


	}
	creat(){
		this.scene.start(CST.SCENES.MENU, "HELLO from load scene!");
	}
}