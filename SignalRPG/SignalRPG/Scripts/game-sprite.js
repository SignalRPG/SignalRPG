
//create sprite class with basic properties
var Sprite = Class.create({
    initialize: function (id, name, x, y) {
        this.id = 0;
        this.name = name;
        this.x = 0;
        this.y = 0;
    },
    moveTo: function (x, y) {
        this.x = x;
        this.y = y;
    }
});