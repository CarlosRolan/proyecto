class PlayerConn {
  constructor(id, position, ws) {
    this.id = id;
    this.ws = ws;
    this.position = position;
  }

  // Generar un ID único para el jugador
  static getRandomId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Métodos para actualizar el estado del jugador, como moverse o recibir daño
  move(newPosition) {
    this.position = newPosition;
  }
}

export default PlayerConn;
