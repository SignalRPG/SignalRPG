//for intellisence
/// <reference path="/scripts/game-classes.js" />
/// <reference path="/scripts/game-map.js" />

//game engine
function GameEngine(view) {
    var _self = this;

    //start the game hub
    var gameHub = $.connection.gameHub;

    //game time object
    var _gameTime = new GameTime();

    //keyboard events
    var _keyboardEvent = null;

    //backbuffer. all drawing is rendered here first. only a portion of the backbuffer is drawn
    //and copied to the view context
    var _buffer = document.createElement('canvas');
    var _bufferCtx = _buffer.getContext('2d');
    //view context
    var _view = document.getElementById(view);
    var _viewCtx = _view.getContext('2d');

    //set the MAX size that our viewport can be in grid units
    var _maxSize = new Size(20, 12);

    //create our viewport. this is adjusted to simulate scrolling the map
    var _viewPort = new Rect(0, 0, 0, 0);

    //some effect vars
    var _mapFade = 0;

    //some counters
    var _fps = 0;

    //other - may be removed
    var _char = null;

    //map instance
    var _map = new Map('map-boundry-test', function () {
        //resize the back buffer
        resizeBuffer(_map.size.width, _map.size.height);
    });

    //resize the view in pixels
    this.resizeView = function () {
        var viewCanvas = document.getElementById(view);
        //we need to get the dimensions of the view canvas
        _viewPort.width = viewCanvas.width;
        _viewPort.height = viewCanvas.height;
    }

    //initialization code
    function initialize() {
        //we need to get the dimensions of the view canvas
        _self.resizeView();

    }

    //resizes the backbuffer in grid units
    function resizeBuffer(x, y) {
        //forbid x,y < maxsize 
        if (x < _maxSize.width) x = _maxSize.width;
        if (y < _maxSize.height) y = _maxSize.height;
        //calculate new size
        _buffer.width = x * TILE_W;
        _buffer.height = y * TILE_H;
    }

    //keyboard events
    function onKeyDown(e) {
        _keyboardEvent = e;
    }

    //update system
    function system() {

        //clear the view context
        _bufferCtx.clearRect(0, 0, _viewPort.width, _viewPort.height);

        //update system gametime
        _gameTime.update();

        //update
        update(_keyboardEvent, _gameTime);

        //reset the keycode
        _keyboardEvent = null;

        //draw
        draw(_bufferCtx, _gameTime);

        //clear the view context
        _viewCtx.fillStyle = 'rgb(0,0,0)';
        _viewCtx.fillRect(0, 0, _viewPort.width, _viewPort.height);

        if (_map.mapLoaded) {
            _viewCtx.drawImage(_buffer,
                _viewPort.x, _viewPort.y, _viewPort.width, _viewPort.height,
                0, 0, _viewPort.width, _viewPort.height);
        }

        var thisFrameFPS = 1000 / _gameTime.frameTime;
        if (thisFrameFPS != Infinity) {
            _fps += (thisFrameFPS - _fps) / 50;

        }
        _viewCtx.fillStyle = 'rgb(255,255,255)';
        _viewCtx.fillText('fps: ' + _fps, 10, 50);

        //listen to keyboard events
        window.addEventListener('keydown', onKeyDown, true);

        //request a frame
        window.requestAnimationFrame(system);
    }

    //handle keyboard/mouse events
    function update(ke, gameTime) {

        if (ke != null) {

            var x = _char.X;
            var y = _char.Y;

            switch (ke.keyCode) {
                case 38:

                    if (y - 1 > -1)
                        y--;

                    break;

                case 39:

                    if (x + 1 < _maxSize.width)
                        x++;

                    break;

                case 40:

                    if (y + 1 < _maxSize.height)
                        y++;

                    break;

                case 37:

                    if (x - 1 > -1)
                        x--;

                    break;

            }

            _char.X = x;
            _char.Y = y;

            //add update code here
            gameHub.server.moveCharacter(_char.ID, x, y);
        }
    }

    //all drawing code
    function draw(ctx, gameTime) {

        //add drawing code here
        _map.draw(ctx, gameTime);
    }



    //create hub methods

    //this method is called when a player joins the map
    //the player is pushed onto the array
    gameHub.client.characterEnter = function (obj) {
        console.log('pushing object ' + obj.ID);
        //add the item
        _map.pushMapObject(obj);
    };

    //when your character joins the map, your ID is returned
    //so the game engine knows which player in the stack is yours
    gameHub.client.registerCharacter = function (id) {
        //this is your character's id
        _char = _map.findMapObjectById(id);
    };

    //this method is called when a player leaves the map
    //the player object is removed from the array
    gameHub.client.characterLeave = function (id) {
        console.log('removing object ' + id);
        //remove the object
        _map.deleteMapObjectById(id);
    };

    //when a character moves, the server calls this event to update the x,y coords
    gameHub.client.moveCharacter = function (id, x, y) {
        var character = _map.findMapObjectById(id);

        character.X = x;
        character.Y = y;
    };

    gameHub.client.moveMonster = function (id, x, y) {
        var m = _map.findMapObjectById(id);
        if (m != null) {

            m.X = x;
            m.Y = y;
        }
    };

    //start connection to hub
    $.connection.hub.start().done(function () {
        //initialize before requesting any frames
        initialize();

        //request a frame
        window.requestAnimationFrame(system);
    });


}