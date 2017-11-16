// Make connection
var socket = io.connect('http://localhost:4000');

socket.on('connected', function (data){
  console.log(data.message);
});
socket.on('playerRolled', function (data){
  resultsWindow.innerHTML += '<p> Player n°' + data.id + ' got a <strong>' + data.value + '</strong>!</p>'
});

//Query DOM
var rollButton = $('#roll-button')[0],
    resultsWindow = $('#results')[0];

//Emit events
rollButton.addEventListener('click', function(){
  socket.emit('playerRoll');
});


//Listen to events

socket.on('duel', function(winnerId){
  if (winnerId == -1) {
    resultsWindow.innerHTML += "<p>It's a draw!</p>"
  }
  else {
    resultsWindow.innerHTML += '<p> Player n°' + winnerId + ' won!</p>'
  }
});

socket.on('playerAlreadyRolled', function(){
  alert('You already rolled the dice!');
});

socket.on('gameOver', function(){
  alert('The game is over!');
});
