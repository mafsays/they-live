import PIXI from 'pixi.js';
import Spring from './Spring';

export default class Glitch{

    constructor( containerSprite, displacementTexture ){
        let displacementSprite = new PIXI.Sprite(displacementTexture);
        displacementSprite.scale.y = 2;
        let displacementFilter = new PIXI.filters.DisplacementFilter( displacementSprite );
        containerSprite.addChildAt( displacementSprite, 0 );
        containerSprite.filters = [displacementFilter];

        this.spring = new Spring({ damping: 0.85, springiness: 0.29 });
        this.count = 0;
        this.count2 = 0;
        this.period = 200;
        this.displacementFilter = displacementFilter;
        this.containerSprite = containerSprite;
        this.displacementSprite = displacementSprite;
        this.resize();
        this.enabled = true;
    }

    update(){
        if( this._enabled ){
            this.count --;
            if( this.count <= 0 ){
                this.glitch();
            }


            // TODO: flicker?
        }
        this.count2 += 0.1;
        if( this.spring.isActive ){
            this.spring.update();
            this.displacementFilter.scale.x = this.spring.x;
            //this.displacementFilter.scale.y = this.spring.y;
            this.displacementFilter.scale.y = 1//2 + Math.sin(this.count2) * 2;
        }
    }

    glitch(){
        this.spring.twang(
            5 + Math.random() * 10 * 0.75,
            Math.random() * 5
        );
        this.count = Math.round( Math.random() * this.period );
    }

    resize( width = this.containerSprite.width, height = this.containerSprite.height ){
        this.displacementSprite.width = width;
        this.displacementSprite.height = height;
    }

    set enabled(value){
        this._enabled = value;
    }

    get enabled(){
        return this._enabled;
    }

}
