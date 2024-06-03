export default class Msg {
  constructor(action, content) {
    this.action = action;
    this.content = content;
  }

  pack() {
    return JSON.stringify({
      ACTION: this.action,
      CONTENT: this.content,
    });
  }
}

export const ACTIONS = {
  REGISTER: "REGISTER",
  EXIT: "EXIT",
  UPDATE: "UPDATE",
  MESSAGE: "MESSAGE",
  NEW_POS: "NEW_POS",
  NEW_PLAYER: "NEW_PLAYER",
};
