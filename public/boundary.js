function Boundary(x, y, w, h, a) {
    var options = {
        friction: 0,
        restitution: 0.5,
        angle: a,
        isStatic: true
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);

    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y)
        rotate(angle);
        rectMode(CENTER);
        fill(0);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

function walls(thick, width, height) {
    var boundaries = [];
    boundaries.push(new Boundary(width / 2, height - thick / 2, width, thick, 0));
    boundaries.push(new Boundary(width / 2, thick / 2, width, thick, 0));
    boundaries.push(new Boundary(thick / 2, height / 2, thick, height, 0));
    boundaries.push(new Boundary(width - thick / 2, height / 2, thick, height, 0));
    return boundaries;
}

function ground(thick, width, height) {
    return [new Boundary(width / 2, height - thick / 2, width, thick, 0)];
}
