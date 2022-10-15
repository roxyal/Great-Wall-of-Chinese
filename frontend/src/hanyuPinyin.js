/**@type {import("../typings/phaser")} */

import { HanyuPinyinWorld } from "./scenes/HanyuPinyinWorld.js";

let config = {
    width: 800,
    height: 600,
    parent: 'hanyuPinyinWorld',
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
    scene: [HanyuPinyinWorld]
}

let game = new Phaser.Game(config);