const ws = new WebSocket("ws://localhost:3000");
let id = null;

console.log(ws);

// Manejar eventos, como onopen, onmessage, etc.
ws.onopen = function () {
  console.log("Conexión establecida");
  //ws.send("Hola servidor");
  ws.onmessage = function (event) {
    id = event.data;
  }
};

ws.onmessage = function (event) {
  try {
    const serverMsg = JSON.parse(event.data);
    console.log(serverMsg);
    id = serverMsg.id;
  } catch (error) {
    console.log(event.data);
  }
};

ws.onerror = function (error) {
  console.error("Error:", error);
};

ws.onclose = function () {
  console.log("Conexión cerrada");
};

function sendPosition(position) {
  if (ws.readyState == ws.OPEN) ws.send(position);
}

export { sendPosition, id };
