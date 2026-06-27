class AIPlayer extends Player {
    constructor(scene, physicsWorld, team, position, playerIndex) {
        super(scene, physicsWorld, team, position, playerIndex);
        this.isAI = true;
        this.isPlayer = false;
        
        // AI decision making
        this.decisionTimer = 0;
        this.decisionInterval = 0.2;
        this.targetPosition = new THREE.Vector3();
        this.role = ['goalkeeper', 'midfielder', 'forward'][playerIndex];
        this.difficulty = 'hard'; // easy, medium, hard
    }

    think(ballPos, allPlayers) {
        // Different behaviors based on role
        const distToBall = this.mesh.position.distanceTo(ballPos);

        switch (this.role) {
            case 'goalkeeper':
                this.thinkGoalkeeper(ballPos, distToBall);
                break;
            case 'midfielder':
                this.thinkMidfielder(ballPos, distToBall);
                break;
            case 'forward':
                this.thinkForward(ballPos, distToBall);
                break;
        }
    }

    thinkGoalkeeper(ballPos, distToBall) {
        // Stay near goal, intercept ball
        const goalX = this.team === 'blue' ? -40 : 40;
        const positionInGoal = new THREE.Vector3(goalX, 2, ballPos.z);
        positionInGoal.clamp(new THREE.Vector3(goalX - 5, 0.5, -20), new THREE.Vector3(goalX + 5, 3, 20));

        if (distToBall < 15) {
            this.moveTowards(ballPos);
            if (distToBall < 5) this.input.boost = true;
        } else {
            this.moveTowards(positionInGoal);
        }
    }

    thinkMidfielder(ballPos, distToBall) {
        // Positioned between defense and attack
        if (distToBall < 25) {
            this.moveTowards(ballPos);
            if (distToBall < 8) {
                this.input.boost = true;
                if (Math.random() < 0.3) this.input.jump = true;
            }
        } else {
            // Return to midfield position
            const midZ = Math.random() * 20 - 10;
            const midX = this.team === 'blue' ? -10 : 10;
            this.moveTowards(new THREE.Vector3(midX, 2, midZ));
        }
    }

    thinkForward(ballPos, distToBall) {
        // Aggressive, try to score
        if (distToBall < 30) {
            this.moveTowards(ballPos);
            if (distToBall < 6) {
                this.input.boost = true;
                this.input.jump = Math.random() < 0.2;
            }
        } else {
            // Push towards opponent goal
            const opponentGoalX = this.team === 'blue' ? 40 : -40;
            this.moveTowards(new THREE.Vector3(opponentGoalX, 2, ballPos.z + (Math.random() - 0.5) * 10));
        }
    }

    moveTowards(target) {
        const direction = target.clone().sub(this.mesh.position);
        const distance = direction.length();

        if (distance < 2) {
            this.input.forward = false;
            this.input.backward = false;
            this.input.left = false;
            this.input.right = false;
            return;
        }

        direction.normalize();

        // Simple pathfinding
        if (Math.abs(direction.x) > Math.abs(direction.z)) {
            if (direction.x > 0) this.input.right = true;
            else this.input.left = true;
        } else {
            if (direction.z > 0) this.input.forward = true;
            else this.input.backward = true;
        }
    }

    update(deltaTime, ballPosition, allPlayers) {
        this.decisionTimer += deltaTime;
        if (this.decisionTimer >= this.decisionInterval) {
            this.think(ballPosition, allPlayers);
            this.decisionTimer = 0;
        }

        super.update(deltaTime, ballPosition);
    }
}
