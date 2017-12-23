module.exports = class{
    constructor(name, socket, room){
        this.room = room;
        this.name = name;
        this.socket = socket;
        this.socket.player = this;
        this.setSocketFunctions();
    }

    setSocket(socket){
        this.socket = socket;
        this.socket.player = this;
        this.setSocketFunctions();
    }

    setSocketFunctions(){
        this.socket.on('roll dices', function(thisPlayerName) {
            if (this.player.room.emile.currentPlayerName === thisPlayerName){
                this.player.rollDices();
            }
            else{
                this.player.socket.emit('not your turn', this.player.room.emile.currentPlayerName);
            }
        });
        this.socket.on('update points', function(data){
            if (data.playerAsking === this.player.room.emile.currentPlayerName){
                this.player.room.players[data.playerName].updatePoints(data.deltaScore);
            }
            else{
                this.player.socket.emit('not your turn', this.player.room.emile.currentPlayerName);
            }
        });
        this.socket.on('end turn', function(thisPlayerName){
            if (this.player.room.emile.currentPlayerName === thisPlayerName){
                this.player.room.emile.nextPlayer(thisPlayerName);
            }
            else{
                this.player.socket.emit('not your turn', this.player.room.emile.currentPlayerName);
            }

        });
        this.socket.on('want to add dice to reserve', function(data) {
            this.player.addToReserve(data.dice);
        });
        this.socket.on('want to remove dice from reserve', function(data) {
            this.player.removeFromReserve(data.dice);
        });
        this.socket.on('disconnect', function() {
            this.player.disconnect();
        });
    }

    rollDices(){
        this.room.emile.rollDices(this);
    }

    canRollDices(simulation){
        this.room.io.to(this.room.id).emit('dices rolled', simulation);
    }

    cannotRollDices(){
        this.socket.emit('not your turn');
    }

    addToReserve(dice){
        this.emile.addDice(dice);
    }

    removeFromReserve(data){
        this.emile.removeDice(data.dice);
    }

    updatePoints(deltaScore){
        if (!this.room.emile.scores[this.name]){
            this.room.emile.scores[this.name] = -2500;
        }
        this.room.emile.scores[this.name] += deltaScore;
        this.room.io.to(this.room.id).emit('points updated', {playerName: this.name, newScore: this.room.emile.scores[this.name]});
    }

    disconnect(){
        console.log('player', this.name, 'disconnected');
        delete this.socket;
    }
};
