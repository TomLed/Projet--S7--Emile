function initConnection() {
    socket = io.connect(window.location.origin);

    socket.on('connected', function(data) {
        for (var i in dices) dices[i].updateReserve(data.reserve[i]);
        logger('connected');
        ui.updateScore(data.score);
        addSelf(data.name, data.index, data.score);
    });

    socket.on('end turn', function(data) {
        // Opponents scores updating
        for (var i in opponents) {
            opponents[i].updateScore(data.scores[opponents[i].index]);
        }
        // Player score updating
        player.score = data.scores[player.index];
        ui.updateScore(player.score);
        // Next turn
        $('#current-player').html(data.currentPlayerName);
    });

    socket.on('opponent joined', function(data) {
        logger(data.name + ' joined at position ' + data.index);
        addPlayer(data.name, data.index, data.score);
    });

    socket.on('game can start', function(data) {
        $('#current-player').html(data.current);
        logger('game can start');
    });

    socket.on('dices rolled', function(data) {
        logger('dices rolled');
        coordinates = data.coordinates;
        for (var i in dices) dices[i].value = data.faces[i];
        resetSim();
    });

    socket.on('not allowed', function(data) {
        logger(data.reason);
    });

    socket.on('dice updated', function(data) {
        for (var i in dices) dices[i].updateReserve(data.reserve[i]);
        logger('dice updated');
    });

    socket.on('cannot play anymore', function(data) {
        setTimeout(function() { logger('You cannot play anymore'); }, 2000);

        setTimeout(function() { logger('Please affect your 100 points'); }, 4000);
    });
}
