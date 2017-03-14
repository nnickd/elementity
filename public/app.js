var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector;

var socket = io();

var engine;
var world;
// var entity;
var food;
var elements = [];
var boundaries = [];

var pos = [];
var ang = [];
var rad = [];

socket.on('mouse', function(mx, my) {
    console.log(mx, my);
});

var sketch = socket.on('element', function(position, angle, radius) {
    pos.push(position);
    ang.push(angle);
    rad.push(radius);
});

function setup() {
    createCanvas(700, 700);
    engine = Engine.create();
    world = engine.world;
    world.gravity.y = 0;
    food = Composite.create();
    World.add(world, food);
    randomFood(300, width, height);
    // boundaries = walls(10, width, height);
    // Engine.run(engine);
}

function mouseDragged() {
    elements.push(new Circle(mouseX, mouseY, random(1, 3)));
}

function draw() {
    background(51);
    Engine.update(engine);
    tick();
    show();
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

function tick() {
    var dead = [];

    for (var i = elements.length - 1; i >= 0; i--) {
        elements[i].seek({
            x: mouseX,
            y: mouseY
        });
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

    for (var i = elements.length - 1; i >= 0; i--) {
        var near = Matter.Query.region(world.bodies, elements[i].body.bounds);
        for (var j = 0; j < near.length; j++) {
            var distance = Vector.magnitude(Vector.sub(elements[i].body.position, near[j].position));
            if (elements[i].body.circleRadius > near[j].circleRadius && distance <= elements[i].radius) {
                // if (elements[i].body.circleRadius > near[j].circleRadius && distance <= elements[i].radius + near[j].circleRadius) {
                elements[i].absorb(near[j]);
                World.remove(world, near[j])
                dead.push(near[j]);
            }
        }
    }

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
    var tempPos = [];
    var tempAng = [];
    var tempRad = [];
    for (var i = elements.length - 1; i >= 0; i--) {
        tempPos.push(elements[i].body.position);
        tempAng.push(elements[i].body.angle);
        tempRad.push(elements[i].radius);
        elements[i].show();
    }
    socket.emit('element', tempPos, tempAng, tempRad);

    for (var i = 0; i < boundaries.length; i++)
        boundaries[i].show();

}
