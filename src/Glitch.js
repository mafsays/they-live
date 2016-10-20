var PIXI = reqire('PIXI');
var Spring = require('Spring');

export default class Glitch{

    constructor( containerSprite, displacementTexture ){
        let displacementSprite = new PIXI.Sprite(displacementTexture);
        let displacementFilter = new PIXI.filters.DisplacementFilter( displacementSprite );
        containerSprite.addChildAt( displacementSprite, 0 );
        containerSprite.filters = [displacementFilter];

        this.spring = new Spring();
        this.count = 0;
        this.period = 200;
        this.displacementFilter = displacementFilter;
    }

    update(){
        if( this.count <= 0 ){
            this.spring.twang(
                5 + Math.random() * 10 * 0.75,
                Math.random() * 5
            );
            this.count = Math.round( Math.random() * this.period );
        }

        this.displacementFilter.scale.x = this.spring.x;
        this.displacementFilter.scale.y = this.spring.y;

        // TODO: flicker?
    }

}
