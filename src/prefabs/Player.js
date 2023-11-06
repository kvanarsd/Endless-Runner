class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        //this.body.setCollideWorldBounds(true);
        this.body.setGravityY(700);
        this.body.setSize(50,138).setOffset(74,0)

        this.velocity = -400;
        this.push = -300;
        this.jumpCool = 800;
        this.doubleJump = 0;

        //state machine
        this.state = new StateMachine('run', {
            run: new RunState(),
            jump: new JumpState(),
            dubJump: new DubJumpState(),
            duck: new DuckState(),
            hurt: new HurtState(),
            dash: new DashState()
        }, [scene, this])
    }
}


class RunState extends State { 
    enter(scene, player) {
        player.anims.play(`p-run`)
        player.doubleJump = 0;
        scene.hurt = false
    } 
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const { right, up, down, space} = scene.keys

        if(scene.hurt) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(Phaser.Input.Keyboard.JustDown(up) && (scene.onFloor || collide.down)) {
            player.doubleJump = 1;
            this.stateMachine.transition('jump')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(right) && !scene.forward) {
            this.stateMachine.transition('dash')
            return
        }

        if(Phaser.Input.Keyboard.JustDown(down)) {
            this.stateMachine.transition('duck')
            return
        }
    }
}

class JumpState extends State {
    enter(scene, player) {
        player.anims.play(`p-jump`)
        scene.notJump = false

        player.setVelocityY(player.velocity)
        scene.onFloor = false;
    
    }
    execute(scene, player) {
        const {up, space} = scene.keys

        if(scene.hurt) {
            this.stateMachine.transition('hurt')
            return
        }

        let collide = player.body.touching
        if(!Phaser.Input.Keyboard.JustDown(up) && (scene.onFloor || collide.down)) {
            this.stateMachine.transition('run')
        }
        if(player.doubleJump < 2 && Phaser.Input.Keyboard.JustDown(space) && !scene.onFloor) {
            player.doubleJump = 2;
            this.stateMachine.transition('dubJump')
        } 

        
    }
}

class DubJumpState extends State {
    enter(scene, player) {
        player.setVelocityY(player.velocity)
    }
    execute(scene, player) {
        if(scene.hurt) {
            this.stateMachine.transition('hurt')
            return
        } 

        let collide = player.body.touching
        if(collide.down) {
            this.stateMachine.transition('run')
        }
    }
}

class DuckState extends State {
    enter(scene, player) {
        player.body.setSize(124,30).setOffset(0,108)
        player.anims.play(`p-duck`)
        
    }execute(scene, player) {
        if(scene.hurt) {
            this.stateMachine.transition('hurt')
            return
        }

        player.once('animationcomplete', () => {
            scene.time.delayedCall(200, () => {
                player.body.setSize(50,138).setOffset(74,0)
                this.stateMachine.transition('run')
            })
        })
    }
}

class HurtState extends State {
    enter(scene, player) {
        player.anims.play(`p-hurt`)
        scene.chased = true
        scene.wave.x = -borderUISize*6
        scene.waves = scene.time.delayedCall(5000, () => {
            scene.chased = false
            scene.firstHit= 0
        }, null, scene)
        player.once('animationcomplete', () => {
            this.stateMachine.transition('run')
        })
    }
}

class DashState extends State {
    enter(scene, player) {
        player.anims.play(`p-dash`) 
        player.setVelocityX(-player.velocity/3)
        scene.dashSpeed = 1.5
    }
    execute(scene, player) {
        if(scene.hurt) {
            this.stateMachine.transition('hurt')
            return
        }

        if(player.x >= 190) {
            player.setVelocityX(0)
            scene.forward = true
        }

        player.once('animationcomplete', () => {
            this.stateMachine.transition('run')
        })
    }
}
