const ws = new WebSocket("ws://localhost:3000");

let id = null;

// Manejar eventos, como onopen, onmessage, etc.
ws.onopen = function () {
  console.log("Conexión establecida");
  try {
    generateId();
    sendId();
  } catch (error) {
    ws.send(error);
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

function sendId() {
  if (id != null) {
    ws.send(id);
  }
}

function generateId() {
  id = Math.floor(Math.random() * 100);
}

export { sendPosition };
