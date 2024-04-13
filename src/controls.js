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

function movePlayer(player) {
  // Calculamos las posiciones candidatas del jugador
  let nextX = player.position.x;
  let nextZ = player.position.z;

  if (keys.W) {
    nextX += moveSpeed * Math.sin(playerRotation);
    nextZ += moveSpeed * Math.cos(playerRotation);
  }
  if (keys.A) {
    nextX += moveSpeed * Math.cos(playerRotation);
    nextZ -= moveSpeed * Math.sin(playerRotation);
  }
  if (keys.S) {
    nextX -= moveSpeed * Math.sin(playerRotation);
    nextZ -= moveSpeed * Math.cos(playerRotation);
  }
  if (keys.D) {
    nextX -= moveSpeed * Math.cos(playerRotation);
    nextZ += moveSpeed * Math.sin(playerRotation);
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

const keyEvents = { onKeyDown, onKeyUp };
const mouseEvents = { onMouseDown, onMouseUp, onMouseMove };
const playerActions = { movePlayer };

export {
  keyEvents,
  mouseEvents,
  playerRotation,
  cameraRotation,
  playerActions,
};
