// Ball Class
class Ball {
    constructor() {
        this.position = new Vec3(0, 3, 0);
        this.velocity = new Vec3(0, 0, 0);
        this.radius = 0.7;
        this.mass = 0.5;
        this.bounce = 0.9;
        this.friction = 0.92;
        this.onGround = false;
        this.mesh = null;
        this.initialPosition = this.position.clone();
    }

    update(dt) {
        // Air resistance
        this.velocity.scale(0.995);
    }

    reset() {
        this.position = new Vec3(0, 3, 0);
        this.velocity = new Vec3(0, 0, 0);
    }
}
