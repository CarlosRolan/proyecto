import * as THREE from "../../../three/build/three.module.js";

export class Player {
  constructor(id) {
    this.climbing = false;

    // Main group for visual components
    this.group = new THREE.Group();

    // Create a sphere to represent the player's body
    const geometry = new THREE.SphereGeometry(1, 8, 8); // Radius 1, 8 width segments, 8 height segments
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const body = new THREE.Mesh(geometry, material);

    // Compute bounding sphere and box
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();

    // Add the body to the main group
    this.group.add(body);

    // Group for helpers (bounding box, bounding sphere, arrows)
    this.groupHelper = new THREE.Group();

    // Create and add the BoxHelper for visualizing the bounding box
    this.boxHelper = new THREE.BoxHelper(body, 0xffff00); // Yellow color
    this.groupHelper.add(this.boxHelper);

    // Create the bounding sphere helper
    const boundingSphereGeometry = new THREE.SphereGeometry(geometry.boundingSphere.radius, 16, 16);
    const boundingSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); // Red color, wireframe
    const boundingSphereMesh = new THREE.Mesh(boundingSphereGeometry, boundingSphereMaterial);
    this.groupHelper.add(boundingSphereMesh);

    // Create arrow helpers for x, y, z axes
    const arrowSize = 2; // Length of the arrows

    const xArrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0), // Direction
      new THREE.Vector3(0, 0, 0), // Origin
      arrowSize, // Length
      0xff0000 // Color (red for X axis)
    );
    this.groupHelper.add(xArrowHelper);

    const yArrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0), // Direction
      new THREE.Vector3(0, 0, 0), // Origin
      arrowSize, // Length
      0x00ff00 // Color (green for Y axis)
    );
    this.groupHelper.add(yArrowHelper);

    const zArrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1), // Direction
      new THREE.Vector3(0, 0, 0), // Origin
      arrowSize, // Length
      0x0000ff // Color (blue for Z axis)
    );
    this.groupHelper.add(zArrowHelper);

    // Add both groups to the player mesh
    this.mesh = new THREE.Group();
    this.mesh.add(this.group);
    this.mesh.add(this.groupHelper);

    // Set initial position
    this.mesh.position.set(-95, 0.5, -95);

    // Assign an ID to the player
    this.id = id == null ? Math.floor(Math.random() * 100) : id;
    this.mesh.name = id;
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
    return this.geometry.boundingSphere;
  }

  getBoundingBox() {
    return this.geometry.boundingBox;
  }

  updateBoxHelper() {
    this.boxHelper.update();
  }
}

const p = new Player();

const enemies = new Set();

export { p, enemies };
