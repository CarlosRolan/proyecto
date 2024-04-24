import * as THREE from "../../node_modules/three/build/three.module.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

export { renderer };
