class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.spritesheet("character", "./assets/Character_002.png", {
            frameWidth: 48
        })
        this.load.image('bckg1', './assets/bckg1.png');
        this.load.image('bckg2', './assets/bckg2.png');
        this.load.image('bckg3', './assets/bckg3.png');
        this.load.image('bckg4', './assets/bckg4.png');
        this.load.image('ob1', './assets/ob1.png');
        this.load.image('ob2', './assets/ob2.png');
        this.load.spritesheet('ob3', './assets/ob3.png', {
            frameWidth: 64,
            frameHeight: 65
        });
        this.load.image('sand', './assets/Sand.png');
    }

    create() {
        // animation for obsticle
        this.anims.create({
            key: 'bird',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ob3', { start: 0, end: 0 }),
        })
        // animations for player
        this.anims.create({
            key: 'p-run',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('character', { start: 6, end: 8 }),
        })

        this.anims.create({
            key: 'p-jump',
            frameRate: 0,
            repeat: 0 ,
            frames: this.anims.generateFrameNumbers('character', { start: 7, end: 7 }),
        })

        this.anims.create({
            key: 'p-hurt',
            frameRate: 8,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('character', { start: 4, end: 6 }),
        })

        this.anims.create({
            key: 'p-duck',
            frameRate: 3,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('character', { start: 9, end: 11 }),
        })

        this.anims.create({
            key: 'p-dash',
            frameRate: 3,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 2 }),
        })

        this.scene.start("menuScene");
    }
}