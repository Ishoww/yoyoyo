// Car Class
class Car {
    constructor(team, x, z, isAI = false) {
        this.team = team; // 'blue' or 'red'
        this.isAI = isAI;

        // Physics
        this.position = new Vec3(x, 1, z);
        this.velocity = new Vec3(0, 0, 0);
        this.radius = 1.2;
        this.mass = 1.5;
        this.bounce = 0.3;
        this.friction = 0.85;
        this.onGround = false;

        // Rotation
        this.angle = 0; // Yaw (steering)
        this.angularVel = 0;

        // Movement
        this.maxSpeed = 35;
        this.boostSpeed = 70;
        this.acceleration = 60;
        this.steering = 0.15;

        // Boost
        this.boost = 100;
        this.maxBoost = 100;
        this.boostRechargeRate = 50;
        this.isBoosting = false;

        // Jump
        this.jumpForce = 18;
        this.jumpCooldown = 0;
        this.canJump = true;

        // Input
        this.input = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            boost: false
        };

        // Mesh
        this.mesh = null;
    }

    update(dt) {
        // Update jump cooldown
        this.jumpCooldown = Math.max(0, this.jumpCooldown - dt);
        this.canJump = this.onGround && this.jumpCooldown <= 0;

        // Handle jump
        if (this.input.jump && this.canJump) {
            this.velocity.y = this.jumpForce;
            this.jumpCooldown = 0.5;
            this.onGround = false;
        }

        // Handle steering
        const steerInput = (this.input.right ? 1 : 0) - (this.input.left ? 1 : 0);
        this.angularVel = steerInput * this.steering;
        this.angle += this.angularVel;

        // Get forward and right vectors
        const forward = new Vec3(
            Math.sin(this.angle),
            0,
            Math.cos(this.angle)
        );
        const right = new Vec3(
            Math.cos(this.angle),
            0,
            -Math.sin(this.angle)
        );

        // Handle acceleration
        const accelerationInput = (this.input.forward ? 1 : 0) - (this.input.backward ? 1 : 0);
        
        const currentMaxSpeed = this.input.boost && this.boost > 0 ? this.boostSpeed : this.maxSpeed;
        
        if (accelerationInput !== 0) {
            const accel = forward.clone().scale(accelerationInput * this.acceleration);
            this.velocity.x += accel.x * dt;
            this.velocity.z += accel.z * dt;

            // Limit speed
            const speedXZ = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
            if (speedXZ > currentMaxSpeed) {
                const scale = currentMaxSpeed / speedXZ;
                this.velocity.x *= scale;
                this.velocity.z *= scale;
            }

            // Boost consumption
            if (this.input.boost && this.boost > 0) {
                this.boost -= 60 * dt;
                this.isBoosting = true;
            } else {
                this.isBoosting = false;
            }
        } else {
            this.isBoosting = false;
            // Decelerate
            this.velocity.x *= 0.92;
            this.velocity.z *= 0.92;
        }

        // Boost recharge
        if (!this.input.boost || this.boost <= 0) {
            this.boost = Math.min(this.maxBoost, this.boost + this.boostRechargeRate * dt);
        }
    }

    reset() {
        if (this.team === 'blue') {
            this.position = new Vec3(-35, 1, 0);
        } else {
            this.position = new Vec3(35, 1, 0);
        }
        this.velocity = new Vec3(0, 0, 0);
        this.angle = this.team === 'blue' ? 0 : Math.PI;
        this.boost = 100;
    }
}
