var io;
var gameSocket;
var playersIds = [];
var players = [];

class Player{
  constructor(id, name, gameId){
    this.id = id;
    this.name = name;
    this.game = gameId;
    this.value = 0;
  }

  roll(){
    this.value = getRandomIntInclusive(1,6);
    return this.value;
  }
}

/**
 * This function is called by index.js to initialize a new game instance.
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
    gameSocket.on('playerRoll', playerRoll);
    gameSocket.on('playerWantsResults', playerShowResults);
}

//Generating a random integer
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playerStart(data){
  console.log('Player ' + data.playerName + ' attempting to join game: ' + data.gameId );

  var player = new Player(this.id, data.playerName, data.gameId);

  // Join the room
  this.join(data.gameId);

  // Look up the room ID in the Socket.IO manager object.
  var room = io.nsps['/'].adapter.rooms[data.gameId];
  if (!room.players){
    room.players = [];
  }
  room.players.push(player);
  console.log(room.players);

  console.log('Player ' + data.playerName + ' joining game: ' + data.gameId );

  // Emit an event notifying the clients that the player has joined the room.
  io.sockets.in(data.gameId).emit('playerJoinedRoom', data);

  if (room.length == 2){
    io.sockets.in(data.gameId).emit('roomIsFull');
    console.log('Room is full!');
  }
  else{
    console.log('Room is not full!');
  }

}

function getPlayerPosition(gameId, id){
  var room = io.nsps['/'].adapter.rooms[gameId];
  if (room.players[0].id === id){
    return 0;
  }
  else{
    return 1;
  }
}

function playerRoll(data){
  var playerPosition = getPlayerPosition(data.gameId, this.id);
  var room = io.nsps['/'].adapter.rooms[data.gameId];
  data.value = room.players[playerPosition].roll();
  io.sockets.in(data.gameId).emit('playerRolled', data);
}

function playerShowResults(data){
  var room = io.nsps['/'].adapter.rooms[data.gameId];
  if (room.players[0].value == room.players[1].value){
    data.draw = true;
  }
  else if (room.players[0].value < room.players[1].value){
    data.winnerName = room.players[1].name;
  }
  else{
    data.winnerName = room.players[0].name;
  }
  this.emit('showResults', data);
}
