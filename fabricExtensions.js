fabric.Canvas.prototype.getItemByAttr = function(attr, name) {
    var object = null,
    objects = this.getObjects();
    for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i][attr] && objects[i][attr] === name) {
            object = objects[i];
            break;
        }
    }
    return object;
};
