class Obsticle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player) {
        super(scene, x, y, texture, player);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        this.setImmovable(true)

        this.child = false;
        this.speed = scene.speed;
        this.destroy = false
        this.genIn = scene.genIn
    }

    update() {
        if(this.x >= -borderPadding*3) {
            this.x -= this.speed;
        } else {
            this.destroy = true
        }
        if(this.x <= this.genIn && !this.child) {
            this.child = true
        }
    }
}