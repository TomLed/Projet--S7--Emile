function rollDices() {
    socket.emit('roll dices');
}

function updateDice(index) {
    socket.emit('update dice', {index: index});
}

function addSelf(name, index, score) {
    player = new Player(name, index, score);
}

function addPlayer(name, index, score) {

    function setPosition(current, index) {
        if (index > current) index--;

        if (index == 0) {
            return {x: -2, y: 1, z: 0};
        } else if (index == 1) {
            return {x: 2, y: 1, z: 0};
        } else {
            return {x: 0, y: 1, z: -2};
        }
    }

    if (opponents[name]) scene.remove(opponents[name]);
    opponents[name] = new Opponent(name, index, score);

    var pos = setPosition(player.index, index);
    opponents[name].position.set(pos.x, pos.y, pos.z);

    scene.add(opponents[name]);

}

function resetSim() {
    simStep = 0;
    simRunning = true;
}

function updateSim() {
    if (simStep < coordinates.length) {

        var sequence = coordinates[simStep];

        var j = 0;
        for (i in dices) {
            if (!dices[i].reserve) {
                dices[i].position.copy(sequence[i].p);
                dices[i].quaternion.copy(sequence[i].q);
                j++;
            }
        }

        simStep++;
    } else {
        simRunning = false;
    }
}

function logger(message) {
    //$('#logger').html(message);
    $("#logger").fadeOut(100, function() {
      $(this).text(message)
  }).fadeIn(100);
}

function updateIntersected() {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    intersected = intersects.length > 0 ? intersects[0].object : undefined;

    if (intersected) {
        if (latest) if (latest.setEmissive) latest.setEmissive({r: 0, g: 0, b: 0});
        latest = intersected;
         if (intersected.setEmissive) intersected.setEmissive(emission);
    } else {
        if (latest) if (latest.setEmissive) latest.setEmissive({r: 0, g: 0, b: 0});
    }
}




























// End
