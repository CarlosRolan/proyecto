export default class Msg {
  constructor(action, content) {
    this.action = action;
    this.content = content;
  }

  pack() {
    const json = {
      action: this.action,
      content: this.content,
    };

    return JSON.stringify(json);
  }
}

const ACTION_REGISTER = "REGISTER";
const ACTION_EXIT = "EXIT";
const ACTION_UPDATE = "UPDATE";
const ACTION_MSG = "MESSAGE";

export { ACTION_EXIT, ACTION_UPDATE, ACTION_MSG, ACTION_REGISTER };
