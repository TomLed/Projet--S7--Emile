var Emile = require('./Emile');
var Player = require('./Player');

module.exports = class{
    constructor(id){
        this.id = id;
        this.players = {};
        this.number = 0;
        this.emile = new Emile(this);
    }

    getPlayer(playerName){
        return this.players[this.getPlayerPosition(playerName)].name;
    }

    addPlayer(name, socket){
        this.players[name] = new Player(name, socket, this);
        this.number++;
        console.log('Player', name, 'added with socket id', this.players[name].socket.id, 'in room', this.id);
    }

    resumePlayer(name, socket){
        this.players[name].setSocket(socket);
        console.log('Player', name, 'resumed with socket id', this.players[name].socket.id, 'in room', this.id);
    }

    isFull(){
        return this.number >= 4;
    }
};
