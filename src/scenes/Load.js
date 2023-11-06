class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.spritesheet("character", "./assets/CharacterWalk.png", {
            frameWidth: 124,
            frameHeight: 138
        })
        this.load.image('bckg1', './assets/bckg1.png');
        this.load.image('bckg2', './assets/bckg2.png');
        this.load.image('bckg3', './assets/bckg3.png');
        this.load.image('bckg4', './assets/bckg4.png');
        this.load.image('ob1', './assets/ob1.png');
        this.load.image('ob2', './assets/ob2.png');
        this.load.spritesheet('ob3', './assets/ob3.png', {
            frameWidth: 64,
            frameHeight: 93
        });
        this.load.image('sand', './assets/Sand.png');
    }

    create() {
        // animation for obsticle
        this.anims.create({
            key: 'bird',
            frameRate: 5,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNumbers('ob3', { start: 0, end: 4 }),
        })
        // animations for player
        this.anims.create({
            key: 'p-run',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 6 }),
        })

        this.anims.create({
            key: 'p-jump',
            frameRate: 3,
            repeat: 0 ,
            frames: this.anims.generateFrameNumbers('character', { start: 8, end: 10 }),
        })

        this.anims.create({
            key: 'p-hurt',
            frameRate: 8,
            repeat: 6,
            frames: this.anims.generateFrameNumbers('character', { start: 15, end: 15 }),
        })

        this.anims.create({
            key: 'p-duck',
            frameRate: 3,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('character', { start: 11, end: 13 }),
        })

        this.anims.create({
            key: 'p-dash',
            frameRate: 8,
            repeat: 2,
            frames: this.anims.generateFrameNumbers('character', { start: 14, end: 14 }),
        })

        this.scene.start("menuScene");
    }
}