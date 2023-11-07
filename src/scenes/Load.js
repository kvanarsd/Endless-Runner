class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.spritesheet("character", "./assets/CharacterWalk.png", {
            frameWidth: 124,
            frameHeight: 138
        })
        this.load.spritesheet('waveA', './assets/Waveanim.png', {
            frameWidth: 431,
            frameHeight: 402
        });
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
        this.load.image('menu1', './assets/Title.png');
        this.load.image('menu3', './assets/Instructions.png');
        this.load.image('end', './assets/End.png');
        this.load.audio('intro', './assets/intro.mp3')
        this.load.audio('game', './assets/game.mp3')
        this.load.audio('hit', './assets/explosion.wav')
        this.load.audio('boing', './assets/jump.wav')
        this.load.audio('zoom', './assets/powerUp.wav')
        this.load.audio('low', './assets/synth.wav')
    }

    create() {
        // anim for wave
        this.anims.create({
            key: 'wave',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('waveA', { start: 0, end: 8 }),
        })

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