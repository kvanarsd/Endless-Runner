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
        
        this.bckg = this.add.image(0,0,'menu1').setOrigin(0,0);

        let Config = {
            fontFamily: "Garamond Bold",
            fontSize: "28px",
            backgroundColor: "#c8d3e6",
            color: "#535e70",
            align: "right",
            padding: {
                tom: 5,
                bottom: 5,
            }
        }
        this.start = this.add.text((game.config.width)/1.5, game.config.height - borderUISize - borderPadding * 2, "Press SPACE to start!", Config);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        let music = this.sound.add('intro')
        music.loop = true
        music.play()

        this.pressed = false
    }   

    update() {
        if(!this.pressed && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.pressed = true
            this.bckg.setTexture('menu2')
            this.start.setVisible(false)
            this.credits = this.time.delayedCall(2500, () => {
                this.bckg.setTexture('menu3')
            
                this.instruct = this.time.delayedCall(5000, () => {
                    game.settings = {
                        increment: 10000
                    }
                    this.scene.start("playScene");
                });
            });
        }
    }
}