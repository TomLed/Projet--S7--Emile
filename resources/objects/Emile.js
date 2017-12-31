/* TODO list

tix
fin de jeu
retirer ou relancer que si nv score reserve > score reserve actuel

*/


var PHYSICS = require('./../javascript/physics');

module.exports = class {
    constructor(room) {
        this.room = room;
        this.scores = new Array(4).fill(-2500);
        this.dices = new Array(5).fill(0);
        this.reserve = new Array(5).fill(false);
        this.inBrelan = new Array(5).fill(false);
        this.currentPlayer;
        this.potentialScore = 0;
        this.deubeul = false;
        this.tix = false;
        this.stuck = false;
        this.brelanOnes = 0;
        this.brelanFives = 0;
        this.brelanType = 0;
        this.inStraight = false;
    }

    updateScore(player, name) {
        if (player == this.currentPlayer) {

            // TODO if game over...

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

    // Called once a 2, 3, 4 or 6 is clicked
    brelan(index) {

        // Add the clicked dices to a temp reserve named positions
        var count = 0, positions = [];
        positions[index] = true;
        for (var i in this.dices) {
            if (this.dices[i] == this.dices[index] && !this.reserve[i] && i != index) {
                positions[i] = true;
                count++;
            }
            if (count == 2) break;
        }

        // If there are the same 3 dices in the temp reserve, we tell there's a brelan
        if (count == 2) return {in: true, pos: positions};
        return {in: false};
    }

    straight() {
        // We check if the dices array contains 1, 2, 3, 4, 5 or 2, 3, 4, 5, 6
        for (var i in this.reserve) if (this.reserve[i]) return {in: false};

        return {in: (this.dices.includes(1) && this.dices.includes(2) && this.dices.includes(3) && this.dices.includes(4) && this.dices.includes(5)) ||
                    (this.dices.includes(6) && this.dices.includes(2) && this.dices.includes(3) && this.dices.includes(4) && this.dices.includes(5))};
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
            case 'straight': total = 1000; break;
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
        this.deubeul = false;

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

        if (player == this.currentPlayer) {
            var reserveFull = true;

            //Deubeul
            var reserveLength = 0;
            for (var i in this.reserve) {
                if (this.reserve[i]) reserveLength++;
            }

            if (reserveLength == 5 && this.deubeul) {
                console.log('NEW ROLL');
                this.reserve.fill(false);
                this.inBrelan.fill(false);
                this.brelanOnes = 0;
                this.brelanFives = 0;
                this.brelanType = 0;
                this.deubeul = false;
            }

            if (reserveLength == 4) {
                this.deubeul = true;
            } else {
                this.deubeul = false;
            }

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

                return {can: true, coordinates: roll.coordinates, faces: this.dices, reserve: this.reserve};
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
        var response = {};

        // TODO must add all check about score : if new score < prev score, can't change

        if (player == this.currentPlayer) {
            if (this.dices[index]) {
                if (this.reserve[index]) {
                    if (this.inStraight) {
                        this.potentialScore -= this.getScore('straight', false);
                        this.inStraight = false;
                        this.reserve.fill(false);
                        response = {can: true, reserve: this.reserve};
                    } else if (!this.inBrelan[index]) {
                        this.reserve[index] = false;

                        if (this.deubeul) this.potentialScore /= 2;
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
                    var st = this.straight();

                    // To change priority of combinations, juste change the order in the following if else if
                    if (this.dices[index] == 5 || this.dices[index] == 1) {

                        this.reserve[index] = true;

                        this.potentialScore += this.getScore(this.dices[index], true);
                        if (this.deubeul) this.potentialScore *= 2;

                        if (br.in) response.tip = 'brelan available, 1 & 5 priority';
                        if (st.in) response.tip = 'straight available, 1 & 5 priority';
                        if (this.deubeul) response.tip = 'deubeul successful! roll again';

                        response = {can: true, reserve: this.reserve};

                    } else if (br.in) {
                        this.brelanType = this.dices[index];

                        for (var i in br.pos) this.reserve[i] = br.pos[i];

                        this.potentialScore += this.getScore(this.dices[index], false);

                        response = {can: true, reserve: this.reserve};
                    } else if (st.in) {
                        this.reserve.fill(true);
                        this.inStraight = true;
                        this.potentialScore += this.getScore('straight');
                        response = {can: true, reserve: this.reserve};
                    } else {
                        if (this.deubeul) {
                            this.potentialScore = 0;
                            this.deubeul = false;
                        }

                        response = {can: false, reason: 'not a marking dice'};
                    }
                }
            } else {
                response = {can: false, reason: 'dices not rolled yet'};
            }
        } else {
            response = {can: false, reason: 'not your turn'};
        }

        if (response.can) response.potentialScore = this.potentialScore;

        console.log('dices:', this.dices);
        console.log('reserve:', this.reserve);
        console.log('brelan:', this.inBrelan);
        console.log('brelan type:', this.brelanType);
        console.log('final:', this.potentialScore);

        return response;
    }
}
