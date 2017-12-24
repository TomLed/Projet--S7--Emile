//All code related to updating object state


function updateIntersected() {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        var intersected = intersects[0].object;
        if (intersected != ground) {
            if (camera.down) {
                if (opponents[0].tix == intersected ||
            opponents[1].tix == intersected ||
            opponents[2].tix == intersected) {
                    outlinePass.selectedObjects = [intersected];
                } else if (opponents[0].score == intersected || opponents[1].score || opponents[2].score){
                    outlinePass.selectedObjects = [intersected];
                } else {
                    outlinePass.selectedObjects = [];
                }
            } else {
                if (dices[0].cube == intersected ||
            dices[1].cube == intersected ||
            dices[2].cube == intersected ||
            dices[3].cube == intersected ||
            dices[4].cube == intersected) {
                    outlinePass.selectedObjects = [intersected];
                } else if (ui.roll == intersected) {
                    outlinePass.selectedObjects = [intersected];
                } else if (ui.end == intersected){
                    outlinePass.selectedObjects = [intersected];
                } else {
                    outlinePass.selectedObjects = [];
                }
            }
        } else {
            outlinePass.selectedObjects = [];
            intersected.material.emissiveIntensity = 0;
        }
    } else {
        if (intersected) intersected.material.emissiveIntensity = 0;
        outlinePass.selectedObjects = [];
    }
}


function updateSim() {
    if (simStep < coordinates.length) {

        for (i in dices) {
            var c = coordinates[simStep];
            var p, q;
            if (i == 0) { p = c.p1; q = c.q1;}
            if (i == 1) { p = c.p2; q = c.q2;}
            if (i == 2) { p = c.p3; q = c.q3;}
            if (i == 3) { p = c.p4; q = c.q4;}
            if (i == 4) { p = c.p5; q = c.q5;}
            dices[i].position.copy(p);
            dices[i].quaternion.copy(q);
        }

        simStep++;
    } else {
        simRunning = false;
    }
}

function resetSim() {
    simStep = 0;
    simRunning = true;
}
