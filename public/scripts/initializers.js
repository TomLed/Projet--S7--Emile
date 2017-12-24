// All code related to three.js instance initialization

// RENDER SPECIFIC CLASSES

class Renderer extends THREE.WebGLRenderer {
    constructor() {
        super({antialias: true});
        this.setSize(window.innerWidth, window.innerHeight);
        this.shadowMap.enabled = true;
        this.shadowMap.type = THREE.PCFSoftShadowMap;
        $('#threeer').append(this.domElement);
    }
}

class OutlinePass extends THREE.OutlinePass {
    constructor() {
        var ratio = new THREE.Vector2(window.innerWidth, window.innerHeight);
        super(ratio, scene, camera);

        this.edgeStrength = 3;
        this.edgeGlow = 0;
        this.edgeThickness = 1;
        this.pulsePeriod = 0;
        this.usePatternTexture = false;
        this.visibleEdgeColor.set('#e04e3e');
        this.hiddenEdgeColor.set('#000000');
    }
}

class SAOPass extends THREE.SAOPass {
    constructor() {
        super(scene, camera, false, true);

        this.params = {
    	output: 0,
    	saoBias: 0,
    	saoIntensity: 0.1,
    	saoScale: 10,
    	saoKernelRadius: 20,
    	saoMinResolution: 0,
    	saoBlur: true,
    	saoBlurRadius: 12,
    	saoBlurStdDev: 6,
    	saoBlurDepthCutoff: 0.01
        };
    }
}

class Scene extends THREE.Scene {
    constructor() {
        super();
        this.background = new THREE.Color(0xddeeff);
        this.fog = new THREE.Fog(this.background, 2, 40);
    }
}

class Camera extends THREE.PerspectiveCamera {
    constructor() {
        var aspect = window.innerWidth / window.innerHeight;
        super(70, aspect, .01, 100);
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

// GAME SPECIFIC CLASSES

class UI extends THREE.Group {
    constructor() {
        super();
        this.count = 0;
        this.score = -2500;

        var reserveMat = new THREE.MeshBasicMaterial({color: 0x060606, transparent: true, opacity: 0.75});
        var reserveGeo = new THREE.PlaneGeometry(.5, .1);
        this.reserve = new THREE.Mesh(reserveGeo, reserveMat);
        this.reserve.position.set(0, -.28, -.5);
        this.add(this.reserve);

        var rollGeo = new THREE.PlaneGeometry(.1, .1);
        var rollMat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/src/tex/roll-01.png'), transparent: true, opacity: 0.7});

        this.roll = new THREE.Mesh(rollGeo, rollMat);
        this.roll.position.set(.32, -.28, -.5);
        this.add(this.roll);

        var endGeo = new THREE.PlaneGeometry(.1, .1);
        var endMat = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/src/tex/end-01.png'), transparent: true, opacity: 0.7});

        this.end = new THREE.Mesh(endGeo, endMat);
        this.end.position.set(-.32, -.28, -.5);
        this.add(this.end);

        this.scoreTex = new THREE.Texture(this.setCanvas(this.score));
        this.scoreTex.needsUpdate = true;
        var scoreGeo = new THREE.PlaneGeometry(.1, .05);
        var scoreMat = new THREE.MeshBasicMaterial({map: this.scoreTex, transparent: true, opacity: 1});

        this.scoreMesh = new THREE.Mesh(scoreGeo, scoreMat);
        this.scoreMesh.position.set(0, -.18, -.45);
        this.add(this.scoreMesh);
    }

    updateScore(score) {
        this.score = score;
        this.scoreMesh.material.map = new THREE.Texture(this.setCanvas(score));
        this.scoreMesh.material.map.needsUpdate = true;
    }

    setCanvas(text) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = 256;
        canvas.height = 128;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'white';
        var textSize = context.measureText(text).width;
        var fontSize = 72;
        context.font = fontSize + 'px CabinRegular';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas;
    }
}

class PointLight extends THREE.PointLight {
    constructor() {
        super(0xffffff, .6);
        this.castShadow = true;
        this.shadow.mapSize.width = 512;
        this.shadow.mapSize.height = 512;
        this.position.set(0, 2, 0);
    }
}

class Ground extends THREE.Mesh {
    constructor() {
        var groundGeo = new THREE.PlaneGeometry(100, 100);
  	var groundMat = new THREE.MeshStandardMaterial({color: 0x505050, roughness: 0.8});

        super(groundGeo, groundMat);
        this.receiveShadow = true;
        this.lookAt(new THREE.Vector3(0, 1, 0));
    }
}

class Opponent extends THREE.Group {
    constructor(nickname, score) {
        super();
        this.look = new THREE.Vector3();
        this.lookAt(scene.position);

        var bodyGeo = new THREE.BoxGeometry(1, 1, .01);
        var bodyMat = new THREE.MeshStandardMaterial({color: 0x202020, side: THREE.DoubleSide, roughness: .8});
        this.body = new THREE.Mesh(bodyGeo, bodyMat);
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.add(this.body);

        var nameTex = new THREE.Texture(this.setCanvas(nickname));
        nameTex.needsUpdate = true;
        nameTex.anisotropy = 8;
        var nameGeo = new THREE.PlaneGeometry(1, .25);
        var nameMat = new THREE.MeshStandardMaterial({map: nameTex, transparent: true, side: THREE.DoubleSide, roughness: .8});
        this.name = new THREE.Mesh(nameGeo, nameMat);
        this.name.position.set(0, .5, .1);
        this.add(this.name);

        var scoreTex = new THREE.Texture(this.setCanvas(score));
        scoreTex.needsUpdate = true;
        scoreTex.anisotropy = 8;
        var scoreGeo = new THREE.PlaneGeometry(1, .25);
        var scoreMat = new THREE.MeshStandardMaterial({map: scoreTex, transparent: true, side: THREE.DoubleSide, roughness: .8});
        this.score = new THREE.Mesh(scoreGeo, scoreMat);
        this.score.position.set(0, .2, .1);
        this.add(this.score);

        var tixTex = new THREE.Texture(this.setCanvas('TIX !', '#883033', 192));
        tixTex.needsUpdate = true;
        tixTex.anisotropy = 8;
        var tixGeo = new THREE.PlaneGeometry(1, .375);
        var tixMat = new THREE.MeshStandardMaterial({map: tixTex, transparent: true, side: THREE.DoubleSide, roughness: .8});
        this.tix = new THREE.Mesh(tixGeo, tixMat);
        this.tix.position.set(0, -.175, .1);
        this.add(this.tix);

        this.score.value = score;
        this.name.value = name;
    }

    setCanvas(text, color, height) {

        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.beginPath();
            this.moveTo(x+r, y);
            this.arcTo(x+w, y,   x+w, y+h, r);
            this.arcTo(x+w, y+h, x,   y+h, r);
            this.arcTo(x,   y+h, x,   y,   r);
            this.arcTo(x,   y,   x+w, y,   r);
            this.closePath();
            return this;
        };

        var color = color || '#202020';
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = 512;
        canvas.height = height || 128;

        context.fillStyle = color;
        //context.fillRect(0, 0, canvas.width, canvas.height);
        context.roundRect(10, 10, canvas.width-20, canvas.height-20, 20).fill();

        context.fillStyle = '#aaaaaa';
        var textSize = context.measureText(text).width;
        if (textSize > 72) var fontSize = Math.round(canvas.width / textSize * 8);
        else var fontSize = 72;
        context.font = fontSize + 'px CabinRegular';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        /*context.shadowColor = '#999';
    context.shadowBlur = 20;
    context.shadowOffsetX = 15;
    context.shadowOffsetY = 15;*/

        return canvas;
    }

    update() {
        if (camera.down) {
            raycaster.setFromCamera(mouse, camera);
            var distance = Math.atan(2 * raycaster.ray.distanceSqToPoint(this.position)) / (Math.PI / 2);
            var point = new THREE.Vector3(mouse.x, mouse.y, 0).add(camera.position).multiplyScalar(1 - distance);
        } else {
            var point = new THREE.Vector3();
        }

        this.look.x += (point.x - this.look.x) / 5;
        this.look.y += (point.y - this.look.y) / 5;
        this.look.z += (point.z - this.look.z) / 5;

        this.lookAt(this.look);
    }

    updateScore(score){
        this.score.material.map = new THREE.Texture(this.setCanvas(score));
        this.score.material.map.needsUpdate = true;
        this.score.material.map.anisotropy = 8;
    }

    updateName(name){
        this.name.material.map = new THREE.Texture(this.setCanvas(name));
        this.name.material.map.needsUpdate = true;
        this.name.material.map.anisotropy = 8;
    }
}

class Sprite extends THREE.Sprite {
    constructor() {
        var spriteMat = new THREE.SpriteMaterial();
        super(spriteMat);

        this.cv = document.createElement('canvas');
        this.cv.width = 128;
        this.cv.height = 128;
        this.ctx = this.cv.getContext('2d');

        this.material.map = new THREE.Texture(this.cv);
    }
}

class Dice extends THREE.Group {
    constructor() {
        super();
        this.position.set(0,-1,0);

        this.value = undefined;
        this.reserve = false;

        var cubeGeo = this.setGeo(.1, .005);

        var cubeMat = this.setMat();

        this.cube = new THREE.Mesh(cubeGeo, cubeMat);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
        this.add(this.cube);

        this.sprite = new Sprite();
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
                context.font = 96 + 'pt CabinRegular';
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

    updateValue(value) {
        this.value = value;
    }

    updateSprite() {
        if (!camera.down || simRunning || this.reserve == true) {
            this.sprite.ctx.clearRect(0, 0, this.sprite.cv.width, this.sprite.cv.height);
        } else {
            this.sprite.ctx.font = 24 + 'pt CabinRegular';
            this.sprite.ctx.clearRect(0, 0, this.sprite.cv.width, this.sprite.cv.height);
            this.sprite.ctx.textAlign = 'center';
            this.sprite.ctx.textBaseline = 'middle';
            this.sprite.ctx.fillStyle = '#ffffff';
            this.sprite.ctx.fillText(this.value, this.sprite.cv.width / 2, this.sprite.cv.height / 2);
        }
        this.sprite.material.map.needsUpdate = true;

        this.sprite.position.copy(this.position).add(new THREE.Vector3(0, camera.down ? .2 : -1, 0));
    }

    update() {
        if (!simRunning) {
            var child = this.cube;

            if (!this.reserve) {
                THREE.SceneUtils.detach(child, this, scene);
                THREE.SceneUtils.attach(child, scene, camera);
                child.position.set(-.2+.1*ui.count, -.28, -.5);
                child.scale.set(.4, .4, .4);
                this.showFace();
                this.reserve = !this.reserve;
                ui.count++;
            } else {
                THREE.SceneUtils.detach(child, camera, scene);
                THREE.SceneUtils.attach(child, scene, this);
                child.position.set(0, 0, 0);
                child.rotation.set(0, 0, 0);
                child.scale.set(1, 1, 1);
                this.reserve = !this.reserve;
                ui.count--;
            }
        }
    }

    showFace() {
        switch (this.value) {
        case 1: this.cube.rotation.set(0, -Math.PI/2, 0); break;
        case 2: this.cube.rotation.set(Math.PI, 0, Math.PI); break;
        case 3: this.cube.rotation.set(Math.PI/2, Math.PI, 0); break;
        case 4: this.cube.rotation.set(-Math.PI/2, -Math.PI/2, 0); break;
        case 5: this.cube.rotation.set(0, 0, Math.PI/2); break;
        case 6: this.cube.rotation.set(Math.PI/2, Math.PI, -Math.PI/2); break;
        }
    }
}



// DOCUMENT EVENTS

function initEvents(){
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    document.addEventListener('keydown', onDocumentKeyDown, false);

    //window.setInterval(askPosition(), 1000);
    //window.setInterval(emitPosition(), 1000);
}

// END
