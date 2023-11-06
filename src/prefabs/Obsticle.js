class Obsticle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, player, genIn) {
        super(scene, x, y, texture, frame, player, genIn);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        this.setImmovable(true)

        this.child = false;
        this.birthed = false;
        this.speed = scene.speed;
        this.destroyed = false
        this.genIn = Phaser.Math.Between(genIn - borderUISize*3, genIn + borderUISize*3)
    }

    update() {
        if(this.x >= -borderUISize*2) {
              this.x -= this.speed;
        } else {
             this.destroyed = true
        } 
        if(this.x <=  this.genIn&& !this.child) {
            this.child = true
        }
    }
}