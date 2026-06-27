// Physics Engine Simples mas Efetivo
class Physics {
    constructor() {
        this.gravity = -25;
        this.bodies = [];
        this.groundLevel = 0;
        this.damping = 0.98;
        this.angularDamping = 0.95;
    }

    addBody(body) {
        this.bodies.push(body);
        return body;
    }

    step(dt) {
        // Update positions
        for (let body of this.bodies) {
            if (body.mass <= 0) continue;

            // Apply gravity
            body.velocity.y += this.gravity * dt;

            // Update position
            body.position.x += body.velocity.x * dt;
            body.position.y += body.velocity.y * dt;
            body.position.z += body.velocity.z * dt;

            // Ground collision
            if (body.position.y <= body.radius) {
                body.position.y = body.radius;
                body.velocity.y *= -body.bounce;
                body.velocity.x *= body.friction;
                body.velocity.z *= body.friction;
                body.onGround = true;
            } else {
                body.onGround = false;
                // Air damping
                body.velocity.x *= this.damping;
                body.velocity.z *= this.damping;
            }

            // Bounds check (out of map)
            if (body.position.y < -50) {
                if (body.reset) body.reset();
            }
        }

        // Collision detection
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                this.collide(this.bodies[i], this.bodies[j]);
            }
        }
    }

    collide(a, b) {
        const dist = a.position.distance(b.position);
        const minDist = a.radius + b.radius;

        if (dist < minDist && dist > 0.001) {
            const overlap = minDist - dist;
            const normal = b.position.clone().sub(a.position).normalize();

            // Separate
            if (a.mass > 0 && b.mass > 0) {
                a.position.sub(normal.clone().scale(overlap / 2));
                b.position.add(normal.clone().scale(overlap / 2));
            } else if (a.mass > 0) {
                a.position.sub(normal.clone().scale(overlap));
            } else if (b.mass > 0) {
                b.position.add(normal.clone().scale(overlap));
            }

            // Impulse
            const relVel = b.velocity.clone().sub(a.velocity);
            const velAlongNormal = relVel.dot(normal);

            if (velAlongNormal < 0) {
                const restitution = 0.8;
                let impulse = -(1 + restitution) * velAlongNormal;

                if (a.mass > 0 && b.mass > 0) {
                    impulse /= (a.mass + b.mass);
                    a.velocity.sub(normal.clone().scale(impulse * a.mass));
                    b.velocity.add(normal.clone().scale(impulse * b.mass));
                } else if (a.mass > 0) {
                    a.velocity.sub(normal.clone().scale(impulse));
                } else if (b.mass > 0) {
                    b.velocity.add(normal.clone().scale(impulse));
                }
            }
        }
    }
}
