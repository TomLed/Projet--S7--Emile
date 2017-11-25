// Make connection
var socket = io.connect('http://localhost:4000');

var diceValue = 0; //Necessary for displaying the correct dice value in three js canvas

//Query DOM
var resultsWindow,
    playerWaitingMessage,
    $doc = $(document);

//Player variables
var gameId;
var playerName;

//When the player connects to the website, the form is displayed on the web page and a message is sent to the client console
socket.on('connected', function (data){
  console.log(data.message);
  // Shows the subscription page
  $("#display-screen").html($("#join-game-template").html());
  playerWaitingMessage = $("#playerWaitingMessage")[0];
});

//When the start button is clicked, a 'playerStart' event is sent to the server with data on the player
$doc.on('click', '#btnStart', function(){
  data = {gameId: $('#inputGameId').val(), playerName: $('#inputPlayerName').val()};
  gameId = data.gameId;
  playerName = data.playerName;
  socket.emit('playerStart', data);
});

//When the player's request has been processed by the server, a message is sent to the client console
socket.on('playerJoinedRoom', function(data){
  //do something to the client side page
  console.log(data.playerName + ' joined the room');
  playerWaitingMessage.innerHTML += '<p>' + data.playerName + ' joined the room ' + data.gameId + '.<br>Waiting for another player.</p>'
  playerWaitingMessage.scrollTop = playerWaitingMessage.scrollHeight;
});

//When the room has 2 players in it, the game interface is displayed
socket.on('roomIsFull', function(){
  console.log('Room is full!');
  $("#display-screen").html($("#play-game-template").html());
  resultsWindow = $("#results")[0];
});

socket.on('playerResume', function(){
  console.log('I resumed!');
  $("#display-screen").html($("#play-game-template").html());
  resultsWindow = $("#results")[0];
});

//When the roll button is clicked, a 'playerRoll' event is sent to the server
$doc.on('click', '#btnRoll', function(){
  console.log('I clicked roll!');
  var data = {gameId: gameId, playerName: playerName};
  console.log(data);
  socket.emit('playerRoll', data);
});

//When the resume button is clicked, a 'playerResume' event is sent to the server
$doc.on('click', '#btnResume', function(){
  console.log('I clicked resume!');
  data = {gameId: $('#inputGameId').val(), playerName: $('#inputPlayerName').val()};
  gameId = data.gameId;
  playerName = data.playerName;
  socket.emit('playerResume', data);
});

//When the get results button is clicked, a 'playerWantsResults' event is sent to the server
$doc.on('click', '#btnGetResults', function(){
  console.log('I want results!');
  var data = {gameId: gameId, playerName: playerName};
  console.log(data);
  socket.emit('playerWantsResults', data);
});

//When the dice has been rolled by the server, it sends back its value which can be displayed on the client's screen
socket.on('playerRolled', function (data){
  diceValue = data.value; // Needed for displaying dice value in three js
  resultsWindow.innerHTML += '<p> Player ' + data.playerName + ' got a <strong>' + data.value + '</strong>!</p>';
  resultsWindow.scrollTop = resultsWindow.scrollHeight;
});

//When the duel has been processed by the server, it sends back the name of the winner which can be displayed on the client's screen
socket.on('showResults', function(data){
  if (data.draw) {
    resultsWindow.innerHTML += "<p>It's a draw!</p>"
  }
  else {
    resultsWindow.innerHTML += '<p> Player ' + data.winnerName + ' won!</p>'
  }
  resultsWindow.scrollTop = resultsWindow.scrollHeight;
});

//When a third player tries to join the room, it sends him an alert
socket.on('roomIsAlreadyFull', function(){
  alert('The room you wish to join is already full!');
})

//When a third player tries to join the room, it sends him an alert
socket.on('changeName', function(data){
  alert('Someone is already named ' + data.playerName + ' in the room you wish to join!');
})
