// Crear la escena
var scene = new THREE.Scene();

// Crear el renderizador
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Crear un cubo para representar al jugador
var geometry = new THREE.BoxGeometry();
var material = [
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Derecha (frente)
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Izquierda (frente)
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Arriba (frente)
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Abajo (frente)
    new THREE.MeshBasicMaterial({ color: 0x000000 }), // Frente (mirando hacia aquí)
    new THREE.MeshBasicMaterial({ color: 0xffffff })  // Atrás
];
var player = new THREE.Mesh(geometry, material);
scene.add(player);

// Crear la cámara
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, -10);

// Crear un suelo
var groundGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
var groundMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / -2;
scene.add(ground);

// Control de teclado para mover al jugador
var moveSpeed = 0.1;
var keys = {
    W: false,
    A: false,
    S: false,
    D: false
};

// Control de ratón para rotar la cámara alrededor del jugador
var mouseDown = false;
var lastMouseX = null;
var cameraRotation = 0;

function onMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
}

function onMouseUp() {
    mouseDown = false;
    lastMouseX = null;
}

function onMouseMove(event) {


    /*var deltaX = event.clientX - lastMouseX;
    cameraRotation -= deltaX * 0.001;
    lastMouseX = event.clientX;
    */

    
        // Calculamos la diferencia en la posición del ratón desde el último movimiento
        var deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;

        // Actualizamos la rotación de la cámara basada en la diferencia de posición del ratón
        cameraRotation -= deltaX * 0.001;
        lastMouseX = event.clientX;
}

// Event listeners para el control de ratón
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('mousemove', onMouseMove, false);

// Control de teclado para mover al jugador
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

function onKeyDown(event) {
    switch (event.key.toUpperCase()) {
        case 'W':
            keys.W = true;
            break;
        case 'A':
            keys.A = true;
            break;
        case 'S':
            keys.S = true;
            break;
        case 'D':
            keys.D = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.key.toUpperCase()) {
        case 'W':
            keys.W = false;
            break;
        case 'A':
            keys.A = false;
            break;
        case 'S':
            keys.S = false;
            break;
        case 'D':
            keys.D = false;
            break;
    }
}

// Animar la escena
function animate() {
    requestAnimationFrame(animate);

    // Mover al jugador
    movePlayer();

      // Actualizar la rotación del jugador para que coincida con la rotación de la cámara
     // Actualizar la rotación del jugador para que coincida con la rotación de la cámara
     var deltaRotation = -camera.rotation.y - player.rotation.y;
     player.rotation.y += deltaRotation * 0.1;
 

    // Actualizar la posición de la cámara para seguir al jugador
    camera.position.x = player.position.x - 10 * Math.sin(cameraRotation);
    camera.position.z = player.position.z - 10 * Math.cos(cameraRotation);
    camera.lookAt(player.position);

    // Renderizar la escena
    renderer.render(scene, camera);
}

// Llamar a la función de animación
animate();

function movePlayer() {
    // Calculamos las posiciones candidatas del jugador
    var nextX = player.position.x;
    var nextZ = player.position.z;

    if (keys.W) {
        nextX += moveSpeed * Math.sin(cameraRotation);
        nextZ += moveSpeed * Math.cos(cameraRotation);
    }
    if (keys.A) {
        nextX += moveSpeed * Math.cos(cameraRotation);
        nextZ -= moveSpeed * Math.sin(cameraRotation);
    }
    if (keys.S) {
        nextX -= moveSpeed * Math.sin(cameraRotation);
        nextZ -= moveSpeed * Math.cos(cameraRotation);
    }
    if (keys.D) {
        nextX -= moveSpeed * Math.cos(cameraRotation);
        nextZ += moveSpeed * Math.sin(cameraRotation);
    }

    // Verificamos si el jugador está dentro del suelo
    if (isPlayerOnGround(nextX, nextZ)) {
        // Movemos al jugador
        player.position.x = nextX;
        player.position.z = nextZ;
    }
}

function isPlayerOnGround(x, z) {
    // Verificamos si el jugador está dentro de los límites del suelo
    return x >= -9.5 && x <= 9.5 && z >= -9.5 && z <= 9.5;
}
