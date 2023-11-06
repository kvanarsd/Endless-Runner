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
        this.state = new StateMachine('start', {
            start: new StartState(),
            run: new RunState(),
            jump: new JumpState(),
            dubJump: new DubJumpState(),
            duck: new DuckState(),
            hurt: new HurtState(),
            dash: new DashState()
        }, [scene, this])
    }
}

class StartState extends State {
    execute(scene, player) {
        const { space } = scene.keys

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('run')
            return
        }
    }
}

class RunState extends State { 
    enter(scene, player) {
        player.anims.play(`p-run`)
        player.doubleJump = 0;
    } 
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        const { right, up, down, space} = scene.keys

        // transition to swing if pressing space
        //console.log(Phaser.Input.Keyboard.JustDown(up), scene.onFloor)
        let collide = player.body.touching
        if(Phaser.Input.Keyboard.JustDown(up) && (scene.onFloor || collide.down)) {
            player.doubleJump = 1;
            this.stateMachine.transition('jump')
            return
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(right)) {
            this.stateMachine.transition('dash')
            return
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(down)) {
            this.stateMachine.transition('duck')
            return
        }
    }
}

class JumpState extends State {
    enter(scene, player) {
        console.log("jump")
        player.anims.play(`p-jump`)
        scene.notJump = false

        player.setVelocityY(player.velocity)
        scene.onFloor = false;
    
    }
    execute(scene, player) {
        const {up, space} = scene.keys

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
        console.log("dub")
        player.setVelocityY(player.velocity)
    }
    execute(scene, player) {
        let collide = player.body.touching
        console.log(collide.down)
        if(collide.down) {
            this.stateMachine.transition('run')
        }
    }
}

class DuckState extends State {
    enter(scene, player) {
        player.body.setSize(124,30).setOffset(0,108)
        player.anims.play(`p-duck`)
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
        player.once('animationcomplete', () => {
            this.stateMachine.transition('run')
        })
    }
}

class DashState extends State {
    enter(scene, player) {
        player.anims.play(`p-dash`)
        player.once('animationcomplete', () => {
            this.stateMachine.transition('run')
        })
    }
}
