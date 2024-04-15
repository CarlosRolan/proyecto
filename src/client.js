import { Server } from 'ws';

const wss = new Server({ port: 3000 });

wss.on('connection', function connection(ws) {
  console.log('Nuevo jugador conectado');

  ws.on('message', function incoming(message) {
    console.log('Mensaje recibido desde el cliente:', message);
    // Procesa el mensaje como desees
  });

  ws.on('close', function close() {
    console.log('Jugador desconectado');
  });
});
