class GameManager {
    constructor() {
        this.renderer = new GameRenderer();
        this.physics = new PhysicsWorld();
        
        // Add ground and walls to physics world
        this.physics.addGround();
        this.physics.addWall(-50, 0, 100, 20);  // left
        this.physics.addWall(50, 0, 100, 20);   // right
        this.physics.addWall(0, -25, 100, 20);  // back
        this.physics.addWall(0, 25, 100, 20);   // front

        // Create players
        this.players = {
            blue: [],
            red: []
        };

        // Blue team
        this.players.blue.push(new Player(this.renderer.scene, this.physics, 'blue', { x: -10, y: 2, z: 0 }, 0));
        this.players.blue.push(new AIPlayer(this.renderer.scene, this.physics, 'blue', { x: -25, y: 2, z: -10 }, 1));
        this.players.blue.push(new AIPlayer(this.renderer.scene, this.physics, 'blue', { x: -25, y: 2, z: 10 }, 2));

        // Red team
        this.players.red.push(new AIPlayer(this.renderer.scene, this.physics, 'red', { x: 10, y: 2, z: 0 }, 0));
        this.players.red.push(new AIPlayer(this.renderer.scene, this.physics, 'red', { x: 25, y: 2, z: -10 }, 1));
        this.players.red.push(new AIPlayer(this.renderer.scene, this.physics, 'red', { x: 25, y: 2, z: 10 }, 2));

        // Ball
        this.ball = new Ball(this.renderer.scene, this.physics, { x: 0, y: 2, z: 0 });

        // Score
        this.score = { blue: 0, red: 0 };
        this.gameTime = 300; // 5 minutes
        this.gameActive = true;

        // Input
        this.setupInputHandlers();

        // Start game loop
        this.clock = new THREE.Clock();
        this.animate();
    }

    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r') {
                this.ball.reset();
            }
        });
    }

    checkGoal() {
        // Blue goal (x > 45)
        if (this.ball.mesh.position.x > 45 && 
            Math.abs(this.ball.mesh.position.z) < 10 &&
            this.ball.mesh.position.y < 5) {
            this.score.blue++;
            this.ball.reset();
            console.log('Blue scores! ', this.score);
        }

        // Red goal (x < -45)
        if (this.ball.mesh.position.x < -45 && 
            Math.abs(this.ball.mesh.position.z) < 10 &&
            this.ball.mesh.position.y < 5) {
            this.score.red++;
            this.ball.reset();
            console.log('Red scores! ', this.score);
        }
    }

    updateUI() {
        document.getElementById('blueScore').textContent = this.score.blue;
        document.getElementById('redScore').textContent = this.score.red;

        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    endGame() {
        this.gameActive = false;
        const gameOverDiv = document.getElementById('gameOver');
        const winner = this.score.blue > this.score.red ? 'Blue' : 'Red';
        document.getElementById('winner').textContent = `${winner} Team Wins!`;
        document.getElementById('finalScore').textContent = 
            `Final Score: ${this.score.blue} - ${this.score.red}`;
        gameOverDiv.style.display = 'block';
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        
        if (!this.gameActive) return;

        // Update game time
        this.gameTime -= deltaTime;
        if (this.gameTime <= 0) {
            this.endGame();
            return;
        }

        // Update physics
        this.physics.step(deltaTime);

        // Update player (human)
        const player = this.players.blue[0];
        player.update(deltaTime, this.ball.mesh.position);

        // Update AI players
        const allPlayers = [...this.players.blue, ...this.players.red];
        for (let team in this.players) {
            for (let i = 1; i < this.players[team].length; i++) {
                const aiPlayer = this.players[team][i];
                aiPlayer.update(deltaTime, this.ball.mesh.position, allPlayers);
            }
        }

        // Update red team AI (goalkeeper)
        this.players.red[0].update(deltaTime, this.ball.mesh.position, allPlayers);

        // Update ball
        this.ball.update();

        // Check for goals
        this.checkGoal();

        // Update UI
        this.updateUI();

        // Update camera
        this.renderer.updateCamera(player.mesh.position);

        // Render
        this.renderer.render();
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new GameManager();
});
