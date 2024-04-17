class PlayerConn {
  constructor(id, ws) {
    this.id = id;
    this.ws = ws;
  }

  // Generar un ID único para el jugador
  static getRandomId() {
    return Math.random().toString(36).substr(2, 9);
  }

  sendPlayerId(playerId) {
    const playerAssignation = {
      id: playerId,
    };

    try {
      this.ws.send(JSON.stringify(playerAssignation));
    } catch (error) {
      console.log("ERROR TRYING TO SEND ID player");
    }
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
