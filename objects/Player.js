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
        this.socket.on('roll dices', function() {
            this.player.rollDices();
        });
        this.socket.on('update points', function(data){
            this.room.players[data.playerName].updatePoints(data.deltaScore);
        });
        this.socket.on('end turn', function(playerName){
            this.player.room.emile.nextPlayer(playerName);
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

    resume(){

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
        this.room.emile.scores[this.name] += deltaScore;
        this.room.io.to(this.room.id).emit('scores updated');
    }

    disconnect(){
        console.log('player', this.name, 'disconnected');
        delete this.socket;
    }
};
