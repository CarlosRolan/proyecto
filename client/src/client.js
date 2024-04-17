const ws = new WebSocket("ws://localhost:3000");

console.log(ws);

// Manejar eventos, como onopen, onmessage, etc.
ws.onopen = function () {
  console.log("Conexión establecida");
  try {
    ws.send("Hola servidor");
  } catch (error) {
    ws.send("Hola servidor catched");
  }
};

ws.onmessage = function (event) {
  console.log("MSG RECIBIDO");
  try {
    const serverMsg = JSON.parse(event.data);
    console.log(serverMsg);
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

export { sendPosition };
