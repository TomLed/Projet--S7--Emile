module.exports = class{
    constructor(id){
        this.id = id;
        this.players = [];
    }

    //This additionnal function helps us to know if a player is in a room or not
    getPlayerStatus(playerName){
    //If the room is not empty, check the name of every player
        if (this.players.length !== 0){
            var n = this.players.length;
            for (var i = 0; i < n; i++){
                if (this.players[i].name === playerName){
                    return true;
                }
            }
        }
        return false; //This means the player is not part of the room
    }

    /* This additionnal function helps us to know the position of the player we are interacting with in the players array. */
    getPlayerPosition(playerName){
        var n = this.players.length;
        for (var i = 0; i < n; i++){
            if (this.players[i].name === playerName){
                return i; //There is only one player with the name playerName in the room so it works just fine
            }
        }
    }
};
