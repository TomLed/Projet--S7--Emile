module.exports = class{
    constructor(name, socket, room){
        this.room = room;
        this.name = name;
        this.socket = socket;
        this.socket.player = this;
        this.score = -2500;
        this.setSocketFunctions();
        this.socket.emit('connected', {playerName: this.name, roomId: this.room.id});
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
        this.socket.on('want to add dice to reserve', function(data) {
            this.player.addToReserve(data.dice);
        });
        this.socket.on('want to remove dice from reserve', function(data) {
            this.player.removeFromReserve(data.dice);
        });
        this.socket.on('disconnect', function() {
            this.player.disconnect();
        });

        this.socket.on('modifie le score d un joueur', function(data) {
            var nomDuJoueur = data.name;
            var scoreAAjouter = data.score;

        })
    }

    resume(){

    }

    rollDices(){
        this.room.emile.rollDices(this);
    }

    canRollDices(simulation){
        this.socket.emit('dices rolled', simulation);
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

    disconnect(){
        console.log('player', this.name, 'disconnected');
        delete this.socket;
    }
};
