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