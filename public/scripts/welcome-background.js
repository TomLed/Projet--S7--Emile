class Renderer extends THREE.WebGLRenderer {
  constructor() {
    super({ alpha: true,antialias: true});
    this.setSize(window.innerWidth, window.innerHeight);
    this.setClearColor( 0x000000, 0 );
    $('#login-three').append(this.domElement);
  }
}

class Scene extends THREE.Scene {
  constructor() {
    super();
  }
}

class Camera extends THREE.PerspectiveCamera {
  constructor() {
    var aspect = window.innerWidth / window.innerHeight;
    super(50, aspect, .01, 100);
    this.look = new THREE.Vector3();
    this.down = true;
    this.y = 1.5;
    this.z = 2.5;
    this.position.set(0, 1.5, 2.5);
    this.lookAt(new THREE.Vector3(0, 1, 0).add(scene.position));
  }

  update() {
    if (mouse.y > .75) this.y = 1.5, this.z = 2.5, this.down = true;
    if (mouse.y < -.5) this.y = 2.5, this.z = .5, this.down = false;

    this.position.x += (mouse.x*(2.5-this.position.y)*.25-this.position.x) / 5;
    this.position.y += (this.y-this.position.y) / 15;
    this.position.z += (this.z-this.position.z) / 15;

    this.look.x += (mouse.x*(2.5-this.position.y)-this.look.x) / 5;
    this.look.y += (mouse.y*(2.5-this.position.y)-this.look.y) / 5;

    this.lookAt(this.look);
  }
}

class Dice extends THREE.Group {
  constructor() {
    super();

    var cubeGeo = this.setGeo(.5, .025);

    var cubeMat = this.setMat();

    this.cube = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.add(this.cube);
  }

  setGeo(h, b) {
    var g = new THREE.Geometry();

    var v = [[h,h-b,h-b], [h,h-b,b-h], [h,b-h,b-h], [h,b-h,h-b],
             [h-b,h,h-b], [h-b,h,b-h], [b-h,h,b-h], [b-h,h,h-b],
             [h-b,h-b,h], [h-b,b-h,h], [b-h,b-h,h], [b-h,h-b,h],
             [-h,h-b,h-b],[-h,h-b,b-h],[-h,b-h,b-h],[-h,b-h,h-b],
             [h-b,-h,h-b],[h-b,-h,b-h],[b-h,-h,b-h],[b-h,-h,h-b],
             [h-b,h-b,-h],[h-b,b-h,-h],[b-h,b-h,-h],[b-h,h-b,-h]];

    var f = [[0,2,1],   [0,3,2],   [4,5,6],   [4,6,7],
             [8,10,9],  [8,11,10], [12,13,14],[12,14,15],
             [16,18,17],[16,19,18],[20,21,22],[20,22,23],

             [0,4,8], [1,20,5], [6,23,13], [7,12,11],
             [3,9,16], [2,17,21], [14,22,18], [10,15,19],

             [4,7,8], [7,11,8], [0,1,5], [0,5,4],
             [5,20,23], [5,23,6], [6,12,7], [6,13,12],

             [0,8,3], [3,8,9], [10,11,15], [11,12,15],
             [13,23,22], [13,22,14], [1,2,20], [2,21,20],

             [9,10,16], [10,19,16], [2,3,17], [3,16,17],
             [14,18,15], [15,18,19], [17,22,21], [17,18,22]];

    for (var i = 0; i < v.length; i++) {
      g.vertices.push(new THREE.Vector3(v[i][0], v[i][1], v[i][2]));
    }

    for (var i = 0; i < f.length; ++i) {
      g.faces.push(new THREE.Face3(f[i][0], f[i][1], f[i][2]));
      g.faces[g.faces.length -1].materialIndex = i < 12 ? Math.floor(i/2) : 6;
    }

    for (var i = 0; i < 20; i++) {
      g.faceVertexUvs[0].push([new THREE.Vector2(0,1), new THREE.Vector2(1,0), new THREE.Vector2(1,1)]);
      g.faceVertexUvs[0].push([new THREE.Vector2(0,1), new THREE.Vector2(0,0), new THREE.Vector2(1,0)]);

      g.faceVertexUvs[0].push([new THREE.Vector2(0,1), new THREE.Vector2(0,0), new THREE.Vector2(1,0)]);
      g.faceVertexUvs[0].push([new THREE.Vector2(0,1), new THREE.Vector2(1,0), new THREE.Vector2(1,1)]);
    }

    g.computeBoundingBox();
    g.computeFaceNormals();

    return g;
  }

  setMat() {
    var labels = ['1', '3', '5', '6', '4', '2', undefined];
    var labelColor = '#aaaaaa';
    var diceColor = '#202020';

    function createTextTexture(text, color, backColor) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      canvas.width = 256;
      canvas.height = 256;

      if (text == undefined) {
        context.fillStyle = backColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        context.font = 96 + "pt Arial";
        context.fillStyle = backColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = color;
        context.fillText(text, canvas.width / 2, canvas.height / 2);
      }

      var texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      return texture;
    }

    var materials = new Array();

    for (var i = 0; i < labels.length + 1; i++)
      materials.push(new THREE.MeshStandardMaterial({map: createTextTexture(labels[i], labelColor, diceColor)}));

    return materials;
  }

}


var renderer, scene, camera;
var dices = new Array(30);

var light, ambient;

var d;
var a = Math.sin(50 * Math.PI / 180);

init();
animate();

function init() {
  renderer = new Renderer();

  scene = new Scene();
  //scene.background = new THREE.Color(0xffffff);

  camera = new Camera();

  light = new THREE.PointLight(0xffffff,1);
  light.position.set(0,10,0);
  scene.add(light);

  ambient = new THREE.AmbientLight(0xffffff,0.3);
  ambient.position.set(0,10,0);
  scene.add(ambient);

  for (var i = 0; i < 30; i++) {
    dices[i] = new Dice();
    d = Math.random()*90;
    dices[i].position.set((d+20)*a + Math.random() * 150,
                          (Math.random()-.5)*d+Math.random()*5-2.5,
                          -d);
    dices[i].rotation.set(d,d,d);
    scene.add(dices[i]);
  }

  camera.position.set(0,0,10);
  camera.lookAt(scene.position);
  scene.add(camera);

  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  for (var i = 0; i<30; i++) {
      dices[i].position.x -= 0.05;
      if (dices[i].position.x < (dices[i].position.z-20) * a) {
          dices[i].position.x = (-dices[i].position.z +20) * a+ Math.random() * 10;
          dices[i].position.y = (Math.random()-.5)*dices[i].position.z+Math.random()*5-2.5;
      }
      dices[i].rotation.x += 0.02;
      dices[i].rotation.y += 0.02;
  }

  renderer.render(scene, camera);
}




function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
