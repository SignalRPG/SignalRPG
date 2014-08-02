/// <reference path="game-classes.js" />

//map engine. loads a map json file and renders it
function Map(name, loaded) {
    var _self = this;

    //size of map
    this.size = new Size(0, 0);
    //indicates that the map has been loaded
    this.mapLoaded = false;
    //tilesets. images to draw on a tile
    var _tilesets = [];

    //layers determine the order in which tiles are drawn. this is not necessarily the same
    //as the map generator layers. layers are built with the tile priorities; higher values being
    //drawn last.
    var _bottomLayers = [];
    var _topLayers = [];

    //get the map json file and build the map
    function initialize() {
        //get the json
        $.getJSON('/resources/maps/' + name + '.json', {}, function (data) {
            //json loaded

            //get size of map
            _self.size = new Size(data.size.width, data.size.height);

            //get the tilesets
            for (var k = 0; k < data.tilesets.length; k++) {
                var tileset = data.tilesets[k];

                var img = new Image();
                img.src = tileset.src;
                var set = {
                    image: img,
                    frames: tileset.frames,
                    size: tileset.size
                };
                //add tileset to array
                _tilesets.push(set);
            }

            //separate the layers out into logical layers to be drawn
            //get all tiles with prioriry 0, and layer them first
            createLayers(data, _bottomLayers, PRIORITY_BELOW);

            //then, get all tiles with priority 1, and layer them last
            createLayers(data, _topLayers, PRIORITY_ABOVE);

            //map is loaded
            _self.mapLoaded = true;

            //loaded callback
            if (typeof loaded == 'function') {
                loaded();
            }
        });

    }

    //create layers from map data
    function createLayers(data, layers, priority) {

        for (var k = 0; k < data.layers.length; k++) {
            var layer = data.layers[k];

            //create tile matrix for layer
            var tiles = new Array2D(_self.size.width, _self.size.height);
            //flag to indicate if we added any tiles to the matrix
            var addedTile = false;

            //scan for priority 0 tiles
            for (var i = 0; i < _self.size.width; i++) {
                for (var j = 0; j < _self.size.height; j++) {
                    var tile = layer.tiles[i][j];

                    //skip adding the tile if it contains no data
                    if (tile == null) {
                        continue;
                    }

                    //check priority
                    if (tile.priority == priority) {

                        //add a frame index
                        tile.frameIndex = 0;
                        tile.frameCounter = 0;
                        //set tile
                        tiles[i][j] = tile;
                        //we added a tile, set the flag
                        addedTile = true;
                    }
                }
            }
            //if there are any tiles in the array, we push a new layer onto the stack
            if (addedTile) {
                layers.push({ tiles: tiles });
            }
        }

    }
    var _frameCounter = 0;
    //draws an array of layers to the buffer
    function drawLayers(ctx, gameTime, layers) {
        //render the layer onto the backbuffer
        for (var k = 0; k < layers.length; k++) {
            var layer = layers[k];

            for (var i = 0; i < layer.tiles.length; i++) {
                for (var j = 0; j < layer.tiles[i].length; j++) {
                    var tile = layer.tiles[i][j];
                    if (tile != undefined && tile != null) {
                        //get tileset to draw
                        var tileset = _tilesets[tile.set];

                        //calculate the frame to draw. for animated tiles
                        var srcX = tile.srcX + (tile.frameIndex * tileset.size.width);
                                                
                        //draw tile
                        ctx.drawImage(tileset.image,
                            srcX * TILE_W, tile.srcY * TILE_H, TILE_W, TILE_H,
                            i * TILE_W, j * TILE_H, TILE_W, TILE_H);

                        

                        //when we are finished drawing, update the frame index for that tile so the next time
                        //we draw it, we draw from the next frame on the tileset.
                        if (tileset.frames > 1) {
                            //update the frame counter
                            tile.frameCounter += gameTime.frameTime;

                            //when the frame counter is greater than or equal to x time, update and reset counter
                            if (tile.frameCounter >= 250) {
                                //update frame index
                                tile.frameIndex++;
                                //if we have gone past the frame count -1, then reset back to 0
                                if (tile.frameIndex > tileset.frames - 1) {
                                    tile.frameIndex = 0;
                                }
                                //reset the tile frame counter
                                tile.frameCounter = 0;
                            }
                        }
                    }
                }
            }

        }

       
    }

    //drawing
    this.draw = function (ctx, gameTime) {

        //draw bottom layers
        drawLayers(ctx, gameTime, _bottomLayers);

        //draw characters and such
        ctx.fillStyle = 'rgb(0,128,255)';
        ctx.fillRect(7 * TILE_W, 7 * TILE_H, TILE_W, TILE_H);

        //draw top layers
        drawLayers(ctx, gameTime, _topLayers);

        //draw always on top characters (like birds and things)
    }

    //initialize the map
    initialize();
}