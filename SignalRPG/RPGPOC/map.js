/// <reference path="grid.js" />
/// <reference path="character.js" />
/// <reference path="scripts/jquery-2.1.1.min.js" />

function Map(name, done) {

    var that = this;
    var image = [];     //stores loaded tilesets


    //create a grid
    this.tiles = []; //2 dimensional array of tiles

   

    this.maxX = 0;
    this.maxY = 0;

    this.width = 0;
    this.height = 0;

    this.objects = []; //objects to draw ( so we don't have to loop through the entire matrix to find them

    this.bounds = {
        top: null,
        right: null,
        bottom: null,
        left: null
    }

    this.title = "";

    //initializes the map
    function init() {
        //load the map data
        $.getJSON('/resources/maps/' + name + '.json', {}, function (data) {
            //set max x and y
            that.maxX = data.x;
            that.maxY = data.y;

            //build the matrix
            for (var i = 0; i < that.maxX; i++) {

                //push on a new col (x)
                that.tiles.push([]);

                for (var j = 0; j < that.maxY; j++) {
                    //push on a new row (y)
                    that.tiles[i].push(new Tile());
                }
            }

            //set the width and height
            that.width = that.maxX * Tile.WIDTH;
            that.height = that.maxY * Tile.HEIGHT;
            //other stuff
            that.bounds = data.bounds;
            that.title = data.title;

            for (var k = 0; k < data.tileSets.length; k++) {
                var tileSet = data.tileSets[k];

                //create new image
                var img = new Image();

                //load objects to draw
                img.onload = function () {
                    //load each layer
                    for (var i = 0; i < data.layers.length; i++) {
                        var layer = data.layers[i];

                        //for each tile in the layer, create an object for it to draw
                        for (var j = 0; j < layer.tiles.length; j++) {
                            var tile = layer.tiles[j];

                            if (tile.style == "fill") {
                                fillLayer(tile);
                            } else {

                                //update the tile object in the matrix
                                var mapTile = that.tiles[tile.x][tile.y];

                                //create a new tile layer
                                var tileLayer = createLayer(mapTile, tile);

                                //add layer to the maptile
                                mapTile.layers.push(tileLayer);
                            }
                        }
                    }
                    console.log("Map image loaded");
                }
                img.src = tileSet.url;

                //push image on to the stack
                image.push(img);
            }

            //map loaded
            console.log("Map loaded");
            done(that);
        });
    }

    //fills a layer with a specific tile
    function fillLayer(tile) {
        for (var i = 0; i < that.maxX; i++) {
            for (var j = 0; j < that.maxY; j++) {

                //get the tile object in the matrix
                var mapTile = that.tiles[i][j];

                //create a new tile layer
                var tileLayer = createLayer(mapTile, tile);

                //add layer to the maptile
                mapTile.layers.push(tileLayer);
            }
        }
    }

    //create a layer for the specified tile
    function createLayer(mapTile, tile) {

        //create a new tile layer
        var tileLayer = new Layer();
        tileLayer.imageX = tile.tileX;
        tileLayer.imageY = tile.tileY;
        tileLayer.set = tile.set;
        if (tile.frames != undefined) {
            tileLayer.frames = tile.frames;
        }
        tileLayer.originalX = tile.tileX;

        return tileLayer;
    }

    //move character to a tile on the map
    this.placeCharacter = function (character, x, y) {
        if (character.isMoving) return;

        if (that.tiles[x][y].object == null) {
            //remove character from old tile
            that.tiles[character.x][character.y].object = null;

            //character moves to new tile location
            console.log("Moving character to " + x + "," + y);
            character.moveTo(x, y);

            //set character to that location
            that.tiles[x][y].object = character;
        }
        else {
            //tile is occupied
        }
    }

    //move character to a tile on the map
    this.jumpCharacter = function (character, x, y) {
        if (character.isMoving) return;

        if (that.tiles[x][y].object == null) {
            //remove character from old tile
            that.tiles[character.x][character.y].object = null;

            //character moves to new tile location
            console.log("Jumping character to " + x + "," + y);
            character.jumpTo(x, y);

            //set character to that location
            that.tiles[x][y].object = character;
        }
        else {
            //tile is occupied
        }
    }

    //character wants to go to new map
    this.requestNavigate = function (name, done) {
        console.log("Navigation requested to " + name);
        var map = new Map(name, done);
    }

    //draw the contents of the map
    this.draw = function (ctx, viewPort) {

        //get our view port bounds
        var bounds = {
            left: viewPort.offsetX / Tile.WIDTH,                                //starting x tile
            right: viewPort.offsetX / Tile.WIDTH + viewPort.w / Tile.WIDTH,     //ending x tile
            top: viewPort.offsetY / Tile.HEIGHT,                                //starting y tile
            bottom: viewPort.offsetY / Tile.HEIGHT + viewPort.h / Tile.HEIGHT   //ending y tile
        };

        //get all objects to draw
        for (var i = 0; i < that.maxX; i++) {
            for (var j = 0; j < that.maxY; j++) {

                var tile = that.tiles[i][j];

                //determine if the object is within our view port bounds before
                //we draw it to save some rendering time
                if (i + 1 >= bounds.left && i <= bounds.right
                    && j + 1 >= bounds.top && j <= bounds.bottom) {

                    //draw each layer the tile has
                    for (var k = 0; k < tile.layers.length; k++) {
                        var layer = tile.layers[k];

                        //draw the image
                        ctx.drawImage(image[layer.set],
                            layer.imageX * Tile.WIDTH, layer.imageY * Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT,
                            i * Tile.WIDTH, j * Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT);

                        //request a new animation frame for the layer
                        layer.requestFrame();
                    }
                }

            }


        }
    };

    //initialize map
    init();

}


