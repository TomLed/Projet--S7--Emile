// Make connection
var socket = io.connect('http://localhost:4000');

//Query DOM
var resultsWindow,
    $doc = $(document);

var gameId;
var playerName;

socket.on('connected', function (data){
  console.log(data.message);
  // Shows the subscription page
  $("#display-screen").html($("#join-game-template").html());
});

$doc.on('click', '#btnStart', function(){
  console.log('I clicked start!');
  data = {gameId: $('#inputGameId').val(), playerName: $('#inputPlayerName').val()};
  gameId = data.gameId;
  playerName = data.playerName;
  socket.emit('playerStart', data);
});

socket.on('playerJoinedRoom', function(data){
  //do something to the client side page
  console.log(data.playerName + ' joined the room');
});

socket.on('roomIsFull', function(){
  //starts the game
  console.log('Room is full!');
  $("#display-screen").html($("#play-game-template").html());
  resultsWindow = $("#results")[0];
});

$doc.on('click', '#btnRoll', function(){
  console.log('I clicked roll!');
  var data = {gameId: gameId, playerName: playerName};
  console.log(data);
  socket.emit('playerRoll', data);
});

$doc.on('click', '#btnGetResults', function(){
  console.log('I want results!');
  var data = {gameId: gameId, playerName: playerName};
  console.log(data);
  socket.emit('playerWantsResults', data);
});

socket.on('playerRolled', function (data){
  resultsWindow.innerHTML += '<p> Player ' + data.playerName + ' got a <strong>' + data.value + '</strong>!</p>'
});

socket.on('showResults', function(data){
  if (data.draw) {
    resultsWindow.innerHTML += "<p>It's a draw!</p>"
  }
  else {
    resultsWindow.innerHTML += '<p> Player ' + data.winnerName + ' won!</p>'
  }
});

socket.on('roomIsAlreadyFull', function(){
  alert('The room you wish to join is already full!');
})
