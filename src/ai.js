// AI Controller
class AI {
    constructor(car, ballRef) {
        this.car = car;
        this.ballRef = ballRef;
        this.decisionTimer = 0;
        this.decisionInterval = 0.3;
        this.targetPos = new Vec3(0, 0, 0);
        this.mode = 'chase'; // chase, defend, position
        this.difficulty = 'hard';
    }

    update(dt, ball, playerCar) {
        this.decisionTimer += dt;

        if (this.decisionTimer >= this.decisionInterval) {
            this.makeDecision(ball, playerCar);
            this.decisionTimer = 0;
        }

        this.executeMoves();
    }

    makeDecision(ball, playerCar) {
        const distToBall = this.car.position.distance(ball.position);
        const ballX = ball.position.x;
        const ballZ = ball.position.z;

        // Decide mode
        if (distToBall < 25) {
            this.mode = 'chase';
            this.targetPos = ball.position.clone();

            // Boost if close
            if (distToBall < 15 && this.car.boost > 30) {
                this.car.input.boost = true;
            } else {
                this.car.input.boost = false;
            }

            // Jump to hit ball
            if (distToBall < 8 && Math.random() < 0.25) {
                this.car.input.jump = true;
            }
        } else {
            this.mode = 'position';
            this.car.input.boost = false;

            // Position between ball and goal
            const myGoalX = this.car.team === 'red' ? 40 : -40;
            const defenseX = myGoalX * 0.7; // 70% towards goal
            const targetZ = ballZ * 0.5; // Slightly towards ball

            this.targetPos = new Vec3(defenseX, 0, Math.max(-20, Math.min(20, targetZ)));
        }

        // Defensive boost
        if (this.mode === 'position' && Math.random() < 0.1) {
            this.car.input.boost = this.car.boost > 50;
        }
    }

    executeMoves() {
        const dir = this.targetPos.clone().sub(this.car.position);
        const dist = dir.length();

        if (dist < 3) {
            this.car.input.forward = false;
            this.car.input.backward = false;
            this.car.input.left = false;
            this.car.input.right = false;
            return;
        }

        dir.normalize();

        // Convert direction to local forward/right
        const forward = new Vec3(
            Math.sin(this.car.angle),
            0,
            Math.cos(this.car.angle)
        );
        const right = new Vec3(
            Math.cos(this.car.angle),
            0,
            -Math.sin(this.car.angle)
        );

        const forwardDot = dir.dot(forward);
        const rightDot = dir.dot(right);

        // Movement
        this.car.input.forward = forwardDot > 0.3;
        this.car.input.backward = forwardDot < -0.3;
        this.car.input.right = rightDot > 0.3;
        this.car.input.left = rightDot < -0.3;
    }
}
