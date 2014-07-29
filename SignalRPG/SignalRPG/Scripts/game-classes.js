
//tileset directional movement
var DIRECTION_NONE = 0;
var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 4;
var DIRECTION_LEFT = 8;
var DIRECTION_ALL = 15;

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