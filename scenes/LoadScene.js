import { CST } from "/CST";
import {  MenuScene } from "./scenes/MenuScene";
export class Loadscene extends Phaser.Scene{
	constructor(){
		super({
			key: CST.SCENES.LOAD
		})

	}
	init(){

		
	}
	preload(){
		//marcelo


	}
	create(){
		this.scene.add(CST.SCENES.MENU, MenuScene, false)
		this.scene.start(CST.SCENES.MENU, "HELLO from load scene!");
	}
}