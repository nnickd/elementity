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
        var pos = this.position;
        var target = target;
        var desired = Vector.sub(target, pos);
        desired = Vector.normalise(desired);
        desired = Vector.mult(desired, 3);
        var vel = this.body.velocity;
        var force = Vector.sub(desired, vel);
        if (Vector.magnitude(force) > 3) {
            force = Vector.normalise(force);
            force = Vector.mult(force, 3);
        }
        force = Vector.div(force, -this.body.mass);
        var acc = Vector.add(vel, force)
        Matter.Body.setVelocity(this.body, acc);
    }

    this.absorb = function(other) {
        var area = other.body.area + this.body.area;
        var radius = sqrt(area / PI);
        this.radius = radius;
        this.body.circleRadius = radius
        this.body.area = area;
        Matter.Body.setMass(this.body, area / 10);
        var verts = [
                      Vector.create(0, radius),
                      Vector.create(radius, 0),
                      Vector.create(0, -radius),
                      Vector.create(-radius, 0)

                    ];
        this.body.bounds = Matter.Bounds.create(verts);
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
