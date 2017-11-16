var io;
var gameSocket;
var gameId = 'first room';
var playersIds = [];
var players = [];

class Player{
  constructor(id, value){
    this.id = id;
    this.value = value;
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
    gameSocket.join(gameId);

    // Player Events
    gameSocket.on('playerRoll', playerRoll);
}

//Generating a random integer
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playerRoll(){
  if (players.length < 2){
    if (!playersIds.includes(this.id)){
      playersIds.push(this.id);
      var player = new Player(this.id, getRandomIntInclusive(1,6));
      players.push(player);
      io.sockets.in(gameId).emit('playerRolled', player);
      if (players.length == 2){
        if (players[0].value < players[1].value){
          io.sockets.in(gameId).emit('duel', players[1].id);
        }
        else if (players[0].value > players[1].value){
          io.sockets.in(gameId).emit('duel', players[0].id);
        }
        else{
          io.sockets.in(gameId).emit('duel', -1);
        }
      }
    }
    else{
      io.sockets.in(gameId).emit('playerAlreadyRolled');
    }
  }
  else {
    io.sockets.in(gameId).emit('gameOver');
  }
}
