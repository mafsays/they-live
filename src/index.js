//import 'babel-polyfill';
import PIXI from 'pixi.js';
import Spring from './Spring';
import Flicker from './Flicker';
import Glitch from './Glitch';

let renderer;
let stage;
let container;
let screenContainer;
let glitchContainer;
let image;
let truth;
let mask;
let spring;
let flicker;
let glitch;
let assets = ['image.jpg','glitch.png','pixeloverlay.png','tellyframe.png','tellyscreen.png','truth.jpg'];

for( let asset of assets ){
    PIXI.loader.add('assets/' + asset);
}
PIXI.loader.load(onAssetsLoaded);

function onAssetsLoaded(){
    let frame = PIXI.Sprite.from("assets/tellyframe.png");
    renderer = PIXI.autoDetectRenderer(frame.width, frame.height);
    document.body.appendChild(renderer.view);

    stage = new PIXI.Container();
    container = new PIXI.Container();
    stage.addChild(container);

    screenContainer = new PIXI.Container();
    screenContainer.position.set(101, 85)
    container.addChild(screenContainer);

    glitchContainer = new PIXI.Container();
    screenContainer.addChild(glitchContainer);

    image = PIXI.Sprite.from("assets/image.jpg");
    image.scale.set(0.81);
    truth = PIXI.Sprite.from("assets/truth.jpg");
    truth.scale.set(0.81);
    glitchContainer.addChild(image);
    glitchContainer.addChild(truth);

    let pixels = new PIXI.extras.TilingSprite(PIXI.Texture.from('assets/pixeloverlay.png'), image.width, image.height);
    pixels.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    pixels.alpha = 0.6;
    screenContainer.addChild(pixels);

    let screenSurface = PIXI.Sprite.from('assets/tellyscreen.png');
    screenSurface.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    screenSurface.alpha = 0.6;
    container.addChild(screenSurface);

    container.addChild(frame);



    mask = new PIXI.Graphics().beginFill(0).drawCircle(0, 0, 150);



    //truth.mask = mask;
    //container.addChild(mask);

    container.interactive = true;
    container.on('mousedown', pop );


    spring = new Spring({ damping: 0.95, springiness: 0.1 });
    const params = { children: 0 }
    flicker = new Flicker({children:0});

    glitch = new Glitch( screenContainer, PIXI.Texture.from("assets/glitch.png"));
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

    glitchContainer.alpha = 0.9 + Math.random() * 0.1;
    glitchContainer.position.copy( spring );
    if( Math.random() < 0.02 )
    {
        spring.twang( Math.random() * 1, Math.random() * 1 );
    }

    console.log(image.x);
    //mask.position.copy(renderer.plugins.interaction.mouse.global);
    renderer.render(stage);
    requestAnimationFrame(update);
}

function pop(){
    spring.shove(Math.random() * 100,Math.random() * 100);
}
