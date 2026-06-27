class Ball {
    constructor(scene, physicsWorld, position) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;

        // Physics
        const ballShape = new CANNON.Sphere(0.6);
        this.body = new CANNON.Body({
            mass: 1,
            material: physicsWorld.ballMaterial,
            linearDamping: 0.1,
            angularDamping: 0.1
        });
        this.body.addShape(ballShape);
        this.body.position.set(position.x, position.y, position.z);
        physicsWorld.world.addBody(this.body);

        // Graphics
        const geometry = new THREE.SphereGeometry(0.6, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x444444
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);

        this.initialPosition = position;
        this.lastScorerTeam = null;
    }

    update() {
        syncPhysicsToThree(this.body, this.mesh);

        // Apply air drag
        this.body.velocity.scale(0.99, this.body.velocity);

        // Check if ball is out of bounds (fell below arena)
        if (this.mesh.position.y < -10) {
            this.reset();
        }
    }

    reset() {
        this.body.position.set(this.initialPosition.x, this.initialPosition.y, this.initialPosition.z);
        this.body.velocity.set(0, 0, 0);
        this.body.angularVelocity.set(0, 0, 0);
    }

    applyForce(force) {
        this.body.applyForce(force, this.body.position);
    }
}
