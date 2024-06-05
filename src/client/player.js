import * as THREE from "../../three/build/three.module.js";

// Reusable geometries and materials
const bodyGeometry = new THREE.SphereGeometry(1, 8, 8);
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
bodyGeometry.computeBoundingSphere();
bodyGeometry.computeBoundingBox();

const boundingSphereGeometry = new THREE.SphereGeometry(bodyGeometry.boundingSphere.radius, 16, 16);
const boundingSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

const ARROW_SIZE = 2;
const AXIS_COLORS = {
  x: 0xff0000, // Red
  y: 0x00ff00, // Green
  z: 0x0000ff  // Blue
};

class Player {
  constructor(id) {
    this.climbing = false;

    // Main group for visual components
    this.group = new THREE.Group();

    // Create a sphere to represent the player's body
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.group.add(body);

    // Group for helpers (bounding box, bounding sphere, arrows)
    this.groupHelper = new THREE.Group();

    // Create and add the BoxHelper for visualizing the bounding box
    this.boxHelper = new THREE.BoxHelper(body, 0xffff00); // Yellow color
    this.groupHelper.add(this.boxHelper);

    // Create the bounding sphere helper
    const boundingSphereMesh = new THREE.Mesh(boundingSphereGeometry, boundingSphereMaterial);
    this.groupHelper.add(boundingSphereMesh);

    // Create arrow helpers for x, y, z axes
    const directions = [
      { dir: new THREE.Vector3(1, 0, 0), color: AXIS_COLORS.x }, // X axis
      { dir: new THREE.Vector3(0, 1, 0), color: AXIS_COLORS.y }, // Y axis
      { dir: new THREE.Vector3(0, 0, 1), color: AXIS_COLORS.z }  // Z axis
    ];

    directions.forEach(({ dir, color }) => {
      const arrowHelper = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), ARROW_SIZE, color);
      //this.groupHelper.add(arrowHelper);
    });

    // Add both groups to the player mesh
    this.mesh = new THREE.Group();
    this.mesh.add(this.group);
    this.mesh.add(this.groupHelper);

    // Set initial position
    this.mesh.position.set(-95, 1, -95);

    // Assign an ID to the player
    this.id = id == null ? Math.floor(Math.random() * 100) : id;
    this.mesh.name = this.id; // Corrected to use this.id
  }

  isClimbing() {
    return this.climbing;
  }

  getCurrentPos() {
    const { x, y, z } = this.mesh.position;
    return { x, y, z };
  }

  move(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  rotate(newRotation) {
    this.mesh.rotation.y = newRotation;
  }

  getBoundingSphere() {
    return bodyGeometry.boundingSphere; // Access shared geometry's bounding sphere
  }

  getBoundingBox() {
    return bodyGeometry.boundingBox; // Access shared geometry's bounding box
  }

  updateBoxHelper() {
    this.boxHelper.update();
  }
}

// Export player and enemies
const p = new Player();
const enemies = new Set();

export { Player, p, enemies };
