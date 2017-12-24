// Global variables and three.js main functions

var composer;
var renderPass, outlinePass, saoPass, fxaaPass, smaaPass;

var timer;

var raycaster, mouse;

var renderer;
var scene, camera;

var light, ambient;
var ground;

var opponents = new Array(3).fill(undefined);
var dices = new Array(5).fill(undefined);

var coordinates = [];
var values = [];
var simStep, simRunning;

var opponentsNames = new Array(3).fill('');
var scores = new Array(3).fill(-2500); //Need to think of a solution to make this array communicate with the real scores

$(window).on('load', function() {
    init();
    animate();
});

function init() {
    simStep = 120;
    simRunning = false;

    raycaster = new THREE.Raycaster();

    mouse = new THREE.Vector2();

    renderer = new Renderer();

    scene = new Scene();

    camera = new Camera();
    scene.add(camera);

    ui = new UI();
    camera.add(ui);

    light = new PointLight();
    scene.add(light);

    ambient = new THREE.AmbientLight(0xffffff, .6);
    scene.add(ambient);

    ground = new Ground();
    scene.add(ground);

    for (var i in opponents) {
        opponents[i] = new Opponent(opponentsNames[i], scores[i]);
        scene.add(opponents[i]);
    }

    opponents[0].position.set(-2, 1, 0);
    opponents[1].position.set(2, 1, 0);
    opponents[2].position.set(0, 1, -2);

    for (var i in dices) {
        dices[i] = new Dice(i);
        scene.add(dices[i]);
        scene.add(dices[i].sprite);
    }

    composer = new THREE.EffectComposer(renderer);

    renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    outlinePass = new OutlinePass();
    composer.addPass(outlinePass);

    /*saoPass = new SAOPass();
  composer.addPass(saoPass);*/

    smaaPass = new THREE.SMAAPass(window.innerWidth, window.innerHeight);
    smaaPass.renderToScreen = true;
    composer.addPass(smaaPass);

    initEvents();

    //$('#fontloader').hide();
}

function animate() {
    requestAnimationFrame(animate);

    camera.update();

    for (var i in opponents) opponents[i].update();

    updateIntersected();

    updateSim();

    for (var i in dices) dices[i].updateSprite();

    //renderer.render(scene, camera);
    composer.render();
}





















// Ender
