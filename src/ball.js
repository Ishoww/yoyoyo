// Ball Class
class Ball {
    constructor() {
        this.position = new Vec3(0, 3, 0);
        this.velocity = new Vec3(0, 0, 0);
        this.radius = 0.7;
        this.mass = 0.2; // Reduzido para ser mais leve
        this.bounce = 0.95; // Aumentado para quicar mais
        this.friction = 0.85; // Reduzido para deslizar mais
        this.onGround = false;
        this.mesh = null;
        this.initialPosition = this.position.clone();
    }

    update(dt) {
        // Air resistance reduzido
        this.velocity.scale(0.992);
    }

    reset() {
        this.position = new Vec3(0, 3, 0);
        this.velocity = new Vec3(0, 0, 0);
    }
}
