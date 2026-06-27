// AI Logic
class AIController {
    constructor(player, ballRef) {
        this.player = player;
        this.ballRef = ballRef;
        this.decisionTimer = 0;
        this.decisionInterval = 0.2;
        this.targetPos = new Vec3(0, 0, 0);
        this.isGoalkeeper = player.isAI && player.team === 'red';
    }

    update(dt, ballPos) {
        this.decisionTimer += dt;

        if (this.decisionTimer >= this.decisionInterval) {
            this.makeDecision(ballPos);
            this.decisionTimer = 0;
        }

        this.moveToTarget();
    }

    makeDecision(ballPos) {
        const distToBall = this.player.position.distance(ballPos);

        if (this.isGoalkeeper) {
            // Goalkeeper logic
            const goalX = 40; // Red goal
            this.targetPos = new Vec3(goalX, 0, Math.max(-15, Math.min(15, ballPos.z)));

            if (distToBall < 20) {
                this.targetPos = ballPos.clone();
                if (distToBall < 5) {
                    this.player.input.boost = true;
                }
            }
        } else {
            // Outfield AI
            if (distToBall < 30) {
                this.targetPos = ballPos.clone();
                if (distToBall < 10 && Math.random() < 0.3) {
                    this.player.input.boost = true;
                }
                if (distToBall < 8 && Math.random() < 0.2) {
                    this.player.input.jump = true;
                }
            } else {
                // Position towards opponent goal
                const opponentGoalX = -40;
                this.targetPos = new Vec3(opponentGoalX, 0, Math.sin(Date.now() / 1000) * 10);
            }
        }
    }

    moveToTarget() {
        const direction = this.targetPos.clone().sub(this.player.position);
        const distance = direction.length();

        if (distance < 2) {
            this.player.input.forward = false;
            this.player.input.backward = false;
            this.player.input.left = false;
            this.player.input.right = false;
            return;
        }

        // Simple movement towards target
        if (Math.abs(direction.x) > Math.abs(direction.z)) {
            this.player.input.left = direction.x < 0;
            this.player.input.right = direction.x > 0;
            this.player.input.forward = false;
            this.player.input.backward = false;
        } else {
            this.player.input.forward = direction.z > 0;
            this.player.input.backward = direction.z < 0;
            this.player.input.left = false;
            this.player.input.right = false;
        }
    }
}
