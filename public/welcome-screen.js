/* three.js is a javascript file which consists of a library of simple to use
objects, aiming to make the use of WebGL (html 3D engine) way easier. It comes
with various pre-made functions that will be used all along this file. */

// Declaring the scene for the objects to exist, the camera to see them, the
// renderer to compute everything and a raycaster to get the client's mouse position.
var scene, camera, renderer, raycaster;

var mouse = new THREE.Vector2(); // Vector2 : kinda like an array of two numbers [x,y]

var intersected; // For the raycaster, to know which object is pointed at by the mouse

var light, ambient; // So we can see the scene otherwise it would be black

var cubes = new Array(30); // Array of cubes for the background of the login screen

var d;
var a = Math.sin(50 * Math.PI / 180 ); // Variables to give random position to these cubes
var geometry = new THREE.BoxGeometry(1,1,1); // Declaring a box (=cube) geometry

var materials = new Array(6); // Declaring the materials for the dice

// Loading the textures in the material
for (var i = 0; i<6; i++) {
    materials[i] = new THREE.MeshStandardMaterial( {map : new THREE.TextureLoader().load( `/tex/${i}.png`)} );
}

// Setting up the array of randomly placed cute little dices
for (i = 0; i<30; i++) {
    cubes[i] = new THREE.Mesh(geometry, materials);
    d = Math.random()*90;
    cubes[i].position.set((d+20)*a + Math.random() * 150,(Math.random()-.5)*d+Math.random()*5-2.5,-d);
    cubes[i].rotation.set(d,d,d);
    //cubes[i].material.transparent = true;
    //cubes[i].material.opacity = - 1 /( cubes[i].position.z+1);
}

// initializing function, in which will be initialized most three.js objects
// ^^^^ basically I could have declared the 20 lines above in that init function but at the time I didn't have the time for that
// Also the underlying init function is purely decorative. It is useful when we need to call it multiple times, however here we don't.
function init() {
    scene = new THREE.Scene(); // Setting up the new scene

    camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1,100); //Setting up the new camera

    camera.position.set(0,0,10);
    camera.lookAt(scene.position); // Setting up its direction and position

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}); // Same as above
    renderer.setSize(window.innerWidth, window.innerHeight);
    $('#login-three').append(renderer.domElement); // Appending (including) the renderer in the html page

    // Needed to keep correct aspect ratio if resizing the browser
    window.addEventListener('resize', onWindowResize, false);
    // Keeping track of the position of the mouse
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    light = new THREE.PointLight(0xffffff,1); // New light
    light.position.set(0,10,0);
    scene.add(light);

    ambient = new THREE.AmbientLight(0xffffff,0.3); // New ambient light so the shadows are not harsh
    ambient.position.set(0,10,0);
    scene.add(ambient);

    for (var i = 0; i<30; i++) scene.add(cubes[i]); // Adding up all the cubes (dices)

    raycaster = new THREE.Raycaster(); // Initializing the raycaster
}

// This function however is called in a loop so it renders continuously, so we can't declare this globally
function animate() {
    requestAnimationFrame(animate); // This function calls itself so it loops indefinitely and updates the scene

    // Just moving the cubes
    for (var i = 0; i<30; i++) {
        cubes[i].position.x -= 0.05;
        if (cubes[i].position.x < (cubes[i].position.z-20) * a) {
            cubes[i].position.x = (-cubes[i].position.z +20) * a+ Math.random() * 10;
            cubes[i].position.y = (Math.random()-.5)*cubes[i].position.z+Math.random()*5-2.5;
        }
        cubes[i].rotation.x += 0.02;
        cubes[i].rotation.y += 0.02;
    }

    raycaster.setFromCamera(mouse, camera); // Initializing raycaster to interact with the mouse and the camera parameters

    // The code below finds the intersected object
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {

        if (intersected != intersects[0].object) {

            if (intersected) intersected.scale.set(1, 1, 1);

            intersected = intersects[0].object;
            intersected.scale.set(1.2, 1.2, 1.2); // The intersected object will appear scaled up / zoomed in
        }

    } else {

        if (intersected) intersected.scale.set(1, 1, 1);

        intersected = null;

    }

    renderer.render(scene, camera); // MOST IMPORTANT LINE just basically renders everything.
}

init();
animate(); // calling the two functions



// Updating mouse coordinates
function onDocumentMouseMove(event) {
    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = - event.clientY / window.innerHeight * 2 + 1;

}


// Updating aspect ratio on window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
