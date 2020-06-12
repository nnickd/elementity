var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Matter = require('matter-js');

// var game = require('./game.js');
// var Game = new game();

app.use('/scripts', express.static(__dirname + '/node_modules/matter-js/build/'))
app.use('/scripts', express.static(__dirname + '/node_modules/p5/lib/'))

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log(socket.id + ' connected');
    newPlayer(socket);

    socket.on('mouse', function(mx, my) {
        mouses[socket.id] = {
            x: mx,
            y: my
        };
    });

    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        killPlayer(socket);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Vector = Matter.Vector;

var engine;
var world;
var food;
var boundaries = [];
var dead = [];
var players = [];
var elements = {};
var mouses = {};
var colors = {};
var width = 800;
var height = 800;

setup();
setInterval(tick, 16.66);

function setup() {
    engine = Engine.create();
    world = engine.world;
    food = Composite.create();
    world.gravity.y = 0;
    World.add(world, food);
    randomFood(300, 800, 800);
}

function newPlayer(socket) {
    if (players.indexOf(socket.id) < 0)
        players.push(socket.id);
    var options = {
        friction: 0,
        restitution: 0.5,
        mass: Math.PI * 4 * 4 / 10,
        isSensor: true
    }
    var body = Bodies.circle(Common.random(20, 780), Common.random(20, 780), 4, options);
    World.add(world, body);
    elements[socket.id] = [body];
}

function killPlayer(socket) {
    players.splice(players.indexOf(socket.id, 1));
    delete mouses[socket.id];
    for (var i = 0; i < elements[socket.id].length; i++)
        World.remove(world, elements[socket.id][i]);
    delete elements[socket.id];
}

function tick() {
    Engine.update(engine);
    move();
    eat();
    kill();
    cleanup();
    renderFoods();
    renderElements();
}

function move() {
    for (var i = players.length - 1; i >= 0; i--) {
        var id = players[i];
        var elem = elements[id];
        var mouse = mouses[id];
        if (elem !== undefined) {
            for (var j = elem.length - 1; j >= 0; j--)
                seek(elem[j], mouse);
        }
    }
}

function eat() {
    for (var i = world.bodies.length - 1; i >= 0; i--) {
        var elem = world.bodies[i];
        var near = Matter.Query.region(food.bodies, elem.bounds);
        for (var j = 0; j < near.length; j++) {
            var distance = Vector.magnitude(Vector.sub(elem.position, near[j].position));
            if (distance <= elem.circleRadius) {
                absorb(elem, near[j]);
                Composite.remove(food, near[j]);
                var body = Bodies.circle(Common.random(20, width - 20), Common.random(20, height - 20), 3);
                Composite.add(food, body);
            }
        }
    }
}

function kill() {
    for (var i = world.bodies.length - 1; i >= 0; i--) {
        var elem = world.bodies[i];
        var near = Matter.Query.region(world.bodies, elem.bounds);
        for (var j = 0; j < near.length; j++) {
            var distance = Vector.magnitude(Vector.sub(elem.position, near[j].position));
            if (elem.circleRadius > near[j].circleRadius && distance <= elem.circleRadius) {
                absorb(elem, near[j]);
                World.remove(world, near[j]);
                dead.push(near[j]);
            }
        }
    }
}

function cleanup() {
    for (var i = players.length - 1; i >= 0; i--) {
        var id = players[i];
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

function renderFoods() {
    var pos = [];
    var ang = [];
    var rad = [];
    for (var i = food.bodies.length - 1; i >= 0; i--) {
        var elem = food.bodies[i];
        pos.push(elem.position);
        ang.push(elem.angle);
        rad.push(elem.circleRadius);
    }
    io.emit('render foods', pos, ang, rad);
}

function renderElements() {
    var pos = [];
    var ang = [];
    var rad = [];
    for (var i = world.bodies.length - 1; i >= 0; i--) {
        var elem = world.bodies[i];
        pos.push(elem.position);
        ang.push(elem.angle);
        rad.push(elem.circleRadius);
    }
    io.emit('render elements', pos, ang, rad);
}

function absorb(body, other) {
    var area = (Math.PI * other.circleRadius * other.circleRadius) + (Math.PI * body.circleRadius * body.circleRadius);
    var radius = Math.sqrt(area / Math.PI);
    var scale = radius / body.circleRadius;
    Matter.Body.scale(body, scale, scale);
}

function seek(body, target) {
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


function randomFood(amount, width, height) {
    for (var i = 0; i < amount; i++) {
        var body = Bodies.circle(Common.random(20, width - 20), Common.random(20, height - 20), 3);
        Composite.add(food, body);
    }
}
