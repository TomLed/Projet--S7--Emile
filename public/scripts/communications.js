//Global variables
var thisPlayerName;


// Make connection
var socket = io.connect(window.location.origin);

//Emitters
function rollDices() {
    console.log('ASK TO ROLL DICES');
    socket.emit('roll dices');
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
})

socket.on('dices rolled', function(data) {
    coordinates = data.coordinates;
    values = data.faces;
    for (i in dices) dices[i].updateValue(values[i]);
    resetSim();
});

socket.on('points updated', function(data){
    //do something to show the new points
});

socket.on('next turn', function(currentPlayerName){
    //do something to allow the current player to play
    console.log('The new current player ' + currentPlayerName + ' can play while the others cannot anymore');
});
