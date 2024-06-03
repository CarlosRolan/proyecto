import * as THREE from "../../three/build/three.module.js";

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(-10, -10, -10); // Posición de la luz
spotLight.target.position.set(0, 0, 0); // Punto focal del foco

export { spotLight };
