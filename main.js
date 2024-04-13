 // Configurar la escena
 const scene = new THREE.Scene();
 const renderer = new THREE.WebGLRenderer();
 renderer.setSize(window.innerWidth, window.innerHeight);
 document.body.appendChild(renderer.domElement);

 // Agregar una cámara a la escena
 const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

 // Crear un jugador (cubo verde)
 const playerSize = 1;
 const playerGeometry = new THREE.BoxGeometry(playerSize, playerSize, playerSize);
 const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
 const player = new THREE.Mesh(playerGeometry, playerMaterial);
 scene.add(player);

 // Inicializar variables para la cámara en tercera persona
 let cameraDistance = 5; // Distancia entre la cámara y el jugador
 let cameraAngleX = 0; // Ángulo de la cámara respecto al eje X

 // Función para manejar el movimiento del ratón y actualizar la cámara
 function handleMouseMove(event) {
     const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
     const deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

     // Actualizar el ángulo de la cámara en función del movimiento del ratón
     cameraAngleX -= deltaY * 0.01;
     cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraAngleX)); // Limitar el ángulo de la cámara en vertical

     // Rotar la cámara alrededor del jugador en función del movimiento del ratón
     const cameraOffset = new THREE.Vector3(0, 2, cameraDistance);
     cameraOffset.applyEuler(new THREE.Euler(cameraAngleX, player.rotation.y, 0, 'XYZ'));
     camera.position.copy(player.position).add(cameraOffset);
     camera.lookAt(player.position);
 }

 // Asignar el evento de movimiento del ratón al documento
 document.addEventListener('mousemove', handleMouseMove);

 // Renderizar la escena
 function animate() {
     requestAnimationFrame(animate);

     // Actualizar la posición y orientación del jugador según las teclas presionadas (usando tu lógica existente)

     // Mover la cámara junto con el jugador
     const cameraOffset = new THREE.Vector3(0, 2, cameraDistance);
     cameraOffset.applyEuler(new THREE.Euler(cameraAngleX, player.rotation.y, 0, 'XYZ'));
     camera.position.copy(player.position).add(cameraOffset);
     camera.lookAt(player.position);

     // Renderizar la escena
     renderer.render(scene, camera);
 }

 animate();