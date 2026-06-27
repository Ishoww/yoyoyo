// Physics Engine Setup
class PhysicsWorld {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.defaultContactMaterial.friction = 0.3;
        this.world.defaultContactMaterial.restitution = 0.5;
        
        // Create contact materials
        this.createMaterials();
    }

    createMaterials() {
        this.carMaterial = new CANNON.Material('car');
        this.ballMaterial = new CANNON.Material('ball');
        this.groundMaterial = new CANNON.Material('ground');

        // Car to Ground
        const carGround = new CANNON.ContactMaterial(this.carMaterial, this.groundMaterial, {
            friction: 0.4,
            restitution: 0.3
        });
        this.world.addContactMaterial(carGround);

        // Ball to Ground
        const ballGround = new CANNON.ContactMaterial(this.ballMaterial, this.groundMaterial, {
            friction: 0.2,
            restitution: 0.8
        });
        this.world.addContactMaterial(ballGround);

        // Ball to Car
        const ballCar = new CANNON.ContactMaterial(this.ballMaterial, this.carMaterial, {
            friction: 0.3,
            restitution: 0.9
        });
        this.world.addContactMaterial(ballCar);
    }

    addGround() {
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0,
            material: this.groundMaterial
        });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
        return groundBody;
    }

    addWall(x, z, width, height) {
        const wallShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, 0.5));
        const wallBody = new CANNON.Body({
            mass: 0,
            material: this.groundMaterial
        });
        wallBody.addShape(wallShape);
        wallBody.position.set(x, height / 2, z);
        this.world.addBody(wallBody);
        return wallBody;
    }

    step(dt = 1 / 60) {
        this.world.step(1 / 60, dt, 3);
    }
}

// Utility to sync Physics with Three.js
function syncPhysicsToThree(cannonBody, threeObject) {
    threeObject.position.copy(cannonBody.position);
    threeObject.quaternion.copy(cannonBody.quaternion);
}