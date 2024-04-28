// Control de teclado para mover al jugador
const moveSpeed = 0.1;
const keys = {
  W: false,
  A: false,
  S: false,
  D: false,
};

// Control de ratón para rotar la cámara alrededor del jugador
let mouseDown = false;
let lastMouseX = null;
let cameraRotation = 0;
let playerRotation = 0;

function calculateNewPos(oldPosition) {
  // Calculamos las posiciones candidatas del jugador
  let x = oldPosition.x;
  let y = oldPosition.y;
  let z = oldPosition.z;

  if (keys.W) {
    x += moveSpeed * Math.sin(playerRotation);
    z += moveSpeed * Math.cos(playerRotation);
  }
  if (keys.A) {
    x += moveSpeed * Math.cos(playerRotation);
    z -= moveSpeed * Math.sin(playerRotation);
  }
  if (keys.S) {
    x -= moveSpeed * Math.sin(playerRotation);
    z -= moveSpeed * Math.cos(playerRotation);
  }
  if (keys.D) {
    x -= moveSpeed * Math.cos(playerRotation);
    z += moveSpeed * Math.sin(playerRotation);
  }

  const newPos = { x, y, z };

  return newPos;

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

function getRotation() {
  return playerRotation;
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

const keyEvents = { onKeyDown, onKeyUp };
const mouseEvents = { onMouseDown, onMouseUp, onMouseMove };
const playerActions = { calculateNewPos, getRotation };

export { keyEvents, mouseEvents, playerActions, cameraRotation };
