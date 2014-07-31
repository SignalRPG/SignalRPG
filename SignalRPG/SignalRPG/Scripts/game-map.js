//map engine. loads a map json file and renders it
function Map(name) {
    var _self = this;

    //layers determine the order in which tiles are drawn. this is not necessarily the same
    //as the map generator layers. layers are built with the tile priorities; higher values being
    //drawn last.
    var _layers = [];

    //get the map json file and build the map
    function initialize() {
        //get the json
        $.getJSON('/resources/maps/' + name + '.json', {}, function (data) {
            //json loaded

            //step 1: get size of map

            //setp 2: separate the layers out into logical layers to be drawn

            //get all tiles with prioriry 0, and layer them first

            //then, get all tiles with priority 1, and layer them last
        });

    }
}