function Layer()
{
    var that = this;

    this.imageX = 0;
    this.imageY = 0;
    this.set = 0;
    this.frames = 0;
    this.currentFrame = 0;
    var time;
    var counter = 0;
    this.originalX = 0;
    //requests a new frame index for the animation
    this.requestFrame = function () {
        //if we have only 1 frame, or frame count is 0, then ignore
        if (that.frames < 2) return;
        
        var now = new Date().getTime();
        var dt = now - (time || now);
        counter += dt;
        time = now;

        if (counter >= 1000 / that.frames)
        {
            //coords
            that.imageX = (that.currentFrame * 3) + that.originalX;

            that.currentFrame++
            //check to make sure its not greater than the number of frames
            if (that.currentFrame > that.frames - 1) that.currentFrame = 0;

            

            counter = 0;
        }

    };
}

function Tile() {

    this.object = null; //the object occupying the tile
    this.layers = [];
}

Tile.WIDTH = 32;    //the width of each tile
Tile.HEIGHT = 32;   //the height of each tile
