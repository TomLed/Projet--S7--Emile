var io, gameSocket, playerName, roomId, game;

//We define a player object
class Player{
    //Information on the player and the game he's playing
    constructor(id, name, gameId){
        this.id = id;
        this.name = name;
        this.game = gameId;
        this.value = 0;
    }

    //The roll method rolls the dice, stores its value in the object and returns it
    roll(){
        this.value = getRandomIntInclusive(1,6);
        return this.value;
    }

    //The setId method changes the socket id of the player
    setId(newId){
        this.id = newId;
    }
}

/**
 * This function is called by app.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 * @param _playerName The nickname of the player
 * @param _roomId The id of the room the player will play in
 * @param _game The game object contains all the rooms in the game
 */
exports.initGame = function(sio, socket, _playerName, _roomId, _game){
    io = sio;
    gameSocket = socket;
    game = _game;

    if (!_game.getRoom(_roomId).getPlayerStatus(_playerName)){
        playerName = _playerName;
        roomId = _roomId;
        gameSocket.emit('connected', {playerName: playerName, gameId: roomId});

        //Fire the playerStart function
        playerStart();

        // Player Events
        gameSocket.on('playerResume', playerResume);
        gameSocket.on('playerRoll', playerRoll);
        gameSocket.on('playerWantsResults', playerShowResults);
    }
    else{
        console.log('Bis repetita');
    }
};

exports.reinitGame = function(sio, socket, _playerName, _roomId, _game){
    io = sio;
    gameSocket = socket;
    playerName = _playerName;
    roomId = _roomId;
    game = _game;

    gameSocket.emit('connected', {playerName: playerName, gameId: roomId});

    //Fire the playerStart function
    playerResume();

    // Player Events
    gameSocket.on('playerResume', playerResume);
    gameSocket.on('playerRoll', playerRoll);
    gameSocket.on('playerWantsResults', playerShowResults);
};

//Generating a random integer between min and max
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//This function is fired when a player clicks the 'Start' button
function playerStart(){
    var data = {playerName: playerName, gameId: roomId};
    console.log('Player ' + data.playerName + ' attempting to join game: ' + data.gameId);

    //If there is currently zero or one player in the room
    if (game.getRoom(roomId).players.length < 2){
        gameSocket.join(data.gameId); //add this player to the room

        var player = new Player(gameSocket.id, data.playerName, data.gameId); //created a player object for this player

        game.getRoom(roomId).players.push(player); //adds the player to the players' list

        console.log('Player ' + data.playerName + ' joining game: ' + data.gameId );

        // Emit an event notifying the clients that the player has joined the room.
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);

        if (game.getRoom(roomId).players.length == 2){ //if the room is full
            io.sockets.in(data.gameId).emit('roomIsFull', data); //emit the roomIsFull event to start the game
            console.log('Room is full!');
        }
        else{
            console.log('Room is not full!');
        }
    }
    else{
        gameSocket.emit('roomIsAlreadyFull'); //if there are already 2 players in the room, emit the roomIsAlreadyFull event
    }
}

//This function puts the player back in the game
function playerResume(){
    var data = {playerName: playerName, gameId: roomId};
    console.log('Player ' + data.playerName + ' attempting to rejoin game: ' + data.gameId);

    var playerPosition = game.getRoom(roomId).getPlayerPosition(data.playerName); //we get the player position in the array

    gameSocket.join(data.gameId);
    game.getRoom(roomId).players[playerPosition].setId(gameSocket.id);
    console.log('Player ' + data.playerName + ' rejoining game: ' + data.gameId);
    gameSocket.emit('playerResume');
}

//This function rolls the dice and sends back its value to the client
function playerRoll(data){
    var playerPosition = game.getRoom(roomId).getPlayerPosition(data.playerName); //we get the player position in the array
    data.value = game.getRoom(roomId).players[playerPosition].roll(); //and knowing its position we can get the player to use its roll method
    io.sockets.in(data.gameId).emit('playerRolled', data);
}

//This function show the final result of the duel when the 'Show results' button is clicked
function playerShowResults(data){
    if (game.getRoom(roomId).players[0].value == game.getRoom(roomId).players[1].value){ //if the values of the two dices are identical
        data.draw = true; //it's a draw
    }
    //else we determine which one is the winner
    else if (game.getRoom(roomId).players[0].value < game.getRoom(roomId).players[1].value){
        data.winnerName = game.getRoom(roomId).players[1].name;
    }
    else{
        data.winnerName = game.getRoom(roomId).players[0].name;
    }
    this.emit('showResults', data); //and we throw the data back to the client
}
