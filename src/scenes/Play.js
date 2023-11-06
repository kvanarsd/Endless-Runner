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
        this.dashSpeed = 0;
        this.pause = false

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
        const newBird = new Obsticle(this, game.config.width,Phaser.Math.Between(game.config.height/3, game.config.height - borderUISize*3), "ob3", 0, this.player, this.genIn).setOrigin(0,1)
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
                if(this.level % 10 == 0) {
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
            backgroundColor: "#c8d3e6",
            color: "#535e70",
            align: "right",
            padding: {
                tom: 5,
                bottom: 5,
            }
        }

        
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.score, scoreConfig);

        this.DistanceTravelled = this.time.addEvent({
            delay: 500,
            callback: () => {
                let dist = Math.ceil(this.score/10)
                this.scoreLeft.text = dist;
            },
            callbackScope: this,
            loop: true
        })
        
        this.start = this.add.text((game.config.width)/2, game.config.height - borderUISize - borderPadding * 2, "Press SPACE to restart!", scoreConfig).setOrigin(0.5,0.5);
        this.scored = this.add.text((game.config.width)/2, game.config.height/2 - borderUISize - borderPadding * 2, "", scoreConfig).setOrigin(0.5,0.5);
        this.high = this.add.text((game.config.width)/2, game.config.height/2, "", scoreConfig).setOrigin(0.5,0.5);

        this.start.depth = 10
        this.start.setVisible(false) 
        this.scored.depth = 10
        this.scored.setVisible(false) 
        this.high.depth = 10
        this.high.setVisible(false) 

        //wave
        this.wave = this.add.sprite(0 - borderUISize*9, game.config.height- 400 + borderUISize,"waveA", 6).setOrigin(0,0);
        this.wave.play("wave")
    }

    update() {
        if(!this.gameOver){
            // dash
            if(this.player.state.state == 'dash') {
                this.dashSpeed = 1.5
            }
            if(this.forward && !(this.player.x <= 150)) {
                this.player.x -= 2
            } 
            if (this.player.x <= 150) {
                this.forward = false
                this.dashSpeed = 0
            }

            // state
            this.player.state.step();

            // hurt
            if(this.hurt && this.chased && this.firstHit > 1) {
                this.wave.x = 0
                this.player.setVelocityX(this.player.push)
                this.gameOver = true
                this.firstHit = 0
            }
            if(!this.chased && this.wave.x >= -borderUISize*9) {
                this.wave.x -= 4;
            }

            // obstacle gen
            this.birds.getChildren().forEach((bird) => {
                bird.update(); // Update obstacle logic
                if(this.player.state.state == 'dash') {
                    bird.x -= this.dashSpeed
                }

                if (bird.destroyed) {
                    bird.destroy();
                    this.birds.remove(bird, true, true); // Remove obstacle from the group
                }

                if(bird.child && !bird.birthed) {
                    bird.child = false;
                    const newBird = new Obsticle(this, game.config.width, Phaser.Math.Between(game.config.height/3, game.config.height - borderUISize*3), "ob3", 0, this.player, this.genIn).setOrigin(0,1)
                    newBird.setSize(64, 20).setOffset(0, (newBird.height)/2.2);
                    newBird.anims.play("bird");
                    this.birds.add(newBird);
                    bird.birthed = true
                }
            });

            this.obs.getChildren().forEach((ob) => {
                ob.update(); // Update obstacle logic
                if(this.player.state.state == 'dash') {
                    ob.x -= this.dashSpeed
                }

                if (ob.destroyed) {
                    ob.destroy();
                    this.obs.remove(ob, true, true); // Remove obstacle from the group
                }

                if(ob.child && !ob.birthed) {
                    ob.child = false;
                    const newOb = new Obsticle(this, game.config.width,game.config.height - borderPadding*4, "ob" + Phaser.Math.Between(1, 2), 0, this.player, this.genIn/2).setOrigin(0,1)
                    this.obs.add(newOb);
                    ob.birthed = true
                }
            });
           
            // background movement
            this.bckg1.tilePositionX += .2 + this.dashSpeed/2;
            this.bckg2.tilePositionX += .4 + this.dashSpeed/2;
            this.bckg3.tilePositionX += 1 + this.dashSpeed/2;
            this.bckg4.tilePositionX += 1.3 + this.dashSpeed/2;
            this.floor.tilePositionX += this.speed + this.dashSpeed;

            // score
            this.score += this.speed + this.dashSpeed;
        } 

        if(this.gameOver) {
            this.difficulty.paused = true;
            this.DistanceTravelled.paused = true;
            let cur = Math.ceil(this.score/10);
            if(cur > localStorage.getItem("score")) {
                localStorage.setItem("score", cur);
            }
            this.end = this.time.delayedCall(1000, () => {
                this.bckg = this.add.tileSprite(0,0,game.config.width,game.config.height,'end').setOrigin(0,0);
                this.scored.text = "You got " + cur
                this.high.text = "Current HighScore: " + localStorage.getItem("score")
                this.scored.setVisible(true) 
                this.high.setVisible(true) 

                this.paused = this.time.delayedCall(1000, () => {
                    this.pause = true;
                    this.start.setVisible(true) 
                });
            });

            if(this.pause && Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.scene.restart();
            }
        }

        
    }
}