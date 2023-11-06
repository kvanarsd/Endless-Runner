class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
    }

    create() {
        let menuConfig = {
            fontFamily: "Garamond Bold",
            fontSize: "32px",
            backgroundColor: "#fff",
            color: "#cc2570",
            align: "right",
            padding: {
                tom: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.bckg = this.add.tileSprite(0,0,640,480,'bckg').setOrigin(0,0);

        this.add.text(game.config.width/2, borderPadding + borderUISize, "Disaster Run", menuConfig).setOrigin(0.5);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            game.settings = {
                increment: 1000
            }
            this.scene.start("playScene");
        }
    }
}