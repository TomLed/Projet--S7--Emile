// Make connection
var socket = io.connect('http://localhost:4000');


//Query DOM
var resultsWindow,
    playerWaitingMessage,
    $doc = $(document);

//Player variables
var gameId;
var playerName;
var _diceValue = 0; //Necessary to display the correct dice value in three js canvas

//When the player connects to the website, the form is displayed on the web page and a message is sent to the client console
socket.on('connected', function (data){
    console.log(data.message);
    var cookie;
    //if there is a cookie of a previously played game
    if (Cookies.getJSON('playerData')){
        console.log('There is a cookie!');
        //Get the cookie
        cookie = Cookies.getJSON('playerData');
        //ALWAYS SAVE THE STATE IN THE FRONT-END, WOULD BE HELPFUL TO HAVE A SAVE STATE METHOD/FUNCTION
        gameId = cookie.gameId;
        playerName = cookie.playerName;
        if (confirm('You have already a game going in the room ' + cookie.gameId + ' with the name ' + cookie.playerName + '. Do you want to resume this game?')){
            socket.emit('playerResume', cookie);
        }
    }
    //Show the subscription page
    $('#display-screen').html($('#join-game-template').html());
    playerWaitingMessage = $('#playerWaitingMessage')[0];
});

//When the start button is clicked, a 'playerStart' event is sent to the server with data on the player
$doc.on('click', '#btnStart', function(){
    var data = {gameId: $('#inputGameId').val(), playerName: $('#inputPlayerName').val()};
    //Before we start the game, we need to check if the player typed something in the two inputs
    if (data.gameId === ''){
        alert('Please type a room name!');
    }
    else if(data.playerName === ''){
        alert('Please type a player name!');
    }
    else{
        gameId = data.gameId;
        playerName = data.playerName;
        socket.emit('playerStart', data);
    }
});

//When the player's request has been processed by the server, a message is sent to the client console
socket.on('playerJoinedRoom', function(data){
    //do something to the client side page
    console.log(data.playerName + ' joined the room');
    playerWaitingMessage.innerHTML += '<p>' + data.playerName + ' joined the room ' + data.gameId + '.<br>Waiting for another player.</p>';
    playerWaitingMessage.scrollTop = playerWaitingMessage.scrollHeight;
});

//When the room has 2 players in it, the game interface is displayed
socket.on('roomIsFull', function(data){
    Cookies.set('playerData', data);
    console.log('Room is full!');
    $('#display-screen').html($('#play-game-template').html());
    resultsWindow = $('#results')[0];
});

socket.on('playerResume', function(){
    console.log('I resumed!');
    $('#display-screen').html($('#play-game-template').html());
    resultsWindow = $('#results')[0];
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
    var data = {gameId: $('#inputGameId').val(), playerName: $('#inputPlayerName').val()};
    if (data.gameId === ''){
        alert('Please type a room name!');
    }
    else if(data.playerName === ''){
        alert('Please type a player name!');
    }
    else{
        gameId = data.gameId;
        playerName = data.playerName;
        socket.emit('playerResume', data);
    }
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
    _diceValue = data.value; // Needed to display the dice value in three js
    resultsWindow.innerHTML += '<p> Player ' + data.playerName + ' got a <strong>' + data.value + '</strong>!</p>';
    resultsWindow.scrollTop = resultsWindow.scrollHeight;
});

//When the duel has been processed by the server, it sends back the name of the winner which can be displayed on the client's screen
socket.on('showResults', function(data){
    if (data.draw) {
        resultsWindow.innerHTML += '<p>It\'s a draw!</p>';
    }
    else {
        resultsWindow.innerHTML += '<p> Player ' + data.winnerName + ' won!</p>';
    }
    resultsWindow.scrollTop = resultsWindow.scrollHeight;
});

//When a third player tries to join the room, it sends him an alert
socket.on('roomIsAlreadyFull', function(){
    alert('The room you wish to join is already full!');
});

//When a third player tries to join the room, it sends him an alert
socket.on('changeName', function(data){
    alert('Someone is already named ' + data.playerName + ' in the room you wish to join!');
});

socket.on('notInThisRoom', function(data){
    alert('There is no player named ' + data.playerName + ' in the room ' + data.gameId + '!');
});

socket.on('alreadyInTheRoom', function(data){
    alert('Player ' + data.playerName + ' is already in the room ' + data.gameId + '. You cannot resume a game you are still playing in.');
});
