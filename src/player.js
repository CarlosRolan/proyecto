import * as THREE from "../node_modules/three/build/three.module.js";

// Control de ratón para rotar la cámara alrededor del jugador
let mouseDown = false;
let lastMouseX = null;
let cameraRotation = 0;
let playerRotation = 0;

const player = initPlayer();
player.position.set(-95, 0.5, -95);

// Control de teclado para mover al jugador
const moveSpeed = 0.1;
const keys = {
  W: false,
  A: false,
  S: false,
  D: false,
};

function initPlayer() {
  // Crear un cubo para representar al jugador
  const geometry = new THREE.BoxGeometry();
  const material = [
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Derecha (frente)
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Izquierda (frente)
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Arriba (frente)
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Abajo (frente)
    new THREE.MeshBasicMaterial({ color: 0x000000 }), // Frente (mirando hacia aquí)
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Atrás
  ];
  return new THREE.Mesh(geometry, material);
}

function movePlayer() {
  // Calculamos las posiciones candidatas del jugador
  let nextX = player.position.x;
  let nextZ = player.position.z;

  if (keys.W) {
    nextX += moveSpeed * Math.sin(player.rotation.y);
    nextZ += moveSpeed * Math.cos(player.rotation.y);
  }
  if (keys.A) {
    nextX += moveSpeed * Math.cos(player.rotation.y);
    nextZ -= moveSpeed * Math.sin(player.rotation.y);
  }
  if (keys.S) {
    nextX -= moveSpeed * Math.sin(player.rotation.y);
    nextZ -= moveSpeed * Math.cos(player.rotation.y);
  }
  if (keys.D) {
    nextX -= moveSpeed * Math.cos(player.rotation.y);
    nextZ += moveSpeed * Math.sin(player.rotation.y);
  }

  player.position.x = nextX;
  player.position.z = nextZ;

  /* Verificamos si el jugador está dentro del suelo
  if (isPlayerOnGround(nextX, nextZ)) {
    // Movemos al jugador
    player.position.x = nextX;
    player.position.z = nextZ;
  }*/
}

function onMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
}

function onMouseUp(event) {
  mouseDown = false;
  lastMouseX = null;

  playerRotation = cameraRotation;
}

function onMouseMove(event) {
  if (!mouseDown) return;

  const deltaX = event.clientX - lastMouseX;
  cameraRotation -= deltaX * 0.001;
  lastMouseX = event.clientX;
}

function onKeyDown(event) {
  switch (event.key.toUpperCase()) {
    case "W":
      keys.W = true;
      break;
    case "A":
      keys.A = true;
      break;
    case "S":
      keys.S = true;
      break;
    case "D":
      keys.D = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.key.toUpperCase()) {
    case "W":
      keys.W = false;
      break;
    case "A":
      keys.A = false;
      break;
    case "S":
      keys.S = false;
      break;
    case "D":
      keys.D = false;
      break;
  }
}

function updatePlayer() {
  // Mover al jugador
  movePlayer();

  // Actualizar la rotación del jugador para que coincida con la rotación de la cámara
  //const deltaRotation = -camera.rotation.y - player.rotation.y;
  //player.rotation.y += deltaRotation * 0.1;
  player.rotation.y = playerRotation;
}

export {
  player,
  updatePlayer,
  onKeyDown,
  onKeyUp,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  cameraRotation,
};
