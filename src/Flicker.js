export default class Flicker {

    constructor({ maxDuration = 15, minDuration = 1, maxInterval = 60, minInterval = 5 } ){
        this._on = false;

        this.maxDuration = maxDuration;
        this.minDuration = minDuration;

        this.maxInterval = maxInterval;
        this.minInterval = minInterval;

        this.reset();

    }

    reset(){
        this._count = 0;
    }

    update(){
        this._count--;
        if( this._count < 0 ){
            if( this._on ){
                this._count = this._getInterval( this.minInterval, this.maxInterval );
                this._on = false;
                return -1
            } else {
                this._count = this._getInterval( this.minDuration, this.maxDuration );
                this._on = true;
                return 1;
            }
        }
        return 0;
    }

    get on(){
        return this._on;
    }

    _getInterval( min, max ){
        return min + Math.round( Math.random() * ( max - min ) );
    }

}
