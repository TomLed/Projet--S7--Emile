// Make connection
var socket = io.connect(window.location.origin);


//Emitters
function rollDices(){
    console.log('ASK TO ROLL DICES');
    socket.emit('roll dices');
}

function updatePoints(playerName, deltaScore){
    console.log('Ask to add or remove points to a player');
    socket.emit('update points', {playerName: playerName, deltaScore: deltaScore});
}


//Listeners
socket.on('dices rolled', function(data) {
    coordinates = data.coordinates;
    values = data.faces;
    for (var i in dices) dices[i].updateValue(values[i]);
    resetSim();
});
