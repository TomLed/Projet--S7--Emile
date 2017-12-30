/* TODO list

deubeul
tix
suite
fin de jeu
retirer que si nv score reserve > score reserve actuel

*/


var PHYSICS = require('./../javascript/physics');

module.exports = class {
    constructor(room) {
        this.room = room;
        this.scores = new Array(4).fill(-2500);
        this.dices = new Array(5).fill(undefined);
        this.reserve = new Array(5).fill(false);
        this.inBrelan = new Array(5).fill(false);
        this.currentPlayer;
        this.potentialScore = 0;
        this.tix = false;
        this.stuck = false;
        this.brelanOnes = 0;
        this.brelanFives = 0;
        this.brelanType = 0;
    }

    updateScore(player, name) {
        if (player == this.currentPlayer) {

            // TODO if (name == this.currentPlayer.name) {}

            if (this.tix) {
                // can tix TODO
            } else {

                if (this.stuck) {
                    this.scores[this.room.players[name].index] += this.currentPlayer.name == name ? -100 : 100;
                    return {can: true};
                } else {
                    var tempScore = this.scores[this.room.players[name].index];

                    tempScore += this.currentPlayer.name == name ? this.potentialScore : -this.potentialScore / 2;

                    if (tempScore < -2500) tempScore = -2500 - (2500 + tempScore);
                    if (tempScore > 2500) tempScore = 2500 - (tempScore - 2500);

                    this.scores[this.room.players[name].index] = tempScore;

                    return {can: true};
                }

            }
        } else {
            if (this.room.isFull()) {
                return {can: false, reason: 'not your turn'};
            } else {
                return {can: false, reason: 'room not full'};
            }
        }
    }

    brelan(index) {
        var dices = [];
        for (var i in this.dices) {
            if (!this.reserve[i])
                dices.push(this.dices[i]);
        }


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

    getScore(value, add) {
        var total;
        switch (value) {
            case 5:
                if (add) this.brelanFives++;
                total = this.brelanFives == 3 ? 400 : 50;
                break;
            case 1:
                if (add) this.brelanOnes++;
                total = this.brelanOnes == 3 ? 500 : 100;
                break;
            case 2: total = 200; break;
            case 3: total = 300; break;
            case 4: total = 400; break;
            case 6: total = 600; break;
        }
        return total;
    }

    //Check if the player can go on playing or not
    checkEnd(player) {
        for (var i in this.dices) {
            if (!this.reserve[i]) {
                if (this.dices[i] == 1 || this.dices[i] == 5 || this.brelan(i).in) {
                    this.stuck = false;
                    return this.stuck;
                }
            }
        }
        this.stuck = true;
        return this.stuck;
    }

    nextPlayer(player) {
        //Finds and defines the new current player, resets turn
        var newIndex = (this.currentPlayer.index + 1) % 4;

        this.potentialScore = 0;
        this.tix = false;
        this.stuck = false;
        this.brelanOnes = 0;
        this.brelanFives = 0;
        this.brelanType = 0;

        for (var i in this.room.players) {
            if (this.room.players[i].index == newIndex) {
                this.currentPlayer = this.room.players[i];
                break;
            }
        }

        this.dices.fill(0);
        this.inBrelan.fill(false);
        this.reserve.fill(false);
    }

    rollDices(player) {
        /* TODO With this implementation we cannot choose to remove the dice we want, we can only remove the last dice of the reserve */

        //These two loops tell if the dices are part of a brelan or not
        if (this.brelanFives >= 3) {
            var j = 0;
            for (var i in this.dices) {
                if (this.reserve[i] && this.dices[i] == 5) {
                    this.inBrelan[i] = true;
                    j++;
                }
                if (j >= 3) break;
            }
        }

        if (this.brelanOnes >= 3) {
            var j = 0;
            for (var i in this.dices) {
                if (this.reserve[i] && this.dices[i] == 1) {
                    this.inBrelan[i] = true;
                    j++;
                }
                if (j >= 3) break;
            }
        }

        if (this.brelanType) {
            var j = 0;
            for (var i in this.dices) {
                if (this.reserve[i] && this.dices[i] == this.brelanType) {
                    this.inBrelan[i] = true;
                    j++;
                }
                if (j >= 3) break;
            }
        }

        this.brelanFives = 0, this.brelanOnes = 0, this.brelanType = 0;

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
        var response;

        // TODO must add all check about score : if new score < prev score, can't change

        if (player == this.currentPlayer) {
            if (this.dices[index]) {
                if (this.reserve[index]) {
                    if (!this.inBrelan[index]) {
                        this.reserve[index] = false;

                        this.potentialScore -= this.getScore(this.dices[index], false);
                        if (this.dices[index] == 5) this.brelanFives--;
                        if (this.dices[index] == 1) this.brelanOnes--;
                        if (this.dices[index] == this.brelanType) {
                            for (var i in this.dices) {
                                if (this.reserve[i] && this.dices[i] == this.brelanType) this.reserve[i] = false;
                            }
                            this.brelanType = 0;
                        }

                        response = {can: true, reserve: this.reserve};
                    } else {
                        response = {can: false, reason: 'dice part of a brelan'};
                    }
                } else {
                    var br = this.brelan(index);

                    if (this.dices[index] == 5 || this.dices[index] == 1) {

                        this.reserve[index] = true;

                        this.potentialScore += this.getScore(this.dices[index], true);

                        response = {can: true, reserve: this.reserve, potentialScore: this.potentialScore};

                    } else if (br.in) {
                        this.brelanType = this.dices[index];

                        for (var i in br.pos) {
                            if (br.pos[i]) {
                                this.reserve[i] = br.pos[i];
                            }
                        }

                        this.potentialScore += this.getScore(this.dices[index], false);

                        response = {can: true, reserve: this.reserve};
                    } else {
                        response = {can: false, reason: 'not a marking dice'};
                    }
                }
            } else {
                response = {can: false, reason: 'dices not rolled yet'};
            }
        } else {
            response = {can: false, reason: 'not your turn'};
        }


        console.log('dices:', this.dices);
        console.log('reserve:', this.reserve);
        console.log('brelan:', this.inBrelan);
        console.log('brelan type:', this.brelanType);
        console.log('final:', this.potentialScore);

        return response;
    }
}
