var container2 = $('#play-three'); // selecting the container for the render


// Here I didn't even write an init() function //////

// Renderer setup
var renderer2 = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer2.setSize(container2.width(), container2.height());

// Scene setup
var scene2 = new THREE.Scene();

//Camera setup
var camera2 = new THREE.PerspectiveCamera(50, container2.width()/container2.height(), 0.1,100);
camera2.position.set(0,0,15);
camera2.lookAt(scene2.position);
scene2.add(camera2);

// "Rollable" dice setup
var diceGeo = new THREE.BoxGeometry(5,5,5);
var diceMat = new Array(6);
for (var i = 0; i<6; i++) {
    diceMat[i] = new THREE.MeshStandardMaterial( {map : new THREE.TextureLoader().load( `/tex/${i}.png`), transparent: false} );}
var dice = new THREE.Mesh(diceGeo, diceMat);
scene2.add(dice);

// lights setup
var light = new THREE.PointLight(0xffeedd,.1);
light.position.set(5,20,5);
scene2.add(light);

var ambient = new THREE.AmbientLight(0xffeedd,1.5);
scene2.add(ambient);

// Adding the scene to the html page (so we can see it)
container2.append(renderer2.domElement);

animate(); // Calling the function below

function animate() {
    requestAnimationFrame(animate); //animation loop

    /* _diceValue is updated in game.js, stores the value of the dice. Below, a switch/case
  which displays the right face of the dice, facing the camera */

    switch (_diceValue) {
    case 1:
        dice.rotation.x += - dice.rotation.x /20;
        dice.rotation.y += (-Math.PI/2 - dice.rotation.y) /20; // Just orientating it correctly
        dice.rotation.z += - dice.rotation.z /20;
        break;
    case 2:
        dice.rotation.x += - dice.rotation.x /20;
        dice.rotation.y += (Math.PI/2 - dice.rotation.y) /20; // Same here ...
        dice.rotation.z += - dice.rotation.z /20;
        break;
    case 3:
        dice.rotation.x += (Math.PI/2 - dice.rotation.x) /20; // ...
        dice.rotation.y += - dice.rotation.y /20;
        dice.rotation.z += - dice.rotation.z /20;
        break;
    case 4:
        dice.rotation.x += (-Math.PI/2 - dice.rotation.x) /20; // :o
        dice.rotation.y += - dice.rotation.y /20;
        dice.rotation.z += - dice.rotation.z /20;
        break;
    case 5:
        dice.rotation.x += - dice.rotation.x /20;
        dice.rotation.y += - dice.rotation.y /20;
        dice.rotation.z += - dice.rotation.z /20;
        break;
    case 6:
        dice.rotation.x += - dice.rotation.x /20;
        dice.rotation.y += (Math.PI - dice.rotation.y) /20; // nothing new ...
        dice.rotation.z += - dice.rotation.z /20;
        break;
    default:
        // Just rotating it while waiting for a player to roll the dices
        dice.rotation.x += 0.007;
        dice.rotation.y += 0.013;
        dice.rotation.z += 0.01;
        dice.rotation.x = dice.rotation.x % (2*Math.PI);
        dice.rotation.y = dice.rotation.y % (2*Math.PI);
        dice.rotation.y = dice.rotation.z % (2*Math.PI);
    }
    renderer2.render(scene2, camera2); // RENDEEEERRR EVERYTHIIIIING
}
