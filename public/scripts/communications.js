//Global variables
var thisPlayerName;
var opponentsNames = new Array(3).fill('');


// Make connection
var socket = io.connect(window.location.origin);


//Emitters
function rollDices() {
    console.log('ASK TO ROLL DICES');
    socket.emit('roll dices', thisPlayerName);
}

function updateDice(diceIndex) {
    socket.emit('update dice', {diceIndex: diceIndex});
}

socket.on('dice updated', function(data) {
    dices[data.diceIndex].update(data.inReserve);
});

function updatePoints(playerName, deltaScore){
    console.log('Ask to add or remove points to a player');
    socket.emit('update points', {playerName: playerName, deltaScore: deltaScore, playerAsking: thisPlayerName});
}

function endTurn(){
    console.log('Ask to end turn');
    socket.emit('end turn', thisPlayerName);
}


//Doers
socket.on('connected', function(data){
    thisPlayerName = data.playerName;
    var cookieContent = {playerName: data.playerName, roomId: data.roomId, url: window.location.origin};
    Cookies.set('alreadyConnectedOnce', '1');
    Cookies.set('playerName', cookieContent.playerName);
    Cookies.set('roomId', cookieContent.roomId);
    Cookies.set('url', cookieContent.url);
});

socket.on('game can start', function(currentPlayerName){
    $('#currentPlayerName').html(currentPlayerName);
    logger('Everyone is ready, the game can start');
});

//data = {opponentIndex: int, opponentName: string}
socket.on('opponent joined', function(data){
    opponents[data.opponentIndex].updateName(data.opponentName);
    opponentsNames[data.opponentIndex] = data.opponentName;
    logger(data.opponentName + ' has joined the game');
});

socket.on('dices rolled', function(data){
    coordinates = data.coordinates;
    values = data.faces;
    for (var i in dices) dices[i].updateValue(values[i]);
    resetSim();
});

socket.on('points updated', function(data){
    for (var i = 0; i < 3; i++){
        if (opponentsNames[i] == data.playerName){
            opponents[i].updateScore(data.newScore);
        }
    }

    if (data.playerName == thisPlayerName)
        ui.updateScore(data.newScore);
});

socket.on('next turn', function(currentPlayerName){
    $('#currentPlayerName').html(currentPlayerName);
    logger('The new current player ' + currentPlayerName + ' can play while the others cannot anymore');
});

socket.on('not your turn', function(currentPlayerName){
    logger('Not your turn!');
});
