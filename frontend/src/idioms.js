import {IdiomsWorld} from "./scenes/IdiomsWorld.js";

let config = {
    width: 800,
    height: 600,
    parent: 'idiomWorld',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
    },
    scene: [IdiomsWorld]
}

let game = new Phaser.Game(config);