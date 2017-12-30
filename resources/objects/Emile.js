var PHYSICS = require('./../javascript/physics');

module.exports = class {
    constructor(room) {
        this.room = room;
        this.scores = new Array(4).fill(-2500);
        this.dices = new Array(5).fill(undefined);
        this.reserve = new Array(5).fill(false);
        this.currentPlayer;
        this.potentialScore = 0;
    }

    rollDices(player) {
        if (player == this.currentPlayer) {
            var reserveFull = true;
            for (var i in this.reserve) {
                if (!this.reserve[i]) {
                    reserveFull = false;
                    break;
                }
            }

            if (!reserveFull) {
                var roll = PHYSICS.simulate(this.reserve);

                var j = 0;
                for (var i in this.reserve) {
                    if (!this.reserve[i]) {
                        this.dices[i] = roll.faces[j];
                        j++;
                    }
                }

                return {can: true, coordinates: roll.coordinates, faces: this.dices};
            } else {
                return {can: false, reason: 'all dices in reserve'};
            }
        } else {
            if (this.room.isFull()) {
                return {can: false, reason: 'not your turn'};
            } else {
                return {can: false, reason: 'room not full'};
            }
        }
    }

    updateDice(player, index) {

        function brelan(index, dices) {
            var count = 0, positions = new Array(dices.length).fill(false);
            positions[index] = true;

            for (var i in dices) {
                if (i != index) {
                    if (dices[i] == dices[index]) {
                        count++;
                        positions[i] = true;
                    }
                    if (count == 2) break;
                }
            }

            if (count == 2) {
                return {in: true, pos: positions};
            }
            return {in: false};
        }

        // We can remove a few returns by adding else ifs
        // Not sure about previous comment
        // TODO must add all check about score : if new score < prev score, can't change
        if (player == this.currentPlayer) {
            if (this.reserve[index]) {
                this.reserve[index] = false;
                return {can: true, reserve: this.reserve};
            } else {
                var br = brelan(index, this.dices);

                if (this.dices[index] == 5 || this.dices[index] == 1) {
                    this.reserve[index] = true;
                    return {can: true, reserve: this.reserve};
                } else if (br.in) {
                    for (var i in br.pos) {
                        if (br.pos[i]) {
                            this.reserve[i] = br.pos[i];
                        }
                    }
                    return {can: true, reserve: this.reserve};
                } else {
                    return {can: false, reason: 'not a marking dice'};
                }
            }
        } else {
            return {can: false, reason: 'not your turn'};
        }
    }

    nextPlayer(player) {
        //Finds and defines the new current player, resets turn
        if (player == this.currentPlayer) {
            var newIndex = (this.currentPlayer.index + 1) % 4;

            for (var i in this.room.players) {
                if (this.room.players[i].index == newIndex) {
                    this.currentPlayer = this.room.players[i];
                    break;
                }
            }

            this.dices.fill(undefined);
            this.reserve.fill(false);
            return {can: true, name: this.currentPlayer.name};
        } else {
            return {can: false, reason: 'not your turn'};
        }
    }
}
