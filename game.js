var Matter = require('matter-js');


module.exports = function Game() {
  var Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Common = Matter.Common,
      Vector = Matter.Vector;

    // this.io = null;
    // this.engine = null;
    // this.world = null;
    // this.food = null;
    this.boundaries = [];
    this.dead = [];
    this.players = [];
    this.elements = {};
    this.mouses = {};
    this.colors = {};
    this.width = 800;
    this.height = 800;

    this.setup = function(io) {
        this.io = io;
        this.engine = Engine.create();
        console.log(this.engine);
        this.world = this.engine.world;
        this.food = Composite.create();
        this.world.gravity.y = 0;
        World.add(this.world, this.food);
        this.randomFood(300, 800, 800);
    }

    this.newPlayer = function(socket) {
        if (this.players.indexOf(socket.id) < 0)
            this.players.push(socket.id);
        var options = {
            friction: 0,
            restitution: 0.5,
            mass: Math.PI * 4 * 4 / 10,
            isSensor: true
        }
        var body = Bodies.circle(Common.random(20, 780), Common.random(20, 780), 4, options);
        World.add(this.world, body);
        this.elements[socket.id] = [body];
    }

    this.killPlayer = function(socket) {
        this.players.splice(this.players.indexOf(socket.id, 1));
        delete this.mouses[socket.id];
        for (var i = 0; i < this.elements[socket.id].length; i++)
            World.remove(this.world, this.elements[socket.id][i]);
        delete this.elements[socket.id];
    }

    this.tick = function() {
        if (this.engine !== undefined) {
          console.log('hi');
            Engine.update(this.engine);
            this.move();
            this.eat();
            this.kill();
            this.cleanup();
            this.renderFoods();
            this.renderElements();
        }
    }

    this.move = function() {
        for (var i = this.players.length - 1; i >= 0; i--) {
            var id = this.players[i];
            var elem = this.elements[id];
            var mouse = this.mouses[id];
            if (elem !== undefined) {
                for (var j = elem.length - 1; j >= 0; j--)
                    this.seek(elem[j], mouse);
            }
        }
    }

    this.eat = function() {
        for (var i = this.world.bodies.length - 1; i >= 0; i--) {
            var elem = this.world.bodies[i];
            var near = Matter.Query.region(this.food.bodies, elem.bounds);
            for (var j = 0; j < near.length; j++) {
                var distance = Vector.magnitude(Vector.sub(elem.position, near[j].position));
                if (distance <= elem.circleRadius) {
                    this.absorb(elem, near[j]);
                    Composite.remove(this.food, near[j]);
                    var body = Bodies.circle(Common.random(20, width - 20), Common.random(20, height - 20), 3);
                    Composite.add(this.food, body);
                }
            }
        }
    }

    this.kill = function() {
        for (var i = this.world.bodies.length - 1; i >= 0; i--) {
            var elem = this.world.bodies[i];
            var near = Matter.Query.region(this.world.bodies, elem.bounds);
            for (var j = 0; j < near.length; j++) {
                var distance = Vector.magnitude(Vector.sub(elem.position, near[j].position));
                if (elem.circleRadius > near[j].circleRadius && distance <= elem.circleRadius) {
                    this.absorb(elem, near[j]);
                    World.remove(this.world, near[j]);
                    this.dead.push(near[j]);
                }
            }
        }
    }

    this.cleanup = function() {
        for (var i = this.players.length - 1; i >= 0; i--) {
            var id = this.players[i];
            var elem = elements[id];
            if (elem !== undefined) {
                for (var k = elem.length - 1; k >= 0; k--) {
                    for (var j = 0; j < dead.length; j++) {
                        if (elem[k] === dead[j]) {
                            elem.splice(k, 1);
                            dead.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }
    }

    this.renderFoods = function() {
        var pos = [];
        var ang = [];
        var rad = [];
        for (var i = this.food.bodies.length - 1; i >= 0; i--) {
            var elem = this.food.bodies[i];
            pos.push(elem.position);
            ang.push(elem.angle);
            rad.push(elem.circleRadius);
        }
        this.io.emit('render foods', pos, ang, rad);
    }

    this.renderElements = function() {
        var pos = [];
        var ang = [];
        var rad = [];
        for (var i = this.world.bodies.length - 1; i >= 0; i--) {
            var elem = this.world.bodies[i];
            pos.push(elem.position);
            ang.push(elem.angle);
            rad.push(elem.circleRadius);
        }
        this.io.emit('render elements', pos, ang, rad);
    }

    this.absorb = function(body, other) {
        var area = (Math.PI * other.circleRadius * other.circleRadius) + (Math.PI * body.circleRadius * body.circleRadius);
        var radius = Math.sqrt(area / Math.PI);
        var scale = radius / body.circleRadius;
        Matter.Body.scale(body, scale, scale);
    }

    this.seek = function(body, target) {
        if (target !== undefined) {
            var pos = Vector.create(body.position.x, body.position.y);
            var target = Vector.create(target.x, target.y);
            var desired = Vector.sub(target, pos);
            desired = Vector.normalise(desired);
            desired = Vector.mult(desired, 6);
            var vel = Vector.create(body.velocity.x, body.velocity.y);
            var force = Vector.sub(desired, vel);
            if (Vector.magnitude(force) > 6) {
                force = Vector.normalise(force);
                force = Vector.mult(force, 6);
            }
            force = Vector.div(force, body.mass);
            var acc = Vector.add(vel, force)
            Matter.Body.setVelocity(body, acc);
        }
    }


    this.randomFood = function(amount, width, height) {
        for (var i = 0; i < amount; i++) {
            var body = Bodies.circle(Common.random(20, width - 20), Common.random(20, height - 20), 3);
            Composite.add(this.food, body);
        }
    }

}
