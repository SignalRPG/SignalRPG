/// <reference path="game-classes.js" />
/// <reference path="game-sprite.js" />

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

    //contains all of the objects on the map, including characters, monsters, NPCs and other
    //interactable things controlled by the server.
    var _mapObjects = [];

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
                    autotile: tileset.autotile,
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

    //gets the tile dimensions based on the type
    function getTileDimensions(tile) {
        var flags = tile.type;
        var extraFlags = 0;
        var dims = [];
        
        //strip out the extra flags so we can render the tiles
        if (flags & AUTOTILE_INNER_TOP_RIGHT) {
            flags &= ~AUTOTILE_INNER_TOP_RIGHT;

            extraFlags |= AUTOTILE_INNER_TOP_RIGHT;
        }

        if (flags & AUTOTILE_INNER_BOTTOM_RIGHT) {
            flags &= ~AUTOTILE_INNER_BOTTOM_RIGHT;

            extraFlags |= AUTOTILE_INNER_BOTTOM_RIGHT;
        }

        if (flags & AUTOTILE_INNER_TOP_LEFT) {
            flags &= ~AUTOTILE_INNER_TOP_LEFT;

            extraFlags |= AUTOTILE_INNER_TOP_LEFT;
        }

        if (flags & AUTOTILE_INNER_BOTTOM_LEFT) {
            flags &= ~AUTOTILE_INNER_BOTTOM_LEFT;

            extraFlags |= AUTOTILE_INNER_BOTTOM_LEFT;
        }

        //render edges
        if (flags == (AUTOTILE_TOP)) {
            dims.push({ x: 1, y: 1, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == (AUTOTILE_RIGHT)) {
            dims.push({ x: 2, y: 2, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == (AUTOTILE_BOTTOM)) {
            dims.push({ x: 1, y: 3, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == (AUTOTILE_LEFT)) {
            dims.push({ x: 0, y: 2, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == (AUTOTILE_LEFT | AUTOTILE_RIGHT | AUTOTILE_TOP)) {
            dims.push({ x: 0, y: 1, width: TILE_W / 2, height: TILE_H, offsetX: 0, offsetY: 0 });
            dims.push({ x: 5, y: 1, width: TILE_W / 2, height: TILE_H, offsetX: TILE_W / 2, offsetY: 0 });
        } else if (flags == (AUTOTILE_LEFT | AUTOTILE_TOP | AUTOTILE_BOTTOM)) {
            dims.push({ x: 0, y: 2, width: TILE_W, height: TILE_H / 2, offsetX: 0, offsetY: 0 });
            dims.push({ x: 0, y: 7, width: TILE_W, height: TILE_H / 2, offsetX: 0, offsetY: TILE_H / 2 });
        } else if (flags == (AUTOTILE_RIGHT | AUTOTILE_TOP | AUTOTILE_BOTTOM)) {
            dims.push({ x: 2, y: 2, width: TILE_W, height: TILE_H / 2, offsetX: 0, offsetY: 0 });
            dims.push({ x: 2, y: 7, width: TILE_W, height: TILE_H / 2, offsetX: 0, offsetY: TILE_H / 2 });
        } else if (flags == (AUTOTILE_LEFT | AUTOTILE_RIGHT | AUTOTILE_BOTTOM)) {
            dims.push({ x: 0, y: 3, width: TILE_W / 2, height: TILE_H, offsetX: 0, offsetY: 0 });
            dims.push({ x: 5, y: 3, width: TILE_W / 2, height: TILE_H, offsetX: TILE_W / 2, offsetY: 0 });
        } else if (flags == (AUTOTILE_LEFT | AUTOTILE_RIGHT)) {
            dims.push({ x: 0, y: 2, width: TILE_W / 2, height: TILE_H, offsetX: 0, offsetY: 0 });
            dims.push({ x: 5, y: 2, width: TILE_W / 2, height: TILE_H, offsetX: TILE_W / 2, offsetY: 0 });
        } else if (flags == (AUTOTILE_TOP | AUTOTILE_BOTTOM)) {
            dims.push({ x: 1, y: 2, width: TILE_W, height: TILE_H / 2, offsetX: 0, offsetY: 0 });
            dims.push({ x: 1, y: 7, width: TILE_W, height: TILE_H / 2, offsetX: 0, offsetY: TILE_H / 2 });
        } else if (flags == (AUTOTILE_LEFT | AUTOTILE_TOP)) {
            dims.push({ x: 0, y: 1, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == (AUTOTILE_RIGHT | AUTOTILE_TOP)) {
            dims.push({ x: 2, y: 1, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == (AUTOTILE_LEFT | AUTOTILE_BOTTOM)) {
            dims.push({ x: 0, y: 3, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == (AUTOTILE_RIGHT | AUTOTILE_BOTTOM)) {
            dims.push({ x: 2, y: 3, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == (AUTOTILE_LEFT | AUTOTILE_RIGHT | AUTOTILE_TOP | AUTOTILE_BOTTOM)) {
            dims.push({ x: 0, y: 0, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else if (flags == AUTOTILE_NONE) {
            dims.push({ x: 1, y: 2, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        } else {
            dims.push({ x: tile.srcX, y: tile.srcY, width: TILE_W, height: TILE_H, offsetX: 0, offsetY: 0 });
        }


        //render inner corner tiles
        if (extraFlags & AUTOTILE_INNER_TOP_RIGHT) {
            dims.push({ x: 5, y: 0, width: TILE_W / 2, height: TILE_H / 2, offsetX: 16, offsetY: 0 });
        }

        if (extraFlags & AUTOTILE_INNER_BOTTOM_RIGHT) {
            dims.push({ x: 5, y: 1, width: TILE_W / 2, height: TILE_H / 2, offsetX: 16, offsetY: 16 });
        }

        if (extraFlags & AUTOTILE_INNER_TOP_LEFT) {
            dims.push({ x: 4, y: 0, width: TILE_W / 2, height: TILE_H / 2, offsetX: 0, offsetY: 0 });
        }

        if (extraFlags & AUTOTILE_INNER_BOTTOM_LEFT) {
            dims.push({ x: 4, y: 1, width: TILE_W / 2, height: TILE_H / 2, offsetX: 0, offsetY: 16 });
        }

        //return the dimensions
        return dims;
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

                        //get the tiles dimensions
                        var dimensions = getTileDimensions(tile);

                        for (var l = 0; l < dimensions.length; l++) {
                            var d = dimensions[l];

                            //calculate the frame to draw. for animated tiles
                            var srcX = d.x + (tile.frameIndex * (TILE_W / d.width) * tileset.size.width);

                            //draw tile
                            ctx.drawImage(tileset.image,
                                srcX * d.width, d.y * d.height, d.width, d.height,                      /*source*/
                                i * TILE_W + d.offsetX, j * TILE_H + d.offsetY, d.width, d.height);     /*destination*/
                        }

                        //TEST
                        //if (tile.type > 0) {

                        //    ctx.strokeStyle = 'rgb(255,255,255)';
                        //    ctx.strokeRect(i * TILE_W, j * TILE_H, TILE_W, TILE_H);

                        //    ctx.fillStyle = 'rgb(255,255,255)';
                        //    ctx.font = '14pt Calibri';
                        //    ctx.textAlign = '';
                        //    var m = ctx.measureText(tile.type);
                        //    ctx.fillText(tile.type, i * TILE_W + ((TILE_W) - m.width) / 2, j * TILE_H + ((TILE_H) - 14 / 2) / 2);

                        //}

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

        for (var k = 0; k < _mapObjects.length; k++) {
            var obj = _mapObjects[k];
            //draw characters and such
            ctx.fillStyle = obj.Color;
            ctx.fillRect(obj.X * TILE_W, obj.Y * TILE_H, TILE_W, TILE_H);
        }

        //draw top layers
        drawLayers(ctx, gameTime, _topLayers);

        //draw always-on-top characters (like birds and butterflies)
    };

    //pushes an object onto the map object stack
    this.pushMapObject = function (obj) {
        //add object to map
        _mapObjects.push(obj);
    };

    //finds a map object by its id
    this.findMapObjectById = function (id) {
        //find the object based on its id
        for (var k = 0; k < _mapObjects.length; k++) {
            if (_mapObjects[k].ID === id) {
                return _mapObjects[k];
            }
        }

        return null;
    };

    //finds a map object by its id
    this.deleteMapObjectById = function (id) {
        //find the object based on its id
        for (var k = 0; k < _mapObjects.length; k++) {
            if (_mapObjects[k].ID === id) {
                //remove the item at the element's id
                _mapObjects.splice(k, 1);
                break;
            }
        }

    };

    //initialize the map
    initialize();
}