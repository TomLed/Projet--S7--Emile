//This additionnal function helps us to know if a player is in a room or not
module.exports = function (io, gameId, playerName){
    //If the room is not empty, check the name of every player
    if (io.nsps['/'].adapter.rooms[gameId]){
        var room = io.nsps['/'].adapter.rooms[gameId];
        var n = room.players.length;
        for (var i = 0; i < n; i++){
            if (room.players[i].name === playerName){
                return true;
            }
        }
    }
    return false; //This means the player is not part of the room
};
