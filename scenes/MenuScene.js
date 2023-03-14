import { CST } from "../CST.js";
import { LoadScene } from ".scenes/LoadScene"
export class MenuScene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.MENU
		})

	}
	init(data){
		consolo.log(data);
		consolo.logo("I GOT IT");

	}
	preload(){


	}
	creat(){
		this.scene.start(CST.SCENES.MENU);
	}
}