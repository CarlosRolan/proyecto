"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camera = void 0;
// Crear la cámara
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
exports.camera = camera;
camera.position.set(0, 5, -10);