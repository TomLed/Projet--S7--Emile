var Room = require('./Room');

module.exports = class {
  constructor() {
    this.rooms = {};
  }
  
  addRoom(id) {
    if (!this.rooms[id])
      this.rooms[id] = new Room(id);
  }
}
