const ws = new WebSocket("ws://localhost:3000");

console.log(ws);

// Manejar eventos, como onopen, onmessage, etc.
ws.onopen = function () {
  console.log("Conexión establecida");
  ws.send("Hola servidor");
};

ws.onmessage = function (event) {
  console.log("Mensaje recibido:", event.data);
};

ws.onerror = function (error) {
  console.error("Error:", error);
};

ws.onclose = function () {
  console.log("Conexión cerrada");
};

