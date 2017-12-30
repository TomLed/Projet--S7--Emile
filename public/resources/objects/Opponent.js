
class Opponent extends THREE.Group {
    constructor(nickname, index, score) {
        super();
        this.nickname = nickname;
        this.index = index;
        this.score = score;
        this.look = new THREE.Vector3();
        this.lookAt(scene.position);

        var bodyGeo = new THREE.BoxGeometry(1, 1, .01);
        var bodyMat = new THREE.MeshStandardMaterial({color: 0x202020, side: THREE.DoubleSide, roughness: .8});
        this.body = new THREE.Mesh(bodyGeo, bodyMat);
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.add(this.body);

        var nameTex = new THREE.Texture(this.setCanvas(this.nickname));
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

        var tixTex = new THREE.Texture(this.setCanvas('CHOOSE ME', '#3b2d72', 192));
        tixTex.needsUpdate = true;
        tixTex.anisotropy = 8;
        var tixGeo = new THREE.PlaneGeometry(1, .375);
        var tixMat = new THREE.MeshStandardMaterial({map: tixTex, transparent: true, side: THREE.DoubleSide, roughness: .8});
        this.tix = new THREE.Mesh(tixGeo, tixMat);
        this.tix.position.set(0, -.175, .1);

        this.tix.setEmissive = function(emission) {
            this.material.emissive = emission;
        }

        this.add(this.tix);

        this.score.value = score;
        this.name.value = name;
    }

    setCanvas(text, color, height) {

        /*CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
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
        };*/

        var color = color || '#202020';
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = 512;
        canvas.height = height || 128;

        context.fillStyle = color;
        context.lineWidth="12";
        context.strokeStyle="white";
        context.beginPath();
        context.moveTo(100, canvas.height);
        context.lineTo(canvas.width - 100, canvas.height);
        //context.rect(0, 0, canvas.width, canvas.height); //fillRect
        context.stroke();
        //context.roundRect(10, 10, canvas.width-20, canvas.height-20, 20).fill();

        context.fillStyle = '#aaaaaa';
        var textSize = context.measureText(text).width;
        if (textSize > 72) var fontSize = Math.round(canvas.width / textSize * 8);
        else var fontSize = 72;
        context.font = fontSize + 'px gill';
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
