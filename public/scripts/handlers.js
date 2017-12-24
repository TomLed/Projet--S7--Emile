//START

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = - event.clientY / window.innerHeight * 2 + 1;
}

function onDocumentMouseDown(event) {

    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.edgeThickness = 2;

    timer = Date.now();
}

function onDocumentMouseUp(event) {

    var intersects = raycaster.intersectObjects(scene.children, true);

    if (Date.now() < timer + 500) {
        console.log('CLICK LOGGED');
        if (intersects.length > 0) {
            var intersected = intersects[0].object;
            if (intersected) {
                if (intersected == ui.roll)
                    rollDices();
                if (intersected == ui.end)
                    endTurn();
                if (intersected == opponents[0].score)
                    updatePoints(opponentsNames[0], parseInt($('#inputDeltaScore').val()));
                if (intersected == opponents[1].score)
                    updatePoints(opponentsNames[1], parseInt($('#inputDeltaScore').val()));
                if (intersected == opponents[2].score)
                    updatePoints(opponentsNames[2], parseInt($('#inputDeltaScore').val()));
                if (!camera.down) {
                    if (intersected == ui.scoreMesh)
                        updatePoints(thisPlayerName, parseInt($('#inputDeltaScore').val()));
                    if (dices[0].cube == intersected)
                        updateDice(0);
                    if (dices[1].cube == intersected)
                        updateDice(1);
                    if (dices[2].cube == intersected)
                        updateDice(2);
                    if (dices[3].cube == intersected)
                        updateDice(3);
                    if (dices[4].cube == intersected)
                        updateDice(4);
                }
            }
        }
    } else console.log('CLICK TIMED OUT');

    outlinePass.visibleEdgeColor.set('#e04e3e');
    outlinePass.edgeThickness = 1;
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
    case 37: diceCam.rotation.x += .1; break; //L
    case 40: diceCam.rotation.y += .1; break; //D
    case 39: diceCam.rotation.z += .1; break; //R
    //case 38: diceCam.rotation.x += .1; break; //U
    case 32: rollDices(); break;
    }
}


//END
