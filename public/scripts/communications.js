//Global variables
var thisPlayerName;


// Make connection
var socket = io.connect(window.location.origin);

//Emitters
function rollDices() {
    console.log('ASK TO ROLL DICES');
    socket.emit('roll dices', thisPlayerName);
}

function updatePoints(playerName, deltaScore){
    console.log('Ask to add or remove points to a player');
    socket.emit('update points', {playerName: playerName, deltaScore: deltaScore});
}

function endTurn(){
    console.log('Ask to end turn');
    socket.emit('end turn', thisPlayerName);
}


//Doers
socket.on('connected', function(data){
    thisPlayerName = data.playerName;
});

socket.on('game can start', function(currentPlayerName){
    $('#currentPlayerName').html(currentPlayerName);
});

//data = {opponentIndex: int, opponentName: string}
socket.on('opponent joined', function(data){
    console.log('opponent ' + data.opponentName + ' added in position ' + data.opponentIndex);
    console.log(opponents[data.opponentIndex]);
    opponents[data.opponentIndex].updateName(data.opponentName);
});

socket.on('dices rolled', function(data){
    coordinates = data.coordinates;
    values = data.faces;
    for (var i in dices) dices[i].updateValue(values[i]);
    resetSim();
});

socket.on('points updated', function(data){
    //do something to show the new points
    /* for (i in opponents) */
});

socket.on('next turn', function(currentPlayerName){
    $('#currentPlayerName').html(currentPlayerName);
    console.log('The new current player ' + currentPlayerName + ' can play while the others cannot anymore');
});

socket.on('not your turn', function(currentPlayerName){
    console.log('Not your turn!')
});
