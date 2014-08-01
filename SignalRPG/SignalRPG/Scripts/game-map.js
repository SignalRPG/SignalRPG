/// <reference path="game-classes.js" />

//map engine. loads a map json file and renders it
function Map(name) {
    var _self = this;

    //size of map
    this.size = new Size(0, 0);
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
            _self.size = new Size(data.size.width, data.size.height);

            //setp 2: separate the layers out into logical layers to be drawn
            //get all tiles with prioriry 0, and layer them first
            createLayers(data, PRIORITY_BELOW);

            //then, get all tiles with priority 1, and layer them last
            createLayers(data, PRIORITY_ABOVE);

            debugger
        });

    }

    //create layers from map data
    function createLayers(data, priority) {

        for (var k = 0; k < data.layers.length; k++) {
            var layer = data.layers[k];

            var tiles = [];

            //scan for priority 0 tiles
            for (var i = 0; i < _self.size.width; i++) {
                for (var j = 0; j < _self.size.width; j++) {
                    var tile = layer.tiles[i][j];
                    if (tile == null) {
                        continue;
                    }

                    //check priority
                    if (tile.priority == priority) {
                        tiles.push(tile);
                    }
                }
            }
            //if there are any tiles in the array, we push a new layer onto the stack
            if (tiles.length > 0) {
                _layers.push({ tiles: tiles });
            }
        }

    }

    //initialize the map
    initialize();
}