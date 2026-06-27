class GameRenderer {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.Fog(0x0a0e27, 200, 500);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 15, -30);
        this.camera.lookAt(0, 5, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.setupLights();
        this.createArena();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 60, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for goals
        const blueGoalLight = new THREE.PointLight(0x00bfff, 1, 80);
        blueGoalLight.position.set(-45, 10, 0);
        this.scene.add(blueGoalLight);

        const redGoalLight = new THREE.PointLight(0xff4444, 1, 80);
        redGoalLight.position.set(45, 10, 0);
        this.scene.add(redGoalLight);
    }

    createArena() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a3a3a,
            metalness: 0.1,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Side walls
        this.createWall(-50, 0, 100, 20, 0x111111); // left
        this.createWall(50, 0, 100, 20, 0x111111);  // right
        this.createWall(0, -25, 100, 20, 0x222222); // back
        this.createWall(0, 25, 100, 20, 0x222222);  // front

        // Goal areas
        this.createGoalArea(-45, 0x00bfff);
        this.createGoalArea(45, 0xff4444);

        // Center line
        this.createCenterLine();

        // Skybox
        this.createSkybox();
    }

    createWall(x, z, height, depth, color) {
        const geometry = new THREE.BoxGeometry(5, height, depth);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const wall = new THREE.Mesh(geometry, material);
        wall.position.set(x, height / 2, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.scene.add(wall);
    }

    createGoalArea(x, color) {
        const geometry = new THREE.BoxGeometry(10, 0.1, 20);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.3
        });
        const goal = new THREE.Mesh(geometry, material);
        goal.position.set(x, 0.05, 0);
        goal.receiveShadow = true;
        this.scene.add(goal);
    }

    createCenterLine() {
        const geometry = new THREE.BoxGeometry(0.2, 0.1, 50);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        const line = new THREE.Mesh(geometry, material);
        line.position.y = 0.1;
        this.scene.add(line);
    }

    createSkybox() {
        const geometry = new THREE.BoxGeometry(400, 300, 400);
        const material = new THREE.MeshStandardMaterial({
            color: 0x050810,
            side: THREE.BackSide,
            metalness: 0,
            roughness: 1
        });
        const skybox = new THREE.Mesh(geometry, material);
        this.scene.add(skybox);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateCamera(playerPos) {
        const desiredPos = playerPos.clone().add(new THREE.Vector3(0, 8, -15));
        this.camera.position.lerp(desiredPos, 0.1);
        this.camera.lookAt(playerPos.x, playerPos.y + 2, playerPos.z);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
