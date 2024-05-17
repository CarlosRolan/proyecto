export default class Msg {
  constructor(action, content) {
    this.action = action;
    this.content = content;
  }

  pack() {
    const json = {
      ACTION: this.action,
      CONTENT: this.content,
    };

    return JSON.stringify(json);
  }
}

const ACTION_REGISTER = "REGISTER";
const ACTION_EXIT = "EXIT";
const ACTION_UPDATE = "UPDATE";
const ACTION_MSG = "MESSAGE";
const ACTION_NEW_POS = "NEW_POS";
const ACTION_NEW_PLAYER = "NEW_PLAYER";

export {
  ACTION_EXIT,
  ACTION_UPDATE,
  ACTION_MSG,
  ACTION_REGISTER,
  ACTION_NEW_POS,
  ACTION_NEW_PLAYER,
};
