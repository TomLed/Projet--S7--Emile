var io;
var gameSocket;

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
 */
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Player Events
    gameSocket.on('playerStart', playerStart);
    gameSocket.on('playerResume', playerResume);
    gameSocket.on('playerRoll', playerRoll);
    gameSocket.on('playerWantsResults', playerShowResults);
}

//Generating a random integer between min and max
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//This additionnal function helps us to know the position of the player we are interacting with in the players array.
function getPlayerPosition(gameId, playerName){
  var room = io.nsps['/'].adapter.rooms[gameId];
  if (room.players[0].name === playerName){
    return 0;
  }
  else if(room.players[1].name === playerName){
    return 1;
  }
  else{
    return -1; //This means the player is not part of the room
  }
}

//This function is fired when a player clicks the 'Start' button
function playerStart(data){
  console.log('Player ' + data.playerName + ' attempting to join game: ' + data.gameId );

  //If there is currently zero or one player in the room
  if (!io.nsps['/'].adapter.rooms[data.gameId] || io.nsps['/'].adapter.rooms[data.gameId].length < 2){

    if (io.nsps['/'].adapter.rooms[data.gameId] && getPlayerPosition(data.gameId, data.playerName) !== -1){
      this.emit('changeName', data);
    }
    else{
      this.join(data.gameId); //add this player to the room

      var player = new Player(this.id, data.playerName, data.gameId); //created a player object for this player

      var room = io.nsps['/'].adapter.rooms[data.gameId]; //stores the room into a variable
      if (!room.players){
        room.players = []; //creates an array with all the players in the room
      }
      room.players.push(player); //adds the player to the players' list

      console.log('Player ' + data.playerName + ' joining game: ' + data.gameId );

      // Emit an event notifying the clients that the player has joined the room.
      io.sockets.in(data.gameId).emit('playerJoinedRoom', data);

      if (room.length == 2){ //if the room is full
        io.sockets.in(data.gameId).emit('roomIsFull'); //emit the roomIsFull event to start the game
        console.log('Room is full!');
      }
      else{
        console.log('Room is not full!');
      }
    }
    }
  else{
    this.emit('roomIsAlreadyFull'); //if there are already 2 players in the room, emit the roomIsAlreadyFull event
  }
}

function playerResume(data){
  console.log('Player ' + data.playerName + ' attempting to join game: ' + data.gameId);
  if (!io.nsps['/'].adapter.rooms[data.gameId]){
    this.emit('notInThisRoom');
  }
  var room = io.nsps['/'].adapter.rooms[data.gameId]; //stores the room into a variable
  var playerPosition = getPlayerPosition(data.gameId, data.playerName); //we get the player position in the array
  if (playerPosition === -1){
    this.emit('notInThisRoom');
  }
  else{
    this.join(data.gameId);
    room.players[playerPosition].setId(this.id);
    console.log('Player ' + data.playerName + ' rejoining game: ' + data.gameId);
    this.emit('playerResume');
  }
}

//This function rolls the dice and sends back its value to the client
function playerRoll(data){
  var playerPosition = getPlayerPosition(data.gameId, data.playerName); //we get the player position in the array
  var room = io.nsps['/'].adapter.rooms[data.gameId]; //we get the room
  data.value = room.players[playerPosition].roll(); //and knowing its position we can get the player to use its roll method
  io.sockets.in(data.gameId).emit('playerRolled', data);
}

function playerShowResults(data){
  var room = io.nsps['/'].adapter.rooms[data.gameId];
  if (room.players[0].value == room.players[1].value){ //if the values of the two dices are identical
    data.draw = true; //it's a draw
  }
  //else we determine which one is the winner
  else if (room.players[0].value < room.players[1].value){
    data.winnerName = room.players[1].name;
  }
  else{
    data.winnerName = room.players[0].name;
  }
  this.emit('showResults', data); //and we throw the data back to the client
}
