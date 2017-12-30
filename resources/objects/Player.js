module.exports = class {
    constructor(name, socket, index, room) {
        this.name = name;
        this.index = index;
        this.socket = socket;
        this.socket.player = this;
        this.setSocketFunctions();
        this.room = room;
    }

    refreshSocket(socket) {
        this.socket = socket;
        this.socket.player = this;
        this.socket.join(this.room.id);
        this.setSocketFunctions();
    }

    setSocketFunctions() {
        this.socket.on('roll dices', function() {
            this.player.rollDices();
        });

        this.socket.on('end turn', function(data) {
            this.player.nextPlayer(thisPlayerName);
        });

        this.socket.on('update dice', function(data) {
            this.player.updateDice(data.index);
        });

        this.socket.on('disconnect', function() {
            this.player.disconnect();
        });
    }

    rollDices() {
        var action = this.room.emile.rollDices(this);
        if (action.can) {
            this.room.io.to(this.room.id).emit('dices rolled', {coordinates: action.coordinates, faces: action.faces});
        } else {
            this.socket.emit('not allowed', {reason: action.reason});
        }

        // TODO
        // var action = this.room.emile.checkEnd(this);
        // could possibly fire .nextPlayer()
    }

    updateDice(index) {
        var action = this.room.emile.updateDice(this, index);
        if (action.can) {
            this.room.io.to(this.room.id).emit('dice updated', {reserve: action.reserve});
        } else {
            this.socket.emit('not allowed', {reason: action.reason});
        }
    }

    nextPlayer() {
        action = this.room.emile(this);
        if (action.can) {
            this.room.io.to(this.room.id).emit('next turn', {name: action.name});
        } else {
            this.socket.emit('not allowed', {reason: action.reason});
        }
    }

    disconnect() {
        console.log('lost connection with', this.name);
        delete this.socket;
    }
}
