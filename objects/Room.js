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

    getPlayerPosition(name){
        for (var i = 0; i < 4; i++){
            if (this.playerNames[i] === name){
                return i;
            }
        }
        return -1;
    }

    addPlayer(name, socket){
        this.players[name] = new Player(name, socket, this);
        this.playerNames.push(name);
        this.number++;
        console.log('Player', name, 'added with socket id', this.players[name].socket.id, 'in room', this.id);
        this.players[name].socket.join(this.id);
        this.players[name].socket.emit('connected', {playerName: this.players[name].name, roomId: this.players[name].room.id});
        //Opponents management
        if (this.playerNames.length === 2){ //If this is the second player joining
            this.players[this.playerNames[0]].socket.emit('opponent joined', {opponentIndex: 0, opponentName: name});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 2, opponentName: this.playerNames[0]});
        }
        else if (this.playerNames.length === 3){ //If this is the third player joining
            this.players[this.playerNames[0]].socket.emit('opponent joined', {opponentIndex: 1, opponentName: name});
            this.players[this.playerNames[1]].socket.emit('opponent joined', {opponentIndex: 0, opponentName: name});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 1, opponentName: this.playerNames[0]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 2, opponentName: this.playerNames[1]});
        }
        else if (this.playerNames.length === 4){ //If this is the fourth player joining
            this.players[this.playerNames[0]].socket.emit('opponent joined', {opponentIndex: 2, opponentName: name});
            this.players[this.playerNames[1]].socket.emit('opponent joined', {opponentIndex: 1, opponentName: name});
            this.players[this.playerNames[2]].socket.emit('opponent joined', {opponentIndex: 0, opponentName: name});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 0, opponentName: this.playerNames[0]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 1, opponentName: this.playerNames[1]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 2, opponentName: this.playerNames[2]});
            //When the last player joins the room, the first is set as the current player and the game can start
            this.emile.currentPlayerName = this.playerNames[0];
            this.io.to(this.id).emit('game can start', this.emile.currentPlayerName);
        }
    }

    resumePlayer(name, socket){
        this.players[name].setSocket(socket);
        console.log('Player', name, 'resumed with socket id', this.players[name].socket.id, 'in room', this.id);
        this.players[name].socket.join(this.id);
        this.players[name].socket.emit('connected', {playerName: this.players[name].name, roomId: this.players[name].room.id});
        //Load the names of the opponents
        var playerPosition = this.getPlayerPosition(name);
        if (playerPosition === 0){
            this.players[name].socket.emit('opponent joined', {opponentIndex: 0, opponentName: this.playerNames[1]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 1, opponentName: this.playerNames[2]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 2, opponentName: this.playerNames[3]});
        }
        else if (playerPosition === 1){
            this.players[name].socket.emit('opponent joined', {opponentIndex: 0, opponentName: this.playerNames[2]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 1, opponentName: this.playerNames[3]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 2, opponentName: this.playerNames[0]});
        }
        else if (playerPosition === 2){
            this.players[name].socket.emit('opponent joined', {opponentIndex: 0, opponentName: this.playerNames[3]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 1, opponentName: this.playerNames[0]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 2, opponentName: this.playerNames[1]});
        }
        else if (playerPosition === 3){
            this.players[name].socket.emit('opponent joined', {opponentIndex: 0, opponentName: this.playerNames[0]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 1, opponentName: this.playerNames[1]});
            this.players[name].socket.emit('opponent joined', {opponentIndex: 2, opponentName: this.playerNames[2]});
        }
    }

    isFull(){
        return this.number >= 4;
    }
};
