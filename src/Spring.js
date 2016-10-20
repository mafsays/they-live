import Vec2D from 'vector2d';

var tempVector = Vec2D.ObjectVector(0,0);

export default class Spring {

    constructor({ damping = 0.8, springiness = 0.1 } = {}){
        this._anchor = Vec2D.ObjectVector(0, 0);
        this._speed = Vec2D.ObjectVector(0, 0);
        this._offsetPosition = Vec2D.ObjectVector(0, 0);
        this.reset();

        this.damping = damping; // 0 - 1 : 0 will not move, 1 will oscillate forever
        this.springiness = springiness; // higher value => firmer spring

        this._minSpeed = 0.01; // stops updates when values get meaningless
    }

    reset(){
        this._offsetPosition.zero();
        this._speed.zero();
        this.isActive = false;
    }

    update(){
        if( !this.isActive ){
            return;
        }
        tempVector.zero();
        var acceleration = tempVector.subtract(this._offsetPosition).multiplyByScalar(this._springiness);
        //(this._anchor - this._offsetPosition) * this._springiness;
        this._speed.add(acceleration);
        this._speed.multiplyByScalar(this._damping);
        //this._speed = Math.min( Math.max(this._speed, -this.max), this.max);
        this._offsetPosition.add(this._speed);
        if( ( this._speed.lengthSq() < this._minSpeed * this._minSpeed ) && ( acceleration.lengthSq() < this._minSpeed ) )
        {
            this.reset();
        }
    }

    /**
     * set anchor position
     */
    anchor( x = 0, y = 0 ){
        this._anchor.x = x;
        this._anchor.y = y;
        this.isActive = true;
    }

    /**
     * immediately repositions current position and releases
     */
    twang( x = 0, y = 0 ){
        this._offsetPosition.x = this._anchor.x + x;
        this._offsetPosition.y = this._anchor.y + y;
        this.isActive = true;
    }

    /**
     * pushes the target by affecting it's speed
     */
    shove( x = 0, y = 0 ){
        this._speed.x += x;
        this._speed.y += y;
        this.isActive = true;
    }

    get x(){
        return this._anchor.x + this._offsetPosition.x;
    }

    get y(){
        return this._anchor.y + this._offsetPosition.y;
    }

    get position(){
        return { x: this.x, y: this.y };
    }

    get offsetX(){
        return this._offsetPosition.x;
    }

    get offsetY(){
        return this._offsetPosition.y;
    }

    get offset(){
        return { x: this._offsetPosition.x, y: this._offsetPosition.y };
    }

    set damping(value){
        this._damping = value;
    }

    set springiness(value){
        this._springiness = value;
    }

}
