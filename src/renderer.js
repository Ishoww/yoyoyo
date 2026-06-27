// Renderer com Camera Type Rocket League
class Renderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a1929);
        this.scene.fog = new THREE.Fog(0x0a1929, 200, 500);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            powerPreference: 'low-power'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = false;
        document.getElementById('gameContainer').appendChild(this.renderer.domElement);

        this.setupLights();
        this.createArena();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLights() {
        // Sun
        const sun = new THREE.DirectionalLight(0xffffff, 0.7);
        sun.position.set(80, 80, 80);
        this.scene.add(sun);

        // Ambient
        const ambient = new THREE.AmbientLight(0x8899bb, 0.6);
        this.scene.add(ambient);

        // Goal lights
        const blueLight = new THREE.PointLight(0x00bfff, 1, 100);
        blueLight.position.set(-40, 10, 0);
        this.scene.add(blueLight);

        const redLight = new THREE.PointLight(0xff4444, 1, 100);
        redLight.position.set(40, 10, 0);
        this.scene.add(redLight);
    }

    createArena() {
        // Ground
        const groundGeo = new THREE.PlaneGeometry(100, 60);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0x1a4d4d });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        this.scene.add(ground);

        // Walls
        this.createWall(-51, 0, 60, 30, 0x1a1a2e);
        this.createWall(51, 0, 60, 30, 0x1a1a2e);
        this.createWall(0, -31, 100, 30, 0x0f2027);
        this.createWall(0, 31, 100, 30, 0x0f2027);

        // Center line
        this.createLine(0, 0, 0.2, 60, 0xffffff);

        // Goal areas
        const goalGeo = new THREE.PlaneGeometry(15, 25);
        const blueMat = new THREE.MeshLambertMaterial({ color: 0x00bfff, transparent: true, opacity: 0.15 });
        const bluGoal = new THREE.Mesh(goalGeo, blueMat);
        bluGoal.rotation.x = -Math.PI / 2;
        bluGoal.position.set(-42.5, 0, 0);
        this.scene.add(bluGoal);

        const redMat = new THREE.MeshLambertMaterial({ color: 0xff4444, transparent: true, opacity: 0.15 });
        const redGoal = new THREE.Mesh(goalGeo, redMat);
        redGoal.rotation.x = -Math.PI / 2;
        redGoal.position.set(42.5, 0, 0);
        this.scene.add(redGoal);
    }

    createWall(x, z, width, height, color) {
        const geo = new THREE.BoxGeometry(8, height, width);
        const mat = new THREE.MeshLambertMaterial({ color });
        const wall = new THREE.Mesh(geo, mat);
        wall.position.set(x, height / 2, z);
        this.scene.add(wall);
    }

    createLine(x, z, width, length, color) {
        const geo = new THREE.PlaneGeometry(width, length);
        const mat = new THREE.MeshLambertMaterial({ color });
        const line = new THREE.Mesh(geo, mat);
        line.rotation.x = -Math.PI / 2;
        line.position.set(x, 0.01, z);
        this.scene.add(line);
    }

    createCarMesh(team) {
        const group = new THREE.Group();

        // Body
        const bodyGeo = new THREE.BoxGeometry(1.8, 1, 3.5);
        const bodyMat = new THREE.MeshLambertMaterial({
            color: team === 'blue' ? 0x00bfff : 0xff4444
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.5;
        group.add(body);

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
        const wheelMat = new THREE.MeshLambertMaterial({ color: 0x333333 });

        for (let i = 0; i < 4; i++) {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.y = 0.2;
            wheel.position.x = (i % 2 === 0 ? -0.8 : 0.8);
            wheel.position.z = (i < 2 ? -1 : 1);
            group.add(wheel);
        }

        return group;
    }

    createBallMesh() {
        const geo = new THREE.SphereGeometry(0.7, 32, 32);
        const mat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            emissive: 0x444444
        });
        return new THREE.Mesh(geo, mat);
    }

    updateCarMesh(mesh, car) {
        mesh.position.set(car.position.x, car.position.y, car.position.z);
        mesh.rotation.y = car.angle;
    }

    updateBallMesh(mesh, ball) {
        mesh.position.set(ball.position.x, ball.position.y, ball.position.z);
    }

    updateCamera(car) {
        // Camera behind car (Rocket League style)
        const distance = 8;
        const height = 4.5;
        const lookAhead = 2;

        const cameraX = car.position.x - Math.sin(car.angle) * distance;
        const cameraZ = car.position.z - Math.cos(car.angle) * distance;
        const cameraY = car.position.y + height;

        const targetX = car.position.x + Math.sin(car.angle) * lookAhead;
        const targetZ = car.position.z + Math.cos(car.angle) * lookAhead;
        const targetY = car.position.y + 1.5;

        this.camera.position.x += (cameraX - this.camera.position.x) * 0.15;
        this.camera.position.y += (cameraY - this.camera.position.y) * 0.15;
        this.camera.position.z += (cameraZ - this.camera.position.z) * 0.15;

        this.camera.lookAt(targetX, targetY, targetZ);
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
