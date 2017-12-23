var Physics = require('./Physics');

module.exports = class {
    constructor(room) {
        this.room = room;
        this.scores = {};
        this.dices = [];
        this.reserve = [];
        this.currentPlayerName;
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

    nextPlayer(playerName){
        //Finds and defines the new current player
        var nextPlayerIndex;
        for (var i = 0; i < 4; i++){
            if (this.room.playerNames[i] === playerName){
                nextPlayerIndex = i;
            }
        }
        if (nextPlayerIndex == 3){
            this.currentPlayerName = this.room.playerNames[0];
        }
        else{
            this.currentPlayerName = this.room.playerNames[nextPlayerIndex+1];
        }
        this.room.io.to(this.room.id).emit('next turn', this.currentPlayerName);
    }
};
