function Circle(x, y, r) {
    var options = {
        friction: 0,
        restitution: 0.5,
        mass: PI * r * r / 10
    }
    this.body = Bodies.circle(x, y, r, options);
    this.radius = r;
    World.add(world, this.body);

    this.seek = function(target) {
        var pos = Vector.create(this.body.position.x, this.body.position.y);
        var target = Vector.create(target.x, target.y);
        var desired = Vector.sub(target, pos);
        desired = Vector.normalise(desired);
        desired = Vector.mult(desired, 6);
        var vel = Vector.create(this.body.velocity.x, this.body.velocity.y);
        var force = Vector.sub(desired, vel);
        if (Vector.magnitude(force) > 6) {
            force = Vector.normalise(force);
            force = Vector.mult(force, 6);
        }
        force = Vector.div(force, this.body.mass);
        var acc = Vector.add(vel, force)
        Matter.Body.setVelocity(this.body, acc);
    }

    this.avoid = function(target) {
      var pos = Vector.create(this.body.position.x, this.body.position.y);
      var target = Vector.create(target.x, target.y);
      var desired = Vector.sub(target, pos);
      desired = Vector.normalise(desired);
      desired = Vector.mult(desired, 6);
      var vel = Vector.create(this.body.velocity.x, this.body.velocity.y);
      var force = Vector.sub(desired, vel);
      if (Vector.magnitude(force) > 6) {
          force = Vector.normalise(force);
          force = Vector.mult(force, 6);
      }
      force = Vector.div(force, -this.body.mass);
      var acc = Vector.add(vel, force)
      Matter.Body.setVelocity(this.body, acc);
    }

    this.absorb = function(other) {
        var area = other.area + this.body.area;
        // var area = other.body.area + this.body.area;
        var radius = sqrt(area / PI);
        radius = radius;
        var scale = radius / this.radius;
        Matter.Body.scale(this.body, scale, scale);
        this.radius = this.body.circleRadius;
    }

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
        fill(127);
        noStroke();
        ellipse(0, 0, this.radius * 2);
        pop();

    }
}
