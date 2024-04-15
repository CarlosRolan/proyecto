"use strict";

var _ws = require("ws");

var wss = new _ws.Server({
  port: 3000
});
wss.on('connection', function connection(ws) {
  console.log('Nuevo jugador conectado');
  ws.on('message', function incoming(message) {
    console.log('Mensaje recibido desde el cliente:', message); // Procesa el mensaje como desees
  });
  ws.on('close', function close() {
    console.log('Jugador desconectado');
  });
});