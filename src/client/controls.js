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

function calculateNewPos({ x, y, z }) {
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

  return { x, y, z };
}

function onMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
}

function onMouseUp() {
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

function onKeyChange(event, isPressed) {
  const key = event.key.toUpperCase();
  if (keys.hasOwnProperty(key)) {
    keys[key] = isPressed;
  }
}

function onKeyDown(event) {
  onKeyChange(event, true);
}

function onKeyUp(event) {
  onKeyChange(event, false);
}

const keyEvents = { onKeyDown, onKeyUp };
const mouseEvents = { onMouseDown, onMouseUp, onMouseMove };
const playerActions = { calculateNewPos, getRotation };

export { keyEvents, mouseEvents, playerActions, cameraRotation };
