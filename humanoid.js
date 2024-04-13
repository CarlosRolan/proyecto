import * as THREE from "three";

// Crear la geometría del humanoide
const headGeometry = new THREE.SphereGeometry(1, 16, 16);
const bodyGeometry = new THREE.CylinderGeometry(0.8, 1, 2, 16);
const limbGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);

// Crear los materiales del humanoide
const headMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rojo para la cabeza
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Verde para el cuerpo
const limbMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Azul para las extremidades

// Crear las mallas del humanoide
const head = new THREE.Mesh(headGeometry, headMaterial);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
const armRight = new THREE.Mesh(limbGeometry, limbMaterial);
const armLeft = new THREE.Mesh(limbGeometry, limbMaterial);
const legRight = new THREE.Mesh(limbGeometry, limbMaterial);
const legLeft = new THREE.Mesh(limbGeometry, limbMaterial);

// Posicionamiento de las partes del cuerpo
head.position.y = 2;
body.position.y = 0.25;
armRight.position.set(1.5, 0, 0);
armLeft.position.set(-1.5, 0, 0);
legRight.position.set(0.5, -2.5, 0);
legLeft.position.set(-0.5, -2.5, 0);

// Crear un grupo para contener todas las partes del cuerpo
const humanoid = new THREE.Group();
humanoid.add(head);
humanoid.add(body);
humanoid.add(armRight);
humanoid.add(armLeft);
humanoid.add(legRight);
humanoid.add(legLeft);

// Exportar el humanoide
export default humanoid;
