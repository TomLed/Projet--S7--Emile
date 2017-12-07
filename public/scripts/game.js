$(function(){
    // Make connection
    var socket = io.connect(window.location.origin);


    //Query DOM
    var resultsWindow,
        $doc = $(document);

    //Player variables
    var gameId;
    var playerName;


    //When the player's request has been processed by the server, a message is sent to the client console
    socket.on('playerJoinedRoom', function(data){
        //do something to the client side page
        console.log(data.playerName + ' joined the room');
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
});
