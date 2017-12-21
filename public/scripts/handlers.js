//START

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {

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
                if (intersected == camera.children[0].children[1])
                    rollDices();
                if (!camera.down) {
                    if (dices[0].cube == intersected)
                        dices[0].update();
                    if (dices[1].cube == intersected)
                        dices[1].update();
                    if (dices[2].cube == intersected)
                        dices[2].update();
                    if (dices[3].cube == intersected)
                        dices[3].update();
                    if (dices[4].cube == intersected)
                        dices[4].update();
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
