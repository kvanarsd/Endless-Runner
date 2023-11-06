class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        //variables 
        this.speed = 3;
        this.genIn = game.config.width / 12;
        this.onFloor = false;
        this.score = 0;
        this.level = 0;
        this.chased = false;
        this.hurt = false;
        this.firstHit = 0;
        this.forward = false;

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
        
        //camera
        this.camera = this.cameras.main.setZoom(1.007)

        // player code
        this.player = new Player(this, 150, game.config.height/2, "character", 7).setOrigin(0,0).setScale(.8 )

        // Bird obstacles
        const newBird = new Obsticle(this, game.config.width,Phaser.Math.Between(game.config.height/2 + borderPadding*3, game.config.height - borderPadding*4), "ob3", 0, this.player, this.genIn).setOrigin(0,1)
        newBird.anims.play("bird");
        newBird.setSize(64, 20).setOffset(0, (newBird.height)/2.2);
        this.birds = this.physics.add.group(config = {
            immovable: true
        });
        this.birds.add(newBird)
        
        // Other obstacles
        const newOb = new Obsticle(this, game.config.width *1.5,game.config.height - borderPadding*4, "ob" + Phaser.Math.Between(1, 2), 0, this.player, this.genIn).setOrigin(0,1)
       
        this.obs = this.physics.add.group(config = {
            immovable: true
        });
        this.obs.add(newOb);

        // collision
        this.physics.add.collider(this.floor, this.player, () => {
            this.onFloor = true;
        });

        this.physics.add.collider(this.player, this.birds , (player, bird) => {
            let collide = player.body.touching
            if(!collide.down || this.onFloor) {
                this.hurt = true;
                this.firstHit += 1

                let randomIntensity = Phaser.Math.FloatBetween(.001, .005)
                this.camera.shake(300, randomIntensity, false)
                
                if(!bird.birthed) {
                    const newBird = new Obsticle(this, game.config.width, Phaser.Math.Between(game.config.height/2 + borderPadding*3, game.config.height - borderPadding*4), "ob3", 0, this.player, this.genIn).setOrigin(0,1)
                    newBird.setSize(64, 20).setOffset(0, (newBird.height)/2.2);
                    newBird.anims.play("bird");
                    this.birds.add(newBird);
                    bird.birthed = true
                    this.score -= 5 + this.level
                }
                bird.destroy();
            }
        }, null, this);

        this.physics.add.collider(this.player, this.obs , (player, ob) => {
            let collide = player.body.touching
            if(!collide.down || this.onFloor) {
                this.hurt = true;
                this.firstHit += 1

                let randomIntensity = Phaser.Math.FloatBetween(.001, .005)
                this.camera.shake(300, randomIntensity, false)

                if(!ob.birthed) {
                    const newOb = new Obsticle(this, game.config.width,game.config.height - borderPadding*4, "ob" + Phaser.Math.Between(1, 2), 0, this.player, this.genIn/2).setOrigin(0,1)
                    this.obs.add(newOb);
                    ob.birthed = true
                    this.score -= 5 + this.level
                }
                ob.destroy();
            }
        }, null, this);

        // game over
        this.gameOver = false;
        
        // increase difficulty
        this.difficulty = this.time.addEvent({
            delay: game.settings.increment,
            callback: () => {
                this.genIn += 30
                this.speed += .2
                this.level += 1
                console.log(this.level)
                if(this.level % 10 == 0) {
                    console.log("roll back")
                    this.genIn = this.genIn / 2
                    this.speed -= this.speed / 5
                }
            },
            callbackScope: this,
            loop: true
        })

        // score
        let scoreConfig = {
            fontFamily: "Garamond Bold",
            fontSize: "28px",
            backgroundColor: "#facade",
            color: "#843605",
            align: "right",
            padding: {
                tom: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.score, scoreConfig);
    }

    update() {
        //console.log(this.forward, this.player.x <= 150)
        if(!this.gameOver){
            if(this.forward && !(this.player.x <= 150)) {
                this.player.x -= 3
            } 
            if (this.player.x <= 150) {
                console.log("not forward")
                this.forward = false
            }
            // state
            this.player.state.step();

            if(this.hurt && this.chased && this.firstHit > 1) {
                this.player.setVelocityX(this.player.push)
                this.gameOver = true
                this.firstHit = 0
            }

            // obstacle gen
            this.birds.getChildren().forEach((bird) => {
                bird.update(); // Update obstacle logic
                if(this.player.state.state == 'dash') {
                    bird.x -= 1
                }

                if (bird.destroyed) {
                    bird.destroy();
                    this.birds.remove(bird, true, true); // Remove obstacle from the group
                }

                if(bird.child && !bird.birthed) {
                    bird.child = false;
                    const newBird = new Obsticle(this, game.config.width, Phaser.Math.Between(game.config.height/2 + borderPadding*3, game.config.height - borderPadding*4), "ob3", 0, this.player, this.genIn).setOrigin(0,1)
                    newBird.setSize(64, 20).setOffset(0, (newBird.height)/2.2);
                    newBird.anims.play("bird");
                    this.birds.add(newBird);
                    bird.birthed = true
                    this.score += 5 + this.level
                }
            });

            this.obs.getChildren().forEach((ob) => {
                ob.update(); // Update obstacle logic

                if (ob.destroyed) {
                    ob.destroy();
                    this.obs.remove(ob, true, true); // Remove obstacle from the group
                }

                if(ob.child && !ob.birthed) {
                    ob.child = false;
                    const newOb = new Obsticle(this, game.config.width,game.config.height - borderPadding*4, "ob" + Phaser.Math.Between(1, 2), 0, this.player, this.genIn/2).setOrigin(0,1)
                    this.obs.add(newOb);
                    ob.birthed = true
                    this.score += 5 + this.level
                }
            });
           
            // background movement
            this.bckg1.tilePositionX += .2;
            this.bckg2.tilePositionX += .4;
            this.bckg3.tilePositionX += 1;
            this.bckg4.tilePositionX += 1.3;
            this.floor.tilePositionX += this.speed;

            // score
            
            this.scoreLeft.text = this.score;
        } 

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.restart();
        }

        
    }
}