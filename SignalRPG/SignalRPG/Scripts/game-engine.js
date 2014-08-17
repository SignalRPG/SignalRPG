﻿//for intellisence
/// <reference path="/scripts/game-classes.js" />
/// <reference path="/scripts/game-map.js" />

//game engine
function GameEngine(view) {
    var _self = this;

    //game time object
    var _gameTime = new GameTime();
    //frame counter
    var _fpsLast = 0;
    var _fps = 0;

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

    //update system
    function system() {

        //clear the view context
        _bufferCtx.clearRect(0, 0, _viewPort.width, _viewPort.height);

        //update system gametime
        _gameTime.update();

        //update
        update(_gameTime);

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

        //request a frame
        window.requestAnimationFrame(system);
    }

    //handle keyboard/mouse events
    function update(gameTime) {

        //add update code here

    }

    //all drawing code
    function draw(ctx, gameTime) {

        //add drawing code here
        _map.draw(ctx, gameTime);
    }

    //start the game hub
    var gameHub = $.connection.gameHub;

    //create hub methods
    gameHub.client.moveCharacter = function (x, y) {

    }

    //start connection to hub
    $.connection.hub.start().done(function () {
        //initialize before requesting any frames
        initialize();

        //request a frame
        window.requestAnimationFrame(system);
    });

    
}