import * as THREE from "../../../three/build/three.module.js";

const constianer = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

export { renderer };
