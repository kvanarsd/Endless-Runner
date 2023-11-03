/*
Katrina Vanarsdale

Hours:
*/
let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    width: 800,
    height: 480,
    scene: [ Load, Menu, Play]
}

let game = new Phaser.Game(config)

// ui sizes 
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keySPACE, keyUP, keyDOWN;