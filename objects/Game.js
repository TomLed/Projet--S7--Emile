var Room = require('./Room');

module.exports = class {
    constructor(io) {
        this.rooms = {};
        this.io = io;
    }

    addRoom(id) {
        if (!this.rooms[id])
            this.rooms[id] = new Room(id, this.io);
    }
};
