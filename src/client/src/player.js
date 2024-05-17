//import * as THREE from "../../../three/build/three.module.js";
import * as THREE from "../../../three/build/three.module.js";
//import { OBJLoader } from "../../../three/examples/jsm/loaders/OBJLoader.js";

//Create an OBJ loader
//var loader = new OBJLoader();

export class Player {
  constructor(id) {
    const group = new THREE.Group();

    const geometry = new THREE.BoxGeometry();
    this.geometry = geometry;
    const material = [
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Derecha (frente)
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Izquierda (frente)
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Arriba (frente)
      new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Abajo (frente)
      new THREE.MeshBasicMaterial({ color: 0x000000 }), // Frente (mirando hacia aquí)
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // Atrás
    ];
    this.material = material;

    /*loader.load(
      "./data/player.obj",
      function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            // Add each mesh to the group
            group.add(child);
          }
        });
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error("Error loading the OBJ file", error);
      }
    );*/

    //TODO ver el radius de speher boundigbox
    const body = new THREE.Mesh(geometry, material);

    this.group = group.add(body);

    this.mesh = group;
    this.mesh.position.set(-95, 0.5, -95);

    if (id == null) {
      this.id = Math.floor(Math.random() * 100);
    } else {
      this.id = id;
    }
    this.mesh.name = id;
  }

  move(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  rotate(newRotation) {
    this.mesh.rotation.y = newRotation;
  }

  getBoundingBox() {
    return this.mesh.geometry.boundingBox;
  }
}

const p = new Player();

const enemies = new Set();

export { p, enemies };
