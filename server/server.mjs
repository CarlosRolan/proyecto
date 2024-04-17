import { strFromU8 } from "three/examples/jsm/libs/fflate.module.js";
import { WebSocketServer } from "ws";
import PlayerConn from "./playerconn.mjs";

const wss = new WebSocketServer({ port: 3000 });

const players = {};

function listenConnections() {
  //CHANNEL STABLISH
  wss.on("connection", function connection(ws) {
    console.log("New player connected");

    const playerId = PlayerConn.getRandomId();

    // Manejar eventos del WebSocket
    ws.on("open", function () {
      console.log("Evento: open");
    });

    // Manejar mensajes entrantes desde el cliente
    ws.on("message", function incoming(message) {
      // Aquí puedes procesar los mensajes recibidos del cliente, como la posición del jugador
      //TODO posicion
      //console.log("Mensaje recibido desde el cliente:", strFromU8(message));
      try {
        const parsed = JSON.parse(message);
        console.log(parsed);
      } catch (error) {
        console.log(strFromU8(message));
      }

      // wss.clients.forEach(function each(client) {
      //   if (client.readyState == ws.OPEN) {
      //     console.log("enviando msg");
      //     client.send(message);
      //   }
      // });
    });

    ws.on("error", function (error) {
      console.error("Evento: error", error);
    });

    // Manejar cierre de conexión
    ws.on("close", function close() {
      console.log("Jugador desconectado");
    });

    // Generar un ID único para el jugador

    const newPlayerConn = new PlayerConn(playerId, 0, ws);

    console.log("Assiging id " + playerId);

    players[playerId] = newPlayerConn;
    newPlayerConn.sendPlayerId(playerId);
  });
}

// Función para enviar un mensaje a todos los clientes
function broadcast(message, ws) {
  // Por ejemplo, puedes transmitir este mensaje a todos los otros clientes
  wss.clients.forEach(function each(client) {
    if (client.readyState == 1 && client != ws) {
      client.send("SERVER OK");
    }
    /*if (client !== ws && client.readyState == ws.OPEN) {
    console.log("enviando msg");
    client.send(message);
  }*/
  });
}

listenConnections();

// setInterval(() => {
//   broadcast("CONNECTED");
// }, 5000);