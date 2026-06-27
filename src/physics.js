// Simple Physics Engine (Custom)
class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    scale(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    }

    distance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

class SimplePhysics {
    constructor() {
        this.gravity = new Vec3(0, -25, 0);
        this.bodies = [];
        this.groundLevel = 0;
        this.friction = 0.95;
        this.airFriction = 0.98;
    }

    addBody(body) {
        this.bodies.push(body);
    }

    step(dt = 1 / 60) {
        // Update all bodies
        this.bodies.forEach(body => {
            if (body.mass === 0) return; // Static body

            // Apply gravity
            if (body.mass > 0) {
                body.velocity.y += this.gravity.y * dt;
            }

            // Update position
            body.position.x += body.velocity.x * dt;
            body.position.y += body.velocity.y * dt;
            body.position.z += body.velocity.z * dt;

            // Ground collision
            if (body.position.y < this.groundLevel) {
                body.position.y = this.groundLevel;
                body.velocity.y *= -0.5; // Bounce
                body.velocity.x *= this.friction;
                body.velocity.z *= this.friction;
            } else {
                // Air friction
                body.velocity.x *= this.airFriction;
                body.velocity.z *= this.airFriction;
            }
        });

        // Collision detection
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                this.checkCollision(this.bodies[i], this.bodies[j]);
            }
        }
    }

    checkCollision(a, b) {
        const dist = a.position.distance(b.position);
        const minDist = a.radius + b.radius;

        if (dist < minDist) {
            // Simple collision response
            const normal = b.position.clone().sub(a.position).normalize();
            
            const overlap = minDist - dist;
            const aVel = a.velocity.clone();
            const bVel = b.velocity.clone();

            // Separate bodies
            a.position.sub(normal.clone().scale(overlap / 2));
            b.position.add(normal.clone().scale(overlap / 2));

            // Exchange velocities
            if (a.mass > 0 && b.mass > 0) {
                a.velocity = bVel.scale(0.8);
                b.velocity = aVel.scale(0.8);
            } else if (a.mass > 0) {
                a.velocity = normal.clone().scale(aVel.length() * 0.8);
            } else if (b.mass > 0) {
                b.velocity = normal.clone().scale(bVel.length() * 0.8);
            }
        }
    }
}
