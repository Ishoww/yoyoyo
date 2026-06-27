// Player Entity
class Player {
    constructor(team, x, z, isAI = false) {
        this.team = team; // 'blue' or 'red'
        this.isAI = isAI;
        this.position = new Vec3(x, 1, z);
        this.velocity = new Vec3(0, 0, 0);
        this.radius = 1;
        this.mass = 2;
        this.mesh = null;

        // Controls
        this.input = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            boost: false
        };

        // Stats
        this.boost = 100;
        this.maxBoost = 100;
        this.boostRechargeRate = 40;
        this.onGround = false;
        this.jumpCooldown = 0;
        this.speed = 25;
        this.boostSpeed = 50;
        this.angle = 0; // Rotation angle
    }

    update(dt) {
        // Decrease jump cooldown
        this.jumpCooldown = Math.max(0, this.jumpCooldown - dt);

        // Check if on ground (simplified)
        this.onGround = this.position.y <= 1.1;

        // Recharge boost
        if (!this.input.boost) {
            this.boost = Math.min(this.maxBoost, this.boost + this.boostRechargeRate * dt);
        }

        // Handle jump
        if (this.input.jump && this.onGround && this.jumpCooldown <= 0) {
            this.velocity.y = 20;
            this.jumpCooldown = 0.3;
        }

        // Movement
        const moveX = (this.input.right ? 1 : 0) - (this.input.left ? 1 : 0);
        const moveZ = (this.input.forward ? 1 : 0) - (this.input.backward ? 1 : 0);

        if (moveX !== 0 || moveZ !== 0) {
            const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
            const normalizedX = moveX / len;
            const normalizedZ = moveZ / len;

            const currentSpeed = this.input.boost && this.boost > 0 ? this.boostSpeed : this.speed;

            this.velocity.x = normalizedX * currentSpeed;
            this.velocity.z = normalizedZ * currentSpeed;
            this.angle = Math.atan2(moveX, moveZ);

            if (this.input.boost && this.boost > 0) {
                this.boost -= 50 * dt;
            }
        } else {
            this.velocity.x *= 0.9;
            this.velocity.z *= 0.9;
        }
    }
}

// Ball Entity
class Ball {
    constructor() {
        this.position = new Vec3(0, 2, 0);
        this.velocity = new Vec3(0, 0, 0);
        this.radius = 0.6;
        this.mass = 1;
        this.mesh = null;
        this.initialPosition = this.position.clone();
    }

    update(dt) {
        // Apply damping
        this.velocity.scale(0.98);

        // Remove gravity for ball (simplified)
        if (this.position.y <= 0.6) {
            this.position.y = 0.6;
            this.velocity.y *= -0.6;
        }
    }

    reset() {
        this.position = new Vec3(0, 2, 0);
        this.velocity = new Vec3(0, 0, 0);
    }
}
