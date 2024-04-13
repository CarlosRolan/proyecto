"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ground = void 0;

function initGround() {
  // Crear un suelo
  var groundGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
  var groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide
  });
  return new THREE.Mesh(groundGeometry, groundMaterial);
}

var ground = initGround();
exports.ground = ground;
ground.rotation.x = Math.PI / -2;