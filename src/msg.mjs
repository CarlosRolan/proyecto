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

const ACTION_EXIT = "EXIT";
const ACTION_NEW_PLAYER = "NEW_PLAYER";
const ACTION_REGISTER = "REGISTER";
const ACTION_UPDATE = "UPDATE";
const ACTION_NEW_POS = "NEW_POS";
const ACTION_MESSAGE = "MESSAGE";

export { ACTION_EXIT, ACTION_MESSAGE, ACTION_NEW_PLAYER, ACTION_NEW_POS, ACTION_REGISTER, ACTION_UPDATE }
