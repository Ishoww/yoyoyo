class Player {
    constructor(scene, physicsWorld, team, position, playerIndex) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.team = team; // 'blue' or 'red'
        this.playerIndex = playerIndex; // 0, 1, 2 per team
        this.isAI = false;
        this.isPlayer = playerIndex === 0;

        // Physics
        const carShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
        this.body = new CANNON.Body({
            mass: 2,
            material: physicsWorld.carMaterial
        });
        this.body.addShape(carShape);
        this.body.position.set(position.x, position.y, position.z);
        physicsWorld.world.addBody(this.body);

        // Graphics
        const geometry = new THREE.BoxGeometry(2, 1, 4);
        const material = new THREE.MeshStandardMaterial({
            color: team === 'blue' ? 0x00bfff : 0xff4444,
            metalness: 0.5,
            roughness: 0.5
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);

        // Input
        this.input = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            boost: false
        };

        // State
        this.boost = 100;
        this.maxBoost = 100;
        this.boostRechargeRate = 2;
        this.onGround = false;
        this.jumpCooldown = 0;
        this.speed = 25;
        this.boostSpeed = 40;

        this.setupInputListeners();
    }

    setupInputListeners() {
        if (!this.isPlayer) return;

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w') this.input.forward = true;
            if (key === 'a') this.input.left = true;
            if (key === 's') this.input.backward = true;
            if (key === 'd') this.input.right = true;
            if (key === ' ') {
                e.preventDefault();
                this.input.jump = true;
            }
            if (key === 'shift') this.input.boost = true;
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w') this.input.forward = false;
            if (key === 'a') this.input.left = false;
            if (key === 's') this.input.backward = false;
            if (key === 'd') this.input.right = false;
            if (key === ' ') this.input.jump = false;
            if (key === 'shift') this.input.boost = false;
        });
    }

    update(deltaTime, ballPosition) {
        // Update graphics
        syncPhysicsToThree(this.body, this.mesh);

        // Boost recharge
        if (!this.input.boost && this.boost < this.maxBoost) {
            this.boost = Math.min(this.maxBoost, this.boost + this.boostRechargeRate * deltaTime);
        }

        // Ground detection
        this.onGround = this.body.velocity.y < 0.1 && this.body.velocity.y > -0.1;

        // Jump
        if (this.input.jump && this.onGround && this.jumpCooldown <= 0) {
            this.body.velocity.y = 15;
            this.jumpCooldown = 0.3;
        }
        this.jumpCooldown -= deltaTime;

        // Movement
        const moveDir = new CANNON.Vec3(0, 0, 0);
        const forward = new CANNON.Vec3(Math.sin(this.body.quaternion.getAxisAngle()[1]), 0, Math.cos(this.body.quaternion.getAxisAngle()[1]));
        const right = new CANNON.Vec3(Math.cos(this.body.quaternion.getAxisAngle()[1]), 0, -Math.sin(this.body.quaternion.getAxisAngle()[1]));

        if (this.input.forward) moveDir.vadd(forward, moveDir);
        if (this.input.backward) moveDir.vsub(forward, moveDir);
        if (this.input.right) moveDir.vadd(right, moveDir);
        if (this.input.left) moveDir.vsub(right, moveDir);

        const speed = this.input.boost && this.boost > 0 ? this.boostSpeed : this.speed;
        if (moveDir.length() > 0) {
            moveDir.normalize();
            this.body.velocity.x = moveDir.x * speed;
            this.body.velocity.z = moveDir.z * speed;

            if (this.input.boost && this.boost > 0) {
                this.boost -= 30 * deltaTime;
            }
        } else {
            this.body.velocity.x *= 0.95;
            this.body.velocity.z *= 0.95;
        }
    }

    applyForce(force) {
        this.body.applyForce(force, this.body.position);
    }
}
