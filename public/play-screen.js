var click = false;
var frames = 0;


var container2 = $("#play-three");

var chatWindow = $("#chat-window");

var renderer2 = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer2.setSize(container2.width(), container2.height());

var scene2 = new THREE.Scene();
//scene.background = new THREE.Color(1,1,1);

var camera2 = new THREE.PerspectiveCamera(50, container2.width()/container2.height(), 0.1,100);
camera2.position.set(0,0,15);
camera2.lookAt(scene2.position);
scene2.add(camera2);

var diceGeo = new THREE.BoxGeometry(5,5,5);
var diceMat = new Array(6);
for (var i = 0; i<6; i++) {
  diceMat[i] = new THREE.MeshStandardMaterial( {map : new THREE.TextureLoader().load( `/tex/${i}.png`), transparent: false} );}
var dice = new THREE.Mesh(diceGeo, diceMat);
scene2.add(dice);

/*window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
	camera.aspect = container.width() / container.height();
	camera.updateProjectionMatrix();

	renderer.setSize(container.width(), container.height());
}*/ // remplacer par window.innerWidth, window.innerHeight

var light = new THREE.PointLight(0xffeedd,.1);
light.position.set(5,20,5);
scene2.add(light);

var ambient = new THREE.AmbientLight(0xffeedd,1.5);
scene2.add(ambient);


container2.append(renderer2.domElement);

/*button = $("#roll-button");

button.bind('click', function() {
  click = true;
})*/

animate();
function animate() {
  requestAnimationFrame(animate);

  switch (diceValue) {
    case 1:
      dice.rotation.x += - dice.rotation.x /20;
      dice.rotation.y += (-Math.PI/2 - dice.rotation.y) /20;
      dice.rotation.z += - dice.rotation.z /20;
      break;
    case 2:
      dice.rotation.x += - dice.rotation.x /20;
      dice.rotation.y += (Math.PI/2 - dice.rotation.y) /20;
      dice.rotation.z += - dice.rotation.z /20;
      break;
    case 3:
      dice.rotation.x += (Math.PI/2 - dice.rotation.x) /20;
      dice.rotation.y += - dice.rotation.y /20;
      dice.rotation.z += - dice.rotation.z /20;
      break;
    case 4:
      dice.rotation.x += (-Math.PI/2 - dice.rotation.x) /20;
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
      dice.rotation.y += (Math.PI - dice.rotation.y) /20;
      dice.rotation.z += - dice.rotation.z /20;
      break;
    default:
      dice.rotation.x += 0.007;
      dice.rotation.y += 0.013;
      dice.rotation.z += 0.01;
      dice.rotation.x = dice.rotation.x % (2*Math.PI);
      dice.rotation.y = dice.rotation.y % (2*Math.PI);
      dice.rotation.y = dice.rotation.z % (2*Math.PI);
  }
  renderer2.render(scene2, camera2);
}
