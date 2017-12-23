var Emile = require('./Emile');
var Player = require('./Player');

module.exports = class{
    constructor(id, io){
        this.id = id;
        this.players = {};
        this.playerNames = [];
        this.number = 0;
        this.emile = new Emile(this);
        this.io = io;
    }

    getPlayer(playerName){
        return this.players[this.getPlayerPosition(playerName)];
    }

    addPlayer(name, socket){
        this.players[name] = new Player(name, socket, this);
        this.playerNames.push(name);
        this.number++;
        console.log('Player', name, 'added with socket id', this.players[name].socket.id, 'in room', this.id);
        this.players[name].socket.join(this.id);
        this.players[name].socket.emit('connected', {playerName: this.players[name].name, roomId: this.players[name].room.id});
    }

    resumePlayer(name, socket){
        this.players[name].setSocket(socket);
        console.log('Player', name, 'resumed with socket id', this.players[name].socket.id, 'in room', this.id);
        this.players[name].socket.join(this.id);
        this.players[name].socket.emit('connected', {playerName: this.players[name].name, roomId: this.players[name].room.id});
    }

    isFull(){
        return this.number >= 4;
    }
};
