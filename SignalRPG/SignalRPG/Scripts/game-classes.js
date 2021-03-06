﻿
//size of tiles in pixels
var TILE_W = 32;
var TILE_H = 32;

//tileset directional movement
var DIRECTION_NONE = 0;
var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 4;
var DIRECTION_LEFT = 8;
var DIRECTION_ALL = 15;

//autotile type
var AUTOTILE_TOP = 1;
var AUTOTILE_RIGHT = 2;
var AUTOTILE_BOTTOM = 4;
var AUTOTILE_LEFT = 8;
var AUTOTILE_INNER_TOP_RIGHT = 16;
var AUTOTILE_INNER_TOP_LEFT = 32;
var AUTOTILE_INNER_BOTTOM_RIGHT = 64;
var AUTOTILE_INNER_BOTTOM_LEFT = 128;
var AUTOTILE_NONE = 256;

//tileset tile rendering priority. tiles with lower priority are drawn first, character is drawn after
//all priority 0 tiles so that he is above them. tiles with higher priority are drawn last so that they
//appear above him
var PRIORITY_BELOW = 0;
var PRIORITY_ABOVE = 1;


//creates a 2 dimensional array represented in x, y
function Array2D(x, y) {
    //create x axis
    var _arr = new Array(x);

    for (var i = 0; i < x; i++) {
        //add new element to the y axis
        _arr[i] = new Array(y);
    }

    return _arr;
}

//point. encapsulates two int values
function Point(x, y)
{
    var _self = this;

    this.x = x || 0;
    this.y = y || 0;
}

//size. encapsulates two int values
function Size(width, height) {
    var _self = this;

    this.width = width || 0;
    this.height = height || 0;

    //returns the square area
    this.area = function () {
        return _self.width * _self.height;
    }
}

//rectangle
function Rect(x, y, width, height) {
    var _self = this;

    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
}

//process game time. game time is used to measure the time between each frame, allowing
//you to control the framerate of animations.
function GameTime() {
    //self reference
    var _self = this;
    var _time = null;

    //time system game started
    this.elapsedTime = 0;
    this.frameTime = 0;

    //updates the gametime
    this.update = function () {
        //get current time
        var now = new Date().getTime();

        //get time system last call
        var dt = now - (_time || now);
        //increase elapsed time
        _self.elapsedTime += dt;
        _self.frameTime = dt;

        //set time to now
        _time = now;

    }
}