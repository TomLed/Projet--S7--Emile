var PHYSICS = require('./Physics');

module.exports = class {
    constructor(room) {
        this.room = room;
        this.scores = {};
        this.dices = [];
        this.reserve = new Array(5).fill(false);
        this.currentPlayerName;
    }

    rollDices(player) {
        var simulation = PHYSICS.simulate();
        this.dices = simulation.faces;
        player.canRollDices(simulation);
    }

    updateDice(player, index) {
        this.reserve[index] = !this.reserve[index];
        player.canUpdateDice(index, this.reserve[index]);
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

        for (var i = 0; i< 5; i++) {
            this.reserve.fill(false);
            this.room.io.to(this.room.id).emit('dice updated', {diceIndex: i, inReserve: false});
        }

        this.room.io.to(this.room.id).emit('next turn', this.currentPlayerName);
    }
};
