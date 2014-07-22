/// <reference path="grid.js" />
/// <reference path="map.js" />
/// <reference path="character.js" />

(function () {

    console.log("Creating back buffer");
    //create our back buffer canvas. all drawing takes place here
    //by using a back buffer, we can eliminate a lot of flickering issues
    var backBuffer = document.createElement('canvas');
    //get context of the back buffer
    var bufferCtx = backBuffer.getContext('2d');

    console.log("Creating view canvas");
    //get canvas object - this is used to display the final output
    var canvas = document.getElementById('canvas');
    //get context of canvas
    var ctx = canvas.getContext('2d');


    //create viewport object
    var viewPort = {
        w: 0,
        h: 0,
        offsetX: 0, //current x offset of the viewport
        offsetY: 0  //current y offset of the viewport
    };

    var character = new Character("/resources/characters/013-Warrior01.png", 5, 3, 0, "Hunor");
    var monster = new Character("/resources/characters/092-Monster06.png", 8, 8, 0, "Squirt");
    ////set canvas size
    //updateCanvasSize();

    //we can only be in one map at a time
    var map = new Map('map1', function (map) {
        console.log("Resizing backbuffer to " + map.width + "," + map.height);
        //set back buffer to the size of the map
        backBuffer.width = map.width;
        backBuffer.height = map.height;
        //set viewport w,h 
        viewPort.w = backBuffer.width;
        viewPort.h = backBuffer.height;
        //make view port the size of the backbuffer, but not larger than the window
        if (viewPort.w > window.innerWidth) viewPort.w = window.innerWidth;
        if (viewPort.h > window.innerHeight) viewPort.h = window.innerHeight;

        //update canvas size
        canvas.width = viewPort.w;
        canvas.height = viewPort.h;
        monster.dead = false;
        map.placeCharacter(monster, 8, 8);
    });



    //set the size of the canvas
    function updateCanvasSize() {

        //set viewport w,h 
        viewPort.w = window.innerWidth;
        viewPort.h = window.innerHeight;
        //canvas size cannot be bigger than back buffer
        if (viewPort.w > backBuffer.width) viewPort.w = backBuffer.width;
        if (viewPort.h > backBuffer.height) viewPort.h = backBuffer.height;

        console.log("Resizing view canvas to " + viewPort.w + "," + viewPort.h);
        //update canvas size
        canvas.width = viewPort.w;
        canvas.height = viewPort.h;

    }

    //navigate the character to a new map
    function navigateToMap(direction) {

        if (direction == 0 && map.bounds.top) {
            //remove events
            //window.removeEventListener('keydown', update, true);
            map.requestNavigate(map.bounds.top, function (data) {
                map = data;
                character.stop();
                map.jumpCharacter(character, character.x, map.maxY - 1);
                //listen to keyboard events
                //window.addEventListener('keydown', update, true);
            });
        }

        if (direction == 1 && map.bounds.right) {
            //remove events
            //window.removeEventListener('keydown', update, true);
            map.requestNavigate(map.bounds.right, function (data) {
                map = data;
                character.stop();
                map.jumpCharacter(character, 0, character.y);
                //listen to keyboard events
                //window.addEventListener('keydown', update, true);
            });
        }

        if (direction == 2 && map.bounds.bottom) {
            //remove events
            //window.removeEventListener('keydown', update, true);
            map.requestNavigate(map.bounds.bottom, function (data) {
                map = data;
                character.stop();
                map.jumpCharacter(character, character.x, 0);
                //listen to keyboard events
                //window.addEventListener('keydown', update, true);
            });
        }

        if (direction == 3 && map.bounds.left) {
            //remove events
            //window.removeEventListener('keydown', update, true);
            map.requestNavigate(map.bounds.left, function (data) {
                map = data;
                character.stop();
                map.jumpCharacter(character, map.maxX - 1, character.y);
                //listen to keyboard events
                //window.addEventListener('keydown', update, true);
            });
        }


    }

    var updateEvents = null;
    function onKeyDown(e) {
        updateEvents = e;
    }

    //handle keyboard
    function update() {
        var x = character.x;
        var y = character.y;
        var dx = 1; //move 1 tile at a time
        var dy = 1; //move 1 tile at a time
        e = updateEvents;

        if (e != null) {
            switch (e.keyCode) {
                case 32:
                    //attack!
                    if (character.direction == 0) {
                        var mon = map.tiles[character.x][character.y + 1].object;
                        if (mon != null) mon.dead = true;
                        map.tiles[character.x][character.y + 1].object = null;
                    }
                    if (character.direction == 1) {
                        var mon = map.tiles[character.x - 1][character.y].object;
                        if (mon != null) mon.dead = true;
                        map.tiles[character.x - 1][character.y].object = null;
                    }
                    if (character.direction == 2) {
                        var mon = map.tiles[character.x + 1][character.y].object;
                        if (mon != null) mon.dead = true;
                        map.tiles[character.x - 1][character.y].object = null;
                    }
                    if (character.direction == 3) {
                        var mon = map.tiles[character.x][character.y - 1].object;
                        if (mon != null) mon.dead = true;
                        map.tiles[character.x][character.y - 1].object = null;
                    }
                    break;
                case 38:  /* Up arrow was pressed */
                    character.turn(3);
                    if (y - dy >= 0) {
                        y -= dy;
                        //update character
                        map.placeCharacter(character, x, y);
                        return;
                    }
                    else {
                        //navigate to new map
                        navigateToMap(0);
                        return;
                    }
                    break;
                case 40:  /* Down arrow was pressed */
                    character.turn(0);
                    if (y + dy < map.maxY) {
                        y += dy;
                        //update character
                        map.placeCharacter(character, x, y);
                        return;
                    }
                    else {
                        //navigate to new map
                        navigateToMap(2);
                        return;
                    }
                    break;
                case 37:  /* Left arrow was pressed */
                    character.turn(1);
                    if (x - dx >= 0) {
                        x -= dx;
                        //update character
                        map.placeCharacter(character, x, y);
                        return;
                    }
                    else {
                        //navigate to new map
                        navigateToMap(3);
                        return;
                    }
                    break;
                case 39:  /* Right arrow was pressed */
                    character.turn(2);
                    if (x + dx < map.maxX) {
                        x += dx;
                        //update character
                        map.placeCharacter(character, x, y);
                        return;
                    }
                    else {
                        //navigate to new map
                        navigateToMap(1);
                        return;
                    }
                    break;
            }
        } else {
            //rest animation at 0
            //character.currentFrame = 0;
            //character.imageX = 0;
        }

    }

    //scroll the view port
    function scroll() {
        //scroll x
        viewPort.offsetX = character.drawX + Tile.WIDTH / 2 - viewPort.w / 2;
        if (viewPort.offsetX + viewPort.w > map.width) {
            viewPort.offsetX = map.width - viewPort.w;
        }
        if (viewPort.offsetX < 0) {
            viewPort.offsetX = 0;
        }

        //scroll y
        viewPort.offsetY = character.drawY + Tile.HEIGHT / 2 - viewPort.h / 2;
        if (viewPort.offsetY + viewPort.h > map.height) {
            viewPort.offsetY = map.height - viewPort.h;
        }
        if (viewPort.offsetY < 0) {
            viewPort.offsetY = 0;
        }
    }
    var fps = 0, now, lastUpdate = (new Date) * 1;
    var fpsFilter = 50;

    //main game loop
    function draw() {

        update();
        updateEvents = null;
        //clear the back buffer
        bufferCtx.fillStyle = 'rgb(0,0,0)';
        bufferCtx.fillRect(0, 0, map.width, map.height);

        //render the map
        map.draw(bufferCtx, viewPort);

        //render the character on the map
        character.draw(bufferCtx);

        monster.draw(bufferCtx);

        //view follows the character
        scroll();

        //redraw the canvas
        ctx.fillStyle = 'rgb(0,128,255)';
        ctx.fillRect(0, 0, viewPort.w, viewPort.h);

        //console.log("viewport size: " + viewPort.w + "," + viewPort.h);

        //if (viewPort.w <= backBuffer.width) backBuffer.width = viewPort.w;
        //if (viewPort.h > backBuffer.height) backBuffer.height = viewPort.h;
        var viewWidth = Math.min(viewPort.w, backBuffer.width);
        var viewHeight = Math.min(viewPort.h, backBuffer.height);
        //draw back buffer onto the canvas
        ctx.drawImage(backBuffer,
            viewPort.offsetX, viewPort.offsetY, viewWidth, viewHeight,
            0, 0, viewWidth, viewHeight);

        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillText('x: ' + character.x + ' y: ' + character.y, 10, 10);

        ctx.fillText(map.title, 10, 25);

        var thisFrameFPS = 1000 / ((now = new Date) - lastUpdate);
        if (now != lastUpdate) {
            fps += (thisFrameFPS - fps) / fpsFilter;
            lastUpdate = now;
        }
        ctx.fillText('fps: ' + fps, 10, 50);

        //console.log("requesting next frame");
        //continue game loop
        window.requestAnimationFrame(draw);
    }



    //start game loop
    console.log("requesting first frame");
    window.requestAnimationFrame(draw);

    //when window is resized, resize the canvas
    window.onresize = function () {
        updateCanvasSize();
    }

    //listen to keyboard events
    window.addEventListener('keydown', onKeyDown, true);

})();