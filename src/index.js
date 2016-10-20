//import 'babel-polyfill';
import PIXI from 'pixi.js';
import Spring from './Spring';
import Flicker from './Flicker';
import Glitch from './Glitch';

let renderer;
let stage;
let image;
let truth;
let mask;
let spring;
let flicker;
let glitch;

PIXI.loader
        .add("assets/image.jpg")
        .add("assets/truth.jpg")
        .load(onAssetsLoaded);

function onAssetsLoaded(){
    image = PIXI.Sprite.from("assets/image.jpg");
    truth = PIXI.Sprite.from("assets/truth.jpg");
    mask = new PIXI.Graphics().beginFill(0).drawCircle(0, 0, 150);

    renderer = PIXI.autoDetectRenderer(image.width, image.height);
    document.body.appendChild(renderer.view);

    stage = new PIXI.Container();
    stage.addChild(image);
    stage.addChild(truth);
    //truth.mask = mask;
    //stage.addChild(mask);

    stage.interactive = true;
    stage.on('mousedown', pop );


    spring = new Spring({ damping: 0.85, springiness: 0.29 });
    const params = { children: 0 }
    flicker = new Flicker({children:0});

    glitch = new Glitch( stage, PIXI.Texture.from("assets/glitch.png"));

    update();
}

function update(){
    spring.update();
    flicker.update();
    image.position.copy(spring.position);
    truth.position.copy(spring.position);

    truth.visible = flicker.on;
    if( flicker.on ){
        if ( !glitch.enabled ) {
            glitch.enabled = true;
            glitch.glitch();
        }
    } else {
        glitch.enabled = false;
    }
    glitch.update();

    stage.alpha = 0.9 + Math.random() * 0.1;

    console.log(image.x);
    //mask.position.copy(renderer.plugins.interaction.mouse.global);
    renderer.render(stage);
    requestAnimationFrame(update);
}

function pop(){
    spring.shove(Math.random() * 100,Math.random() * 100);
}
