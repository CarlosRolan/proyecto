class PlayerConn {
  constructor(id, ws) {
    this.id = id;
    this.ws = ws;
  }

  // Métodos para actualizar el estado del jugador, como moverse o recibir daño
  sendPosition() {
    try {
      this.ws.send(JSON.stringify("new position"));
    } catch (error) {
      console.log("ERROR TRYING TO SEND ID player");
    }
  }
}

export default PlayerConn;
