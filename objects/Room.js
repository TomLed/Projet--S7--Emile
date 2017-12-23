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
        //When the last player joins the room, the first is set as the current player and the game can start
        if (this.playerNames.length === 4){
            this.emile.currentPlayerName = this.playerNames[0];
            this.io.to(this.id).emit('game can start', this.emile.currentPlayerName);
        }
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
