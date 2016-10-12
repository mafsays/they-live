//import 'babel-polyfill';
import PIXI from 'pixi.js';

const renderer = PIXI.autoDetectRenderer

PIXI.loader
        .add("assets/image.jpg")
        .add("assets/truth.jpg")
        .load(onAssetsLoaded);

function onAssetsLoaded(){
    const image = PIXI.Sprite.from("assets/image.jpg");
    const truth = PIXI.Sprite.from("assets/truth.jpg");

    const renderer = PIXI.autoDetectRenderer(image.width, image.height);
    const stage = new PIXI.Container();
    stage.addChild(image);

    document.body.appendChild(renderer.view);
    renderer.render(stage);
}
