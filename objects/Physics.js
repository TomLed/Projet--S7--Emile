// Simulation function(s)

var CANNON = require('cannon');

var diceMat = new CANNON.Material();
var groundMat = new CANNON.Material();
var barrierMat = new CANNON.Material();

function simulate() {
    var coordinates = new Array();
    var timeStep = 1.0 / 60.0;

    var world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    world.addContactMaterial(new CANNON.ContactMaterial(groundMat, diceMat, {friction: .1, restitution: .5}));
    world.addContactMaterial(new CANNON.ContactMaterial(barrierMat, diceMat, {friction: 0, restitution: .5}));
    world.addContactMaterial(new CANNON.ContactMaterial(diceMat, diceMat, {friction: .01, restitution: .5}));

    var barrier1 = new CANNON.Body({
        mass: 0,
        material: barrierMat,
        position: new CANNON.Vec3(1.5, 0, 0),
        quaternion: new CANNON.Quaternion().setFromEuler(0, -Math.PI/2, 0),
        shape: new CANNON.Plane(),
    });
    world.add(barrier1);

    var barrier2 = new CANNON.Body({
        mass: 0,
        material: barrierMat,
        position: new CANNON.Vec3(-1.5, 0, 0),
        quaternion: new CANNON.Quaternion().setFromEuler(0, Math.PI/2, 0),
        shape: new CANNON.Plane(),
    });
    world.add(barrier2);

    var barrier3 = new CANNON.Body({
        mass: 0,
        material: barrierMat,
        position: new CANNON.Vec3(0, 0, -1.5),
        quaternion: new CANNON.Quaternion().setFromEuler(0, 0, 0),
        shape: new CANNON.Plane(),
    });
    world.add(barrier3);

    var ground = new CANNON.Body({
        mass: 0,
        material: groundMat,
        position: new CANNON.Vec3(0, 0, 0),
        quaternion: new CANNON.Quaternion().setFromEuler(-Math.PI/2, 0, 0),
        shape: new CANNON.Plane()
    });
    world.addBody(ground);

    var dice1 = initDice();
    world.addBody(dice1);

    var dice2 = initDice();
    world.addBody(dice2);

    var dice3 = initDice();
    world.addBody(dice3);

    var dice4 = initDice();
    world.addBody(dice4);

    var dice5 = initDice();
    world.addBody(dice5);

    while (!hasEnded(coordinates[coordinates.length-1], coordinates[coordinates.length-2])) {
        world.step(timeStep);
        coordinates.push({p1: new CANNON.Vec3().copy(dice1.position),
            q1: new CANNON.Quaternion().copy(dice1.quaternion),
            p2: new CANNON.Vec3().copy(dice2.position),
            q2: new CANNON.Quaternion().copy(dice2.quaternion),
            p3: new CANNON.Vec3().copy(dice3.position),
            q3: new CANNON.Quaternion().copy(dice3.quaternion),
            p4: new CANNON.Vec3().copy(dice4.position),
            q4: new CANNON.Quaternion().copy(dice4.quaternion),
            p5: new CANNON.Vec3().copy(dice5.position),
            q5: new CANNON.Quaternion().copy(dice5.quaternion)});
    }

    var faces = getFaces(coordinates[coordinates.length-1]);
    for (var i =0; i < faces.length; i++) {
        if (faces[i] == undefined) return simulate();
    }

    return {coordinates: coordinates, faces: faces};
}

function initDice() {
    var dice = new CANNON.Body({
        mass: 1,
        material: diceMat,
        position: new CANNON.Vec3(Math.random()*.5+.8, Math.random()*.25+.5, 2.5),
        quaternion: new CANNON.Quaternion().setFromEuler(Math.random(), Math.random(), Math.random()),
        velocity: new CANNON.Vec3(-2+Math.random(), Math.random(), -4-Math.random()*2),
        angularVelocity: new CANNON.Vec3(Math.random(), Math.random(), Math.random()).mult(8),
        shape: new CANNON.Box(new CANNON.Vec3(.1, .1, .1))
    });

    return dice;
}

function hasEnded(cp, cn) {
    var l = .0001;
    if (cn) {
        if (cp.p1.distanceTo(cn.p1) > l ||
        cp.p2.distanceTo(cn.p2) > l ||
        cp.p3.distanceTo(cn.p3) > l ||
        cp.p4.distanceTo(cn.p4) > l ||
        cp.p5.distanceTo(cn.p5) > l) {
            return false;
        } else return true;
    } else return false;
}

function getFaces(c) {
    var faces = [];

    var a1 = new CANNON.Vec3(); c.q1.toEuler(a1);
    var a2 = new CANNON.Vec3(); c.q2.toEuler(a2);
    var a3 = new CANNON.Vec3(); c.q3.toEuler(a3);
    var a4 = new CANNON.Vec3(); c.q4.toEuler(a4);
    var a5 = new CANNON.Vec3(); c.q5.toEuler(a5);

    faces.push(getFace(a1));
    faces.push(getFace(a2));
    faces.push(getFace(a3));
    faces.push(getFace(a4));
    faces.push(getFace(a5));

    return faces;
}

function getFace(a) {
    var l = .01;

    if (a.distanceTo(new CANNON.Vec3(0, a.y,  Math.PI/2)) < l) return 1; //+X
    if (a.distanceTo(new CANNON.Vec3(0, a.y, -Math.PI/2)) < l) return 6; //-X
    if (a.distanceTo(new CANNON.Vec3(0, a.y,          0)) < l) return 3; //+Y
    if (a.distanceTo(new CANNON.Vec3(Math.PI, a.y,    0)) < l) return 4; //-Y
    if (a.distanceTo(new CANNON.Vec3(-Math.PI/2, a.y, 0)) < l) return 5; //+Z
    if (a.distanceTo(new CANNON.Vec3(Math.PI/2,  a.y, 0)) < l) return 2; //-Z

    return undefined;
}

module.exports.simulate = simulate;
