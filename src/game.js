// Main Game Class
class Game {
    constructor() {
        this.renderer = new GameRenderer();
        this.physics = new SimplePhysics();

        // Create players
        this.playerBlue = new Player('blue', -10, 0, false);
        this.playerRed = new Player('red', 10, 0, true);

        this.physics.addBody(this.playerBlue);
        this.physics.addBody(this.playerRed);

        // Create ball
        this.ball = new Ball();
        this.physics.addBody(this.ball);

        // AI Controller
        this.aiController = new AIController(this.playerRed, this.ball);

        // Create meshes
        this.playerBlue.mesh = this.renderer.createPlayerMesh('blue');
        this.playerRed.mesh = this.renderer.createPlayerMesh('red');
        this.ball.mesh = this.renderer.createBallMesh();

        this.renderer.scene.add(this.playerBlue.mesh);
        this.renderer.scene.add(this.playerRed.mesh);
        this.renderer.scene.add(this.ball.mesh);

        // Game state
        this.score = { blue: 0, red: 0 };
        this.gameTime = 300; // 5 minutes
        this.gameActive = true;
        this.lastFrameTime = Date.now();
        this.frameCount = 0;
        this.fpsUpdateTime = 0;

        this.setupInputHandlers();
        this.animate();
    }

    setupInputHandlers() {
        // Keyboard input for player
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w') this.playerBlue.input.forward = true;
            if (key === 'a') this.playerBlue.input.left = true;
            if (key === 's') this.playerBlue.input.backward = true;
            if (key === 'd') this.playerBlue.input.right = true;
            if (key === ' ') {
                e.preventDefault();
                this.playerBlue.input.jump = true;
            }
            if (key === 'shift') this.playerBlue.input.boost = true;
            if (key === 'r') this.ball.reset();
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w') this.playerBlue.input.forward = false;
            if (key === 'a') this.playerBlue.input.left = false;
            if (key === 's') this.playerBlue.input.backward = false;
            if (key === 'd') this.playerBlue.input.right = false;
            if (key === ' ') this.playerBlue.input.jump = false;
            if (key === 'shift') this.playerBlue.input.boost = false;
        });
    }

    checkGoals() {
        // Blue scores (ball past red goal at x > 45)
        if (this.ball.position.x > 45 && Math.abs(this.ball.position.z) < 10) {
            this.score.blue++;
            this.ball.reset();
        }

        // Red scores (ball past blue goal at x < -45)
        if (this.ball.position.x < -45 && Math.abs(this.ball.position.z) < 10) {
            this.score.red++;
            this.ball.reset();
        }
    }

    updateUI() {
        document.getElementById('blueScore').textContent = this.score.blue;
        document.getElementById('redScore').textContent = this.score.red;

        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('timer').textContent =
            `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Update FPS
        this.fpsUpdateTime += 1 / 60;
        if (this.fpsUpdateTime >= 1) {
            document.getElementById('fps').textContent = `FPS: ${this.frameCount}`;
            this.frameCount = 0;
            this.fpsUpdateTime = 0;
        }
    }

    endGame() {
        this.gameActive = false;
        const gameOverDiv = document.getElementById('gameOver');
        const winner = this.score.blue > this.score.red ? '🔵 Azul' : '🔴 Vermelho';
        document.getElementById('winner').textContent = `${winner} Venceu!`;
        document.getElementById('finalScore').textContent =
            `Placar Final: ${this.score.blue} - ${this.score.red}`;
        gameOverDiv.style.display = 'block';
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const now = Date.now();
        const dt = Math.min((now - this.lastFrameTime) / 1000, 1 / 30);
        this.lastFrameTime = now;

        if (!this.gameActive) return;

        // Update game time
        this.gameTime -= dt;
        if (this.gameTime <= 0) {
            this.endGame();
            return;
        }

        // Update players
        this.playerBlue.update(dt);
        this.playerRed.update(dt);

        // Update AI
        this.aiController.update(dt, this.ball.position);

        // Update ball
        this.ball.update(dt);

        // Physics simulation
        this.physics.step(dt);

        // Check for goals
        this.checkGoals();

        // Update meshes
        this.renderer.updatePlayerMesh(this.playerBlue.mesh, this.playerBlue);
        this.renderer.updatePlayerMesh(this.playerRed.mesh, this.playerRed);
        this.renderer.updateBallMesh(this.ball.mesh, this.ball);

        // Update camera
        this.renderer.updateCamera(this.playerBlue.position);

        // Update UI
        this.updateUI();

        // Render
        this.renderer.render();
        this.frameCount++;
    }
}

// Start game
window.addEventListener('load', () => {
    new Game();
});
