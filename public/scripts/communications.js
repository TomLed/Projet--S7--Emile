// Make connection
var socket = io.connect(window.location.origin);

function rollDices() {
    console.log('ASK TO ROLL DICES');
    socket.emit('roll dices');
}

function updatePoints(playerName, deltaScore){
    console.log('Ask to add or remove points to a player');
    socket.emit('update points', {playerName: playerName, deltaScore: deltaScore});
}

socket.on('dices rolled', function(data) {
    coordinates = data.coordinates;
    values = data.faces;
    for (i in dices) dices[i].updateValue(values[i]);
    resetSim();
});

socket.on('points updated', function(data){
    //do something to show the new points
})
