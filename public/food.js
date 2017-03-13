function Food(x, y, r) {
  var options = {
    friction: 0,
    restitution: 0.5,
    mass: PI * r * r / 10,
    isStatic: true
  }
  this.body = Bodies.circle(x, y, r, options);
  this.radius = r;
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
