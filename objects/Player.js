module.exports = class {
  constructor(name, socket, room) {
    this.room = room;
    this.name = name;
    this.socket = socket;
    this.socket.player = this;
    this.setSocketFunctions();
    this.socket.emit('connected', {playerName: this.name, roomId: this.room.id});
  }

  setSocket(socket) {
    this.socket = socket;
    this.socket.player = this;
    this.setSocketFunctions();
  }

  setSocketFunctions() {
    this.socket.on('roll dices', function(data) {
      this.player.rollDices();
    });
    this.socket.on('want to add dice to reserve', function(data) {
      this.player.addToReserve(data.dice);
    });
    this.socket.on('want to remove dice from reserve', function(data) {
      this.player.removeFromReserve(data.dice);
    });
    this.socket.on('disconnect', function(data) {
      this.player.disconnect();
    });
  }

  resume() {

  }

  rollDices() {
    this.room.emile.rollDices(this);
  }

  canRollDices(simulation) {
    this.socket.emit('dices rolled', simulation);
  }

  cannotRollDices() {
    this.socket.emit('not your turn')
  }

  addToReserve(dice) {
    this.emile.addDice(dice);
  }

  removeFromReserve(data) {
    this.emile.removeDice(data.dice);
  }

  disconnect() {
    console.log('socket for player', this.name, 'disconnected');
    delete this.socket;
  }
}
