/** @type {import("phaser")} */

import{LoadScene} from "./scenes/LoadScene"
import{MenuScene} from "./scenes/MenuScene"

let game=new Phaser.Game({ 
    width: 600,
    height: 800,
    scene:[ LoadScene, MenuScene]   
})