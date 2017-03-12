function Food(x, y, r) {
  var options = {
    friction: 0,
    restitution: 0.5,
    mass: PI * r * r / 10,
    isStatic: true
  }
  this.body = Bodies.circle(x, y, r, options);
  this.radius = r;
  World.add(world, this.body);

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  }

  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    fill(0);
    noStroke();
    ellipse(0, 0, this.radius * 2);
    pop();

  }
}
