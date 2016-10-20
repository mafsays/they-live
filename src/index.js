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
    scaleToWindow(renderer.view);
    window.addEventListener("resize", function(event){
      scaleToWindow(renderer.view);
    });
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

function scaleToWindow(canvas, backgroundColor) {

  backgroundColor = backgroundColor || "#000000";
  var scaleX, scaleY, scale, center;

  //1. Scale the canvas to the correct size
  //Figure out the scale amount on each axis
  scaleX = window.innerWidth / canvas.offsetWidth;
  scaleY = window.innerHeight / canvas.offsetHeight;

  //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
  scale = Math.min(scaleX, scaleY);
  canvas.style.transformOrigin = "0 0";
  canvas.style.transform = "scale(" + scale + ")";
  console.log(scaleX)

  //2. Center the canvas.
  //Decide whether to center the canvas vertically or horizontally.
  //Wide canvases should be centered vertically, and
  //square or tall canvases should be centered horizontally
  if (canvas.offsetwidth > canvas.offsetHeight) {
    if (canvas.offsetWidth * scale < window.innerWidth) {
      center = "horizontally";
    } else {
      center = "vertically";
    }
  } else {
    if (canvas.offsetHeight * scale < window.innerHeight) {
      center = "vertically";
    } else {
      center = "horizontally";
    }
  }

  //Center horizontally (for square or tall canvases)
  var margin;
  if (center === "horizontally") {
    margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
    canvas.style.marginTop = 0;
    canvas.style.marginBottom = 0;
    canvas.style.marginLeft = margin + "px";
    canvas.style.marginRight = margin + "px";
  }

  //Center vertically (for wide canvases)
  if (center === "vertically") {
    margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
    canvas.style.marginTop = margin + "px";
    canvas.style.marginBottom = margin + "px";
    canvas.style.marginLeft = 0;
    canvas.style.marginRight = 0;
  }

  //3. Remove any padding from the canvas  and body and set the canvas
  //display style to "block"
  canvas.style.paddingLeft = 0;
  canvas.style.paddingRight = 0;
  canvas.style.paddingTop = 0;
  canvas.style.paddingBottom = 0;
  canvas.style.display = "block";

  //4. Set the color of the HTML body background
  document.body.style.backgroundColor = backgroundColor;

  //Fix some quirkiness in scaling for Safari
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("safari") != -1) {
    if (ua.indexOf("chrome") > -1) {
      // Chrome
    } else {
      // Safari
      //canvas.style.maxHeight = "100%";
      //canvas.style.minHeight = "100%";
    }
  }

  //5. Return the `scale` value. This is important, because you'll nee this value
  //for correct hit testing between the pointer and sprites
  return scale;
}
