//import 'babel-polyfill';
import PIXI from 'pixi.js';

let renderer;
let stage;
let image;
let truth;
let mask;

PIXI.loader
        .add("assets/image.jpg")
        .add("assets/truth.jpg")
        .load(onAssetsLoaded);

function onAssetsLoaded(){
    image = PIXI.Sprite.from("assets/image.jpg");
    truth = PIXI.Sprite.from("assets/truth.jpg");
    mask = new PIXI.Graphics().beginFill(0).drawCircle(0, 0, 150);
    truth.mask = mask;

    renderer = PIXI.autoDetectRenderer(image.width, image.height);
    stage = new PIXI.Container();
    stage.addChild(image);
    stage.addChild(truth);
    stage.addChild(mask);

    document.body.appendChild(renderer.view);

    update();
}

function update(){
    mask.position.copy(renderer.plugins.interaction.mouse.global);
    renderer.render(stage);
    requestAnimationFrame(update);
}
