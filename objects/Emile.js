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
        var simulation = Physics.simulate();
        this.dices = simulation.faces;
        player.canRollDices(simulation);
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
