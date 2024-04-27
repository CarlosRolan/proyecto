import * as THREE from "../../../node_modules/three/build/three.module.js";

export class Player {
  constructor(id) {
    const geometry = new THREE.BoxGeometry();

    const material = [
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Derecha (frente)
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Izquierda (frente)
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Arriba (frente)
      new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Abajo (frente)
      new THREE.MeshBasicMaterial({ color: 0x000000 }), // Frente (mirando hacia aquí)
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // Atrás
    ];

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(-95, 0.5, -95);

    if (id == null) {
      this.id = Math.floor(Math.random() * 100);
    } else {
      this.id = id;
    }
    this.mesh.name = id;

    console.log("RANDMO ID " + this.id);
    console.log(this.mesh);
  }

  move(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  rotate(newRotation) {
    this.mesh.rotation.y = newRotation;
  }
}

const p = new Player();

const enemies = new Set();

export { p, enemies };
