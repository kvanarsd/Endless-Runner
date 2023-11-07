/*
Katrina Vanarsdale

Game Name: Escaping Horizons

Hours: Probably almost 30 but I forgot to keep track again

Technically Interesting:
In my game I implemented two different types of obstacle groups (I know I spelled obstacle wrong but I realized too late)
because I needed to change the hitbox and start the animation for every bird, whereas the rock and shell are pretty similar and are not animationed.
The rock and shell also sit on the ground while the birds are randomly generated on the y axis. Something I also tried to implement
was to make sure that the birds aren't too close to the ground objects. So I checked that the distance between the two. If they are too close
I move the ground object a little further back to hopefully give the player a better chance. -- This appears in both the create and update functions in the Play.js Scene

Honorable mention - When increasing the difficulty of the game, I roll back the difficulty a bit every 10 "levels" so the game doesn't become too impossible too quickly.
-- Found in the create function of Play.js

Visual Style:
Something I was really excited to implement in this game was the rolling waves chasing the character. I wanted to recreate the tense feeling of messing up and seeing the "gorrilas"
chasing you in temple run. It also gives the player a second chance if they mess up (while decreasing their score a bit). My story for the game is that
the character is escaping a natural disaster, so it was important I show the player what is after them. I'm also not really used to animating but it was important to me that 
everything looked like it was moving, so I'm really proud of all the animations I made even though they're not perfect. -- Anims created in Load.js and implemented in Play.js
*/
let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
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