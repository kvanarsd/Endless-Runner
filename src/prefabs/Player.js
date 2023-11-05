class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        //this.body.setCollideWorldBounds(true);
        this.body.setGravityY(700);
        this.body.setSize(28,37).setOffset(10,11)

        this.velocity = -450;
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
        if(Phaser.Input.Keyboard.JustDown(up) && player.body.blocked.down) {
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
        const {up} = scene.keys
        scene.notJump = false
        player.anims.stop();
        //player.anims.play(`p-jump`)
        player.setVelocityY(player.velocity)
        
        // scene.time.delayedCall(400, () => {
        //     player.anims.play(`p-run`)
        // })
        console.log(player.body.onFloor)
        if(player.doubleJump < 2 && up.isDown && player.body.onFloor) {
            console.log("jump!")
            player.doubleJump = 2;
            this.stateMachine.transition('dubJump')
        } 
        if (player.body.blocked.down) {
            this.stateMachine.transition('run')
        }
    }
}

class DubJumpState extends State {
    enter(scene, player) {
        console.log("dub")
        player.setVelocityY(player.velocity)

        if (player.body.blocked.down) {
            this.stateMachine.transition('run')
        }
    }
}

class DuckState extends State {
    enter(scene, player) {
        player.body.setSize(18,27).setOffset(18,18)
        player.anims.play(`p-duck`)
        player.once('animationcomplete', () => {
            player.body.setSize(28,37).setOffset(10,11)
            this.stateMachine.transition('run')
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
