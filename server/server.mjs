import { strFromU8 } from "three/examples/jsm/libs/fflate.module.js";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function connection(ws) {
  console.log("Nuevo jugador conectado");

  // Manejar mensajes entrantes desde el cliente
  ws.on("message", function incoming(message) {
    // Aquí puedes procesar los mensajes recibidos del cliente, como la posición del jugador
    console.log("Mensaje recibido desde el cliente:", strFromU8(message));
  });

  // Manejar cierre de conexión
  ws.on("close", function close() {
    console.log("Jugador desconectado");
  });
});

setInterval(async () => {
  // Por ejemplo, puedes transmitir este mensaje a todos los otros clientes
  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === ws.OPEN) {
      console.log("enviando msg");
      client.send(message);
    }
  });
}, 3000);
