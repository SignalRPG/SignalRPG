
//process game time. game time is used to measure the time between each frame, allowing
//you to control the framerate of animations.
function GameTime() {
    //self reference
    var _self = this;
    var _time = null;

    //time system game started
    this.elapsedTime = 0;

    //updates the gametime
    this.update = function () {
        //get current time
        var now = new Date().getTime();

        //get time system last call
        var dt = now - (_time || now);
        //increase elapsed time
        _self.elapsedTime += dt;

        //set time to now
        _time = now;
    }
}

//game engine
function GameEngine() {

    //game time object
    var _gameTime = new GameTime();

    //update system
    function system() {

        //update system gametime
        _gameTime.update();

        //update
        update(_gameTime);

        //draw
        draw(_gameTime);

        //request a frame
        window.requestAnimationFrame(system);
    }

    //handle keyboard/mouse events
    function update(gameTime) {

        //add update code here
        
    }

    //all drawing code
    function draw(gameTime) {

        //add drawing code here

    }

    //request a frame
    window.requestAnimationFrame(system);
}