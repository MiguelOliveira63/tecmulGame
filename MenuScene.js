import { CST } from "../CST";
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