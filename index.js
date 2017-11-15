//Imports
var express = require('express');
var socket = require('socket.io');


//Generating a random integer
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Setting up the app
var app = express();

var server = app.listen(4000, function (){
  console.log('Currently listening to port 4000!')
});


//Static files
app.use(express.static('public'));


//Setting up the game
var game = {
  ids: [],
  values: []
};


//Setting up the socket
var io = socket(server);

io.on('connection', function (socket){
  if (!game.ids.includes(socket.id)) {
    game.ids.push(socket.id);
  };
  console.log('made socket connection!', socket.id);
  socket.on('roll', function(){
    if (game.values.length < 2) {
      var id = game.ids.indexOf(socket.id);
      var randomNumber = getRandomIntInclusive(1,6);
      var data = {playerId: id, number: randomNumber};
      game.values.push(data);
      io.sockets.emit('roll', data);
      if (game.values.length == 2) {
        var winnerId = 0;
        if (game.values[0].number == game.values[1].number) {
          winnerId = -1;
        }
        else if (game.values[0].number < game.values[1].number) {
          winnerId = game.values[1].playerId;
        }
        else {
          winnerId = game.values[0].playerId;
        }
        io.sockets.emit('duel', winnerId);
      }
    }
    else {
      socket.emit('gameOver');
    }
  });

});
