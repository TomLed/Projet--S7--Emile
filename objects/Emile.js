var Physics = require('./Physics');

module.exports = class {
    constructor(room) {
        this.room = room;
        this.scores = [];
        this.dices = [];
        this.reserve = [];
        this.currentPlayer;
    }

    rollDices(player) {
<<<<<<< HEAD
        var simulation = Physics.simulate();
        this.dices = simulation.faces;
        player.canRollDices(simulation);
=======
    // Just a fake condition : the player can roll dices only if his name is toto
        if (this.rules.canRollDices(player, this.room.players['toto'])) {
            var simulation = Physics.simulate();
            this.dices = simulation.faces;
            player.canRollDices(simulation);
        } else player.cannotRollDices();
>>>>>>> 31052677800dbf5afdbae258ebf4d7abef14bf8a
    }

    endTurn() {
      //this.room.sockets.emit();
    }

    addDice(dice) {
        delete this.dices[dice.index];
        this.reserve[dice.index] = dice.value;
    }

    removeDice(dice) {
        delete this.reserve[dice.index];
        this.dices[dice.index] = dice.value;
    }
};
