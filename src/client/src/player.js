import * as THREE from "../../../three/build/three.module.js";

export class Player {
  constructor(id) {

    this.climbing = false;

    const group = new THREE.Group();
    const geometry = new THREE.SphereGeometry(1, 8, 8); // Radio 1, 32 segmentos de ancho, 32 segmentos de alto
    // Crear un material de un solo color (verde) para la esfera
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const body = new THREE.Mesh(geometry, material);

    this.geometry = geometry;

    // Calcular el bounding box de la geometría
    geometry.computeBoundingSphere();
    this.boundingSphere = geometry.boundingSphere;
    geometry.computeBoundingBox();
    this.boundingBox = geometry.boundingBox;

    this.material = material;

    this.group = group.add(body);

    // Crear y añadir el BoxHelper para visualizar el bounding box
    this.boxHelper = new THREE.BoxHelper(body, 0xffff00); // Color amarillo

    this.group.add(this.boxHelper);

    // Crear el bounding sphere
    const boundingSphereGeometry = new THREE.SphereGeometry(geometry.boundingSphere.radius, 16, 16);
    const boundingSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); // Color rojo para el bounding sphere
    const boundingSphereMesh = new THREE.Mesh(boundingSphereGeometry, boundingSphereMaterial);
    this.group.add(boundingSphereMesh);

    this.mesh = group;
    this.mesh.position.set(-95, 0.5, -95);

    if (id == null) {
      this.id = Math.floor(Math.random() * 100);
    } else {
      this.id = id;
    }
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
    return this.boundingBox;
  }

  logBoundingBoxSize() {
    if (this.boundingBox) {
      const size = new THREE.Vector3();
      this.boundingBox.getSize(size);
      console.log(`Bounding box size: ${size.x}, ${size.y}, ${size.z}`);
    } else {
      console.log("Bounding box not computed.");
    }
  }

  updateBoxHelper() {
    this.boxHelper.update();
  }
}

const p = new Player();
p.logBoundingBoxSize();

const enemies = new Set();

export { p, enemies };

