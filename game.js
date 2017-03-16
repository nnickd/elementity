
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector;

var socket = io();

var engine;
var world;
var food;
var elements = [];
var boundaries = [];
var dead = [];

socket.on('element', function(position, angle, radius) {
    pos.push(position);
    ang.push(angle);
    rad.push(radius);
});

function setup() {
    createCanvas(700, 700);
    engine = Engine.create();
    world = engine.world;
    food = Composite.create();
    world.gravity.y = 0;
    World.add(world, food);
    randomFood(300, width, height);
}

function mouseDragged() {
    elements.push(new Circle(mouseX, mouseY, random(1, 3)));
}

function draw() {
    background(51);
    Engine.update(engine);
    tick();
}

function tick() {
    move();
    eat();
    absorb();
    cleanup();
    show();
}

function move() {
    var mouse = {
        x: mouseX,
        y: mouseY
    };
    for (var i = 0; i < elements.length; i++) {
        elements[i].seek(mouse);
    }
}

function eat() {
    for (var i = elements.length - 1; i >= 0; i--) {
        var near = Matter.Query.region(food.bodies, elements[i].body.bounds);
        for (var j = 0; j < near.length; j++) {
            var distance = Vector.magnitude(Vector.sub(elements[i].body.position, near[j].position));
            if (distance <= elements[0].radius) {
                elements[i].absorb(near[j]);
                Composite.remove(food, near[j]);
                randomFood(1, width, height);
            }
        }
    }
}

function absorb() {
    for (var i = elements.length - 1; i >= 0; i--) {
        var near = Matter.Query.region(world.bodies, elements[i].body.bounds);
        for (var j = 0; j < near.length; j++) {
            var distance = Vector.magnitude(Vector.sub(elements[i].body.position, near[j].position));
            if (elements[i].body.circleRadius > near[j].circleRadius && distance <= elements[i].radius) {
                elements[i].absorb(near[j]);
                World.remove(world, near[j])
                dead.push(near[j]);
            }
        }
    }
}

function cleanup() {
    for (var i = elements.length - 1; i >= 0; i--) {
        for (var j = 0; j < dead.length; j++) {
            if (elements[i].body === dead[j]) {
                elements.splice(i, 1);
                dead.splice(j, 1);
                break;
            }
        }
    }
}

function show() {
    for (var i = 0; i < food.bodies.length; i++) {
        var body = food.bodies[i];
        var pos = body.position;
        var angle = body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        fill(color(0, 255, 0));
        noStroke();
        ellipse(0, 0, body.circleRadius * 2);
        pop();
    }
    // for (var i = elements.length - 1; i >= 0; i--) {
    //     elements[i].show();
    // }

    // for (var i = 0; i < boundaries.length; i++)
    //     boundaries[i].show();

    shadows();

}

function shadows() {
    var p = [];
    var a = [];
    var r = [];

    for (var i = elements.length - 1; i >= 0; i--) {
        p.push(elements[i].body.position);
        a.push(elements[i].body.angle);
        r.push(elements[i].radius);
    }

    socket.emit('element', p, a, r);

    for (var i = pos.length - 1; i >= 0; i--) {
        for (var j = 0; j < pos[i].length; j++) {
            push();
            translate(pos[i][j].x, pos[i][j].y);
            rotate(ang[i][j]);
            rectMode(CENTER);
            fill(69);
            noStroke();
            ellipse(0, 0, rad[i][j] * 2);
            pop();
        }
        pos.splice(i, 1);
        ang.splice(i, 1);
        rad.splice(i, 1);
    }
}
