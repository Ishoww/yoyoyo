// Main Game Class
class Game {
    constructor() {
        this.renderer = new Renderer();
        this.physics = new Physics();

        // Create cars
        this.playerCar = new Car('blue', -35, 0, false);
        this.aiCar = new Car('red', 35, 0, true);

        this.physics.addBody(this.playerCar);
        this.physics.addBody(this.aiCar);

        // Create ball
        this.ball = new Ball();
        this.physics.addBody(this.ball);

        // AI Controller
        this.ai = new AI(this.aiCar, this.ball);

        // Create meshes
        this.playerCar.mesh = this.renderer.createCarMesh('blue');
        this.aiCar.mesh = this.renderer.createCarMesh('red');
        this.ball.mesh = this.renderer.createBallMesh();

        this.renderer.scene.add(this.playerCar.mesh);
        this.renderer.scene.add(this.aiCar.mesh);
        this.renderer.scene.add(this.ball.mesh);

        // Game state
        this.score = { blue: 0, red: 0 };
        this.gameTime = 300; // 5 minutes
        this.gameActive = true;
        this.lastTime = Date.now();
        this.frameCount = 0;
        this.fpsTime = 0;

        this.setupControls();
        this.gameLoop();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w') this.playerCar.input.forward = true;
            if (key === 's') this.playerCar.input.backward = true;
            if (key === 'a') this.playerCar.input.left = true;
            if (key === 'd') this.playerCar.input.right = true;
            if (key === ' ') {
                e.preventDefault();
                this.playerCar.input.jump = true;
            }
            if (key === 'shift') this.playerCar.input.boost = true;
            if (key === 'r') this.resetGame();
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w') this.playerCar.input.forward = false;
            if (key === 's') this.playerCar.input.backward = false;
            if (key === 'a') this.playerCar.input.left = false;
            if (key === 'd') this.playerCar.input.right = false;
            if (key === ' ') this.playerCar.input.jump = false;
            if (key === 'shift') this.playerCar.input.boost = false;
        });
    }

    checkGoals() {
        const ballX = this.ball.position.x;
        const ballZ = this.ball.position.z;
        const ballY = this.ball.position.y;

        // Blue goal (x > 42)
        if (ballX > 42 && Math.abs(ballZ) < 12.5 && ballY < 5) {
            this.score.blue++;
            this.ball.reset();
            this.playerCar.reset();
            this.aiCar.reset();
        }

        // Red goal (x < -42)
        if (ballX < -42 && Math.abs(ballZ) < 12.5 && ballY < 5) {
            this.score.red++;
            this.ball.reset();
            this.playerCar.reset();
            this.aiCar.reset();
        }
    }

    resetGame() {
        this.ball.reset();
        this.playerCar.reset();
        this.aiCar.reset();
    }

    updateUI() {
        document.getElementById('blueScore').textContent = this.score.blue;
        document.getElementById('redScore').textContent = this.score.red;

        const min = Math.floor(this.gameTime / 60);
        const sec = Math.floor(this.gameTime % 60);
        document.getElementById('timer').textContent = `${min}:${sec.toString().padStart(2, '0')}`;

        // Boost bar
        const boostPercent = (this.playerCar.boost / this.playerCar.maxBoost) * 100;
        document.getElementById('boostFill').style.width = boostPercent + '%';

        // FPS
        this.fpsTime += 1 / 60;
        if (this.fpsTime >= 1) {
            document.getElementById('fps').textContent = `FPS: ${this.frameCount}`;
            this.frameCount = 0;
            this.fpsTime = 0;
        }
    }

    endGame() {
        this.gameActive = false;
        const winner = this.score.blue > this.score.red ? '🔵 VOCÊ VENCEU!' : '🔴 IA VENCEU!';
        document.getElementById('winner').textContent = winner;
        document.getElementById('finalScore').textContent =
            `PLACAR FINAL: ${this.score.blue} - ${this.score.red}`;
        document.getElementById('gameOver').style.display = 'block';
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        const now = Date.now();
        const dt = Math.min((now - this.lastTime) / 1000, 0.02);
        this.lastTime = now;

        if (!this.gameActive) return;

        // Update game time
        this.gameTime -= dt;
        if (this.gameTime <= 0) {
            this.endGame();
            return;
        }

        // Update cars
        this.playerCar.update(dt);
        this.aiCar.update(dt);

        // Update AI
        this.ai.update(dt, this.ball, this.playerCar);

        // Update ball
        this.ball.update(dt);

        // Physics
        this.physics.step(dt);

        // Check goals
        this.checkGoals();

        // Update meshes
        this.renderer.updateCarMesh(this.playerCar.mesh, this.playerCar);
        this.renderer.updateCarMesh(this.aiCar.mesh, this.aiCar);
        this.renderer.updateBallMesh(this.ball.mesh, this.ball);

        // Update camera
        this.renderer.updateCamera(this.playerCar);

        // Update UI
        this.updateUI();

        // Render
        this.renderer.render();
        this.frameCount++;
    }
}

// Start
window.addEventListener('load', () => {
    new Game();
});
