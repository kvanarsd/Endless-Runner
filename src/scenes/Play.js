class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.speed = 3;
        this.genIn = game.config.width / 12;
        this.notJump = true;

        // background scene
        this.bckg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height,"bckg1").setOrigin(0,0);
        this.bckg2 = this.add.tileSprite(0, 0, game.config.width, game.config.height,"bckg2").setOrigin(0,0);
        this.bckg3 = this.add.tileSprite(0, 0, game.config.width, game.config.height,"bckg3").setOrigin(0,0);
        this.bckg4 = this.add.tileSprite(0, 0, game.config.width, game.config.height,"bckg4").setOrigin(0,0);
        this.floor = this.add.tileSprite(0, game.config.height - 42, game.config.width, game.config.height/6,"sand").setOrigin(0,0);
        this.physics.add.existing(this.floor, true);

        // keys
        this.keys = this.input.keyboard.createCursorKeys()
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        // player code
        this.player = new Player(this, 150, game.config.height/2, "character", 7).setOrigin(0,0)

        // obstacles
        const newBird = new Obsticle(this, game.config.width,Phaser.Math.Between(game.config.height/2 + borderPadding*3, game.config.height - borderPadding*4), "ob3", 0, this.player).setOrigin(0,1)

        newBird.anims.play("bird");
        newBird.setSize(64, 20).setOffset(0, (newBird.height)/2.2);

        // collision
        this.physics.add.collider(this.floor, this.player);

        this.birds = this.physics.add.group(config = {
            immovable: true
        });
        this.birds.add(newBird)

        this.physics.add.collider(this.player, this.birds , () => {
            let collide = this.player.body.touching
            if(!collide.down || this.notJump) {
                this.player.setVelocityX(this.player.push)
                this.gameOver = true;
            }
        }, null, this);

        // game over
        this.gameOver = false;
        
        // increase difficulty
        this.difficulty = this.time.addEvent({
            delay: game.settings.increment,
            callback: () => {
                this.genIn += 100
                this.speed += .2
                console.log(this.speed)
            },
            callbackScope: this,
            loop: true
        })
    }

    update() {
        if(!this.gameOver){
            // obstacle gen
            this.birds.getChildren().forEach((bird) => {
                bird.update(); // Update obstacle logic

                if (bird.destroyed) {
                    bird.destroy();
                    this.birds.remove(bird, true, true); // Remove obstacle from the group
                }

                if(bird.child && !bird.birthed) {
                    bird.child = false;
                    const newBird = new Obsticle(this, game.config.width,game.config.height - borderPadding*4, "ob3", 0, this.player).setOrigin(0,1)
                    newBird.child = false;
                    newBird.setSize(64, 20).setOffset(0, (newBird.height)/2.2);
                    newBird.anims.play("bird");
                    this.birds.add(newBird);
                    bird.birthed = true
                }
            });

            // collision after jumping
            if(!this.notJump) {
                
            }
           
            // background movement
            this.bckg1.tilePositionX += .2;
            this.bckg2.tilePositionX += .4;
            this.bckg3.tilePositionX += 1;
            this.bckg4.tilePositionX += 1.3;
            this.floor.tilePositionX += this.speed;
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            console.log("Spaces")
            this.scene.restart();
        }

        // state
        this.player.state.step();
    }
}