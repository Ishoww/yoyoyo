// Three.js Renderer
class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = false; // Disable for performance
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);

        this.setupLights();
        this.createArena();
        this.meshes = {};

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLights() {
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(50, 50, 50);
        this.scene.add(light);

        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);
    }

    createArena() {
        // Ground
        const groundGeo = new THREE.PlaneGeometry(100, 50);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x1a3a3a });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        this.scene.add(ground);

        // Walls
        this.createWall(-50, 0, 100, 20, 0x222222);
        this.createWall(50, 0, 100, 20, 0x222222);
        this.createWall(0, -25, 100, 20, 0x333333);
        this.createWall(0, 25, 100, 20, 0x333333);

        // Goal lines
        this.createGoalLine(-45, 0x00bfff);
        this.createGoalLine(45, 0xff4444);
    }

    createWall(x, z, height, depth, color) {
        const geo = new THREE.BoxGeometry(5, height, depth);
        const mat = new THREE.MeshLambertMaterial({ color: color });
        const wall = new THREE.Mesh(geo, mat);
        wall.position.set(x, height / 2, z);
        this.scene.add(wall);
    }

    createGoalLine(x, color) {
        const geo = new THREE.BoxGeometry(10, 0.1, 20);
        const mat = new THREE.MeshLambertMaterial({ color: color });
        const goal = new THREE.Mesh(geo, mat);
        goal.position.set(x, 0.05, 0);
        this.scene.add(goal);
    }

    createPlayerMesh(team) {
        const geo = new THREE.BoxGeometry(2, 1, 4);
        const mat = new THREE.MeshLambertMaterial({
            color: team === 'blue' ? 0x00bfff : 0xff4444
        });
        return new THREE.Mesh(geo, mat);
    }

    createBallMesh() {
        const geo = new THREE.SphereGeometry(0.6, 16, 16);
        const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        return new THREE.Mesh(geo, mat);
    }

    updatePlayerMesh(mesh, player) {
        mesh.position.set(player.position.x, player.position.y, player.position.z);
        mesh.rotation.z = player.angle;
    }

    updateBallMesh(mesh, ball) {
        mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
    }

    updateCamera(playerPos) {
        const desiredPos = new THREE.Vector3(
            playerPos.x,
            playerPos.y + 8,
            playerPos.z - 15
        );
        this.camera.position.lerp(desiredPos, 0.1);
        this.camera.lookAt(playerPos.x, playerPos.y + 2, playerPos.z);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
