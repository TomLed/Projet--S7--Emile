var scene, camera, renderer, raycaster;

var mouse = new THREE.Vector2();

var intersected;

var light, ambient;

var cubes = new Array(30);

var d;
var a = Math.sin(50 * Math.PI / 180 );
var geometry = new THREE.BoxGeometry(1,1,1);

var materials = new Array(6);

for (var i = 0; i<6; i++) {
  materials[i] = new THREE.MeshStandardMaterial( {map : new THREE.TextureLoader().load( `/tex/${i}.png`)} );}

/*var materials = [];
for (var i=0; i<6; i++) {
  var img = new Image();
  img.src = 'tex/'  + i + '.png';
  var tex = new THREE.Texture(img);
  img.tex = tex;
  img.onload = function() {
    this.tex.needsUpdate = true;
  };
  var mat = new THREE.MeshBasicMaterial({color: 0xffffff, map: tex});
  materials.push(mat);
}
var cubeGeo = new THREE.CubeGeometry(400,400,400,1,1,1, materials);
var cube = new THREE.Mesh(cubeGeo, new THREE.MeshFaceMaterial());*/

//var material = new THREE.MeshStandardMaterial({ map: texture});

for (var i = 0; i<30; i++) {
  cubes[i] = new THREE.Mesh(geometry, materials);
  d = Math.random()*90;
  cubes[i].position.set((d+20)*a + Math.random() * 150,(Math.random()-.5)*d+Math.random()*5-2.5,-d);
  cubes[i].rotation.set(d,d,d);
  //cubes[i].material.transparent = true;
  //cubes[i].material.opacity = - 1 /( cubes[i].position.z+1);
}

function init() {
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x222222);
  //scene.fog = new THREE.Fog(new THREE.Color(0x222222), 15, 100);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1,100);
  //scene.add(camera);

  camera.position.set(0,0,10);
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  $("#login-three").append(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  light = new THREE.PointLight(0xffffff,1);
  light.position.set(0,10,0);
  scene.add(light);

  ambient = new THREE.AmbientLight(0xffffff,0.3);
  ambient.position.set(0,10,0);
  scene.add(ambient);

  for (var i = 0; i<30; i++) scene.add(cubes[i]);

  raycaster = new THREE.Raycaster();
}

function animate() {
  requestAnimationFrame(animate);

  for (var i = 0; i<30; i++) {
    cubes[i].position.x -= 0.05;
    if (cubes[i].position.x < (cubes[i].position.z-20) * a) {
      cubes[i].position.x = (-cubes[i].position.z +20) * a+ Math.random() * 10;
      cubes[i].position.y = (Math.random()-.5)*cubes[i].position.z+Math.random()*5-2.5;
    }
    cubes[i].rotation.x += 0.02;
    cubes[i].rotation.y += 0.02;
  }

  raycaster.setFromCamera(mouse, camera); // On initialise le raycaster

  var intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {

      if (intersected != intersects[0].object) {

          if (intersected) intersected.scale.set(1, 1, 1);

          intersected = intersects[0].object;
          intersected.scale.set(1.2, 1.2, 1.2);
      }

  } else {

      if (intersected) intersected.scale.set(1, 1, 1);

      intersected = null;

  }

  renderer.render(scene, camera);
}

init();
animate();




function onDocumentMouseMove(event) {
    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = - event.clientY / window.innerHeight * 2 + 1;

}



function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}
