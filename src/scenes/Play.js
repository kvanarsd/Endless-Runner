class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.speed = 3;
        this.genIn = game.config.width / 3;

        // background scene
        this.bckg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height,"bckg1").setOrigin(0,0);
        this.bckg2 = this.add.tileSprite(0, 0, game.config.width, game.config.height,"bckg2").setOrigin(0,0);
        this.bckg3 = this.add.tileSprite(0, 0, game.config.width, game.config.height,"bckg3").setOrigin(0,0);
        this.bckg4 = this.add.tileSprite(0, 0, game.config.width, game.config.height,"bckg4").setOrigin(0,0);
        this.floor = this.add.tileSprite(0, game.config.height - 42, game.config.width, game.config.height/6,"sand").setOrigin(0,0);
        this.physics.add.existing(this.floor, true);

        // keys
        this.keys = this.input.keyboard.createCursorKeys()
        
        // player code
        this.player = new Player(this, 150, game.config.height/2, "character", 7).setOrigin(0,0)

        // obstacles
        //this.ob1 = this.physics.add.sprite(game.config.width + borderPadding, Phaser.Math.Between(game.config.height/2 + borderPadding*3, game.config.height - borderPadding*7), "ob3").setImmovable(true);
        this.ob3 = new Obsticle(this, game.config.width,Phaser.Math.Between(game.config.height/2 + borderPadding*3, game.config.height - borderPadding*7), "ob3", this.player).setOrigin(0,1)

        this.ob3.anims.play("bird");
        this.ob3.setSize(64, 20).setOffset(0, 2*(this.ob3.height)/3);
        //this.ob1.setSize(64, 20).setOffset(0, 2*(this.ob1.height)/3);

        // collision
        this.player.setDepth(10); // or any appropriate depth value
        this.ob3.setDepth(10); // or the same depth value as the player
        
        this.physics.add.collider(this.floor, this.player);
        this.physics.add.collider(this.player, this.ob3 , () => {
            console.log("collided")
            this.player.setVelocityX(this.player.push)
            this.gameOver = true;
            
        }, null, this);

        // if((this.player.height + this.player.y) < (this.ob3.y + 2*(this.ob3.height)/3)) {
        //     return false
        // }

        // game over
        this.gameOver = false;
    
        this.difficulty = this.time.addEvent({
            delay: game.settings.increment,
            callback: () => {
                this.speed += .2
                console.log(this.speed)
            },
            callbackScope: this,
            loop: true
        })
    }

    update() {
        
        //console.log(this.physics.world.collide(this.player, this.ob3))
        // scrolling
        if(!this.gameOver){
            this.ob3.update();
            this.bckg1.tilePositionX += .2;
            this.bckg2.tilePositionX += .4;
            this.bckg3.tilePositionX += 1;
            this.bckg4.tilePositionX += 1.3;
            this.floor.tilePositionX += this.speed;
            // console.log(this.player.y - this.player.height/2)
            // console.log(this.ob3.y)
            // console.log(this.ob3.y + this.ob3.height/2)
            // console.log(this.ob3.y + this.ob3.height)
            console.log(this.ob3.y + 1 >= this.player.y && this.player.y >= this.ob3.y -2)
            //console.log(this.player.y >= this.ob3.y -2)
            if((this.ob3.y + .5 >= this.player.y && this.player.y >= this.ob3.y -2)
            && ((this.ob3.x <= this.player.x && this.player.x <= this.ob3.x + this.ob3.width) 
            || (this.player.x + this.player.width >= this.ob3.x && this.player.x + this.player.width <= this.ob3.x + this.ob3.width))) {
                this.player.setVelocityX(this.player.push)
                this.gameOver = true;
            }
            // if(this.ob1.x >= -borderPadding) {
            //     this.ob1.x -= this.speed;
            // } else{
            //     this.ob1.y =  Phaser.Math.Between(game.config.height/2 + borderPadding*3, game.config.height - borderPadding*7)
            //     this.ob1.x = game.config.width + borderPadding
            // }
        }

        // state
        this.player.state.step();
    }
}