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

            var layer = _bottomLayers[0];
            //edge detection
            for (var i = 0; i < _self.size.width; i++) {
                for (var j = 0; j < _self.size.height; j++) {
                    var tile = layer.tiles[i][j];
                    var tiles = layer.tiles;

                    if (tile != null && tile.set == 1) {
                        //look around the tile
                        var xb = i - 1;
                        var xa = i + 1;
                        var yb = j - 1;
                        var ya = j + 1;

                        if (xb < 0 || xa > _self.size.width - 1 || yb < 0 || ya > _self.size.height - 1) {
                            continue;
                        }


                        //check to see if the tile has anything else around it
                        if (tiles[i][yb] != null && tiles[i][yb].set == 0) {
                            tile.type |= AUTOTILE_TOP;
                        }
                        if (tiles[xa][j] != null && tiles[xa][j].set == 0) {
                            tile.type |= AUTOTILE_RIGHT;
                        }
                        if (tiles[i][ya] != null && tiles[i][ya].set == 0) {
                            tile.type |= AUTOTILE_BOTTOM;
                        }
                        if (tiles[xb][j] != null && tiles[xb][j].set == 0) {
                            tile.type |= AUTOTILE_LEFT;
                        }

                    }

                }
            }



            //edge detection
            for (var i = 0; i < _self.size.width; i++) {
                for (var j = 0; j < _self.size.height; j++) {
                    var tile = layer.tiles[i][j];
                    var tiles = layer.tiles;

                    if (tile != null && tile.set == 1) {
                        //look around the tile
                        var xb = i - 1;
                        var xa = i + 1;
                        var yb = j - 1;
                        var ya = j + 1;

                        if (xb < 0 || xa > _self.size.width - 1 || yb < 0 || ya > _self.size.height - 1) {
                            continue;
                        }


                        //check if inner corner
                        if (tiles[i][yb] != null && tiles[i][yb].type & (AUTOTILE_TOP | AUTOTILE_RIGHT)
                            && tiles[xa][j] != null && tiles[xa][j].type & (AUTOTILE_TOP)) {

                            tile.type = AUTOTILE_INNER_TOP_RIGHT;
                        }

                        if (tiles[i][yb] != null && tiles[i][yb].type & (AUTOTILE_TOP | AUTOTILE_LEFT)
                            && tiles[xb][j] != null && tiles[xb][j].type & (AUTOTILE_TOP)) {

                            tile.type = AUTOTILE_INNER_TOP_LEFT;
                        }

                    }

                }
            }










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

                        //TEST
                        if (tile.type > 0) {
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = 'rgb(255,255,255)';
                            ctx.strokeRect(i * TILE_W, j * TILE_H, TILE_W, TILE_H);

                            ctx.fillStyle = 'rgb(255,255,255)';
                            ctx.font = '14pt Calibri';
                            ctx.textAlign = '';
                            var m = ctx.measureText(tile.type);
                            ctx.fillText(tile.type, i * TILE_W + ((TILE_W) - m.width) / 2, j * TILE_H + ((TILE_H) - 14 / 2) / 2);

                        }

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