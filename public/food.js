function Food(x, y, r) {
    var options = {
        friction: 0,
        restitution: 0.5,
        mass: PI * r * r / 10,
        isStatic: true,
        isSensor: true
    }
    this.body = Bodies.circle(x, y, r, options);
    this.radius = this.body.circleRadius;
    Composite.add(food, this.body);


    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        fill(color(0, 255, 0));
        noStroke();
        ellipse(0, 0, this.radius * 2);
        pop();

    }
}

function randomFood(amount, width, height) {
    for (var i = 0; i < amount; i++) {
        new Food(random(20, width - 20), random(20, height - 20), 3);
    }
}
