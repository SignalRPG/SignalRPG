/// <reference path="grid.js" />

function Character(graphic, charx, chary, direction, name) {
    var that = this;

    this.x = charx;
    this.y = chary;
    this.drawX = this.x * Tile.WIDTH;
    this.drawY = this.y * Tile.HEIGHT;
    this.name = name;
    var _distDestX = 0;
    var _distDestY = 0;
    this.isMoving = false;
    this.dead = false;
    this.image = new Image();
    this.imageX = 0;
    this.imageY = direction;
    this.direction = direction;

    this.frames = 4;
    this.currentFrame = 0;
    var time;
    var counter = 0;
    var moveTime;
    var imgWidth = 0;
    var imgHeight = 0;

    this.image.onload = function () {
        imgWidth = that.image.width / 4;
        imgHeight = that.image.height / 4;
    };

    this.image.src = graphic;


    //requests a new frame index for the animation
    this.requestFrame = function () {
        //if we have only 1 frame, or frame count is 0, then ignore
        if (that.frames < 2 || !that.isMoving) {

            return;
        }

        var now = new Date().getTime();
        var dt = now - (time || now);
        counter += dt;
        time = now;

        if (counter >= 1000 / that.frames) {


            that.currentFrame++


            //check to make sure its not greater than the number of frames
            if (that.currentFrame > that.frames - 1) that.currentFrame = 0;
            //coords
            that.imageX = (that.currentFrame);
            counter = 0;
            //console.log(that.imageX);
        }

    };

    this.turn = function (direction) {
        if (!that.isMoving) {
            that.imageY = direction;
            that.direction = direction;
        }
    }

    //forces the character to the destination
    this.stop = function () {
        if (this.isMoving) {
            that.isMoving = false;
        }
    }

    //move character to a new spot on the grid
    this.jumpTo = function (x, y) {
        if (!that.isMoving) {
            that.x = x;
            that.y = y;
        }
    }

    //move character to a new spot on the grid
    this.moveTo = function (x, y) {
        if (!that.isMoving) {
            var oldX = that.x;
            var oldY = that.y;
            that.x = x;
            that.y = y;

            _distDestX = (that.x * Tile.WIDTH - oldX * Tile.WIDTH) / 15;
            _distDestY = (that.y * Tile.HEIGHT - oldY * Tile.HEIGHT) / 15;

            that.isMoving = true;
            //do this until we reach our dest
            //window.requestAnimationFrame(move);
        }
    }


    this.update = function () {
        //move the character until we reach x
        if (that.isMoving) {
            var now = new Date().getTime();
            var dt = now - (moveTime || now);

            that.drawX += (_distDestX / Tile.WIDTH) * dt;
            that.drawY += (_distDestY / Tile.HEIGHT) * dt;
            moveTime = now;
            if ((_distDestX > 0 && that.drawX / Tile.WIDTH >= this.x)) {
                that.drawX = this.x * Tile.WIDTH;
                that.isMoving = false;
                moveTime = null;
            }

            if ((_distDestX < 0 && that.drawX / Tile.WIDTH <= this.x)) {
                that.drawX = this.x * Tile.WIDTH;
                that.isMoving = false;
                moveTime = null;
            }

            if ((_distDestY > 0 && that.drawY / Tile.HEIGHT >= this.y)) {
                that.drawY = this.y * Tile.HEIGHT;
                that.isMoving = false;
                moveTime = null;
            }

            if ((_distDestY < 0 && that.drawY / Tile.HEIGHT <= this.y)) {
                that.drawY = this.y * Tile.HEIGHT;
                that.isMoving = false;
                moveTime = null;
            }



        }

    }

    //draw
    this.draw = function (ctx) {
        if (imgHeight == 0 || imgWidth == 0 || that.dead) return;

        this.update();

        //draw character
        ctx.drawImage(that.image, that.imageX * imgWidth, that.imageY * imgHeight, imgWidth, imgHeight,
            that.drawX, that.drawY - (imgHeight - Tile.HEIGHT), imgWidth, imgHeight);

        ctx.fillStyle = "rgb(255,255,255)";
        var width = ctx.measureText(that.name).width;
        ctx.fillText(that.name, that.drawX - (width - imgWidth) / 2, that.drawY - (imgHeight - Tile.HEIGHT) - 10);

        that.requestFrame();
    }
}