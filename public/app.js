var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector;

var engine;
var world;
var food;
var elements = [];
var boundaries = [];

function setup() {
    createCanvas(800, 800);
    engine = Engine.create();
    world = engine.world;
    food = Composite.create();
    World.add(world, food);
    walls(10);
    world.gravity.y = 0;
    randomFood(300);
    // Engine.run(engine);
}

function randomFood(amount) {
    for (var i = 0; i < amount; i++) {
        new Food(random(20, width - 20), random(20, height - 20), 3);
    }
}

function walls(thick) {
    boundaries.push(new Boundary(width / 2, height - thick / 2, width, thick, 0))
    boundaries.push(new Boundary(width / 2, thick / 2, width, thick, 0))
    boundaries.push(new Boundary(thick / 2, height / 2, thick, height, 0))
    boundaries.push(new Boundary(width - thick / 2, height / 2, thick, height, 0))
}

function ground(thick) {
    boundaries.push(new Boundary(width / 2, height - thick / 2, width, thick, 0))
}

function mousePressed() {
    elements.push(new Circle(mouseX, mouseY, random(1, 3)));
}

function mouseDragged() {
    elements.push(new Circle(mouseX, mouseY, random(1, 3)));
}

function draw() {
    background(51);
    Engine.update(engine);
    tick();
    show();
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
            elements[i].absorb(near[j]);
            Composite.remove(food, near[j]);
            randomFood(1);
        }
    }

    for (var i = elements.length - 1; i >= 0; i--) {
        var near = Matter.Query.region(world.bodies, elements[i].body.bounds);
        for (var j = 0; j < near.length; j++) {
            if (elements[i].body.mass > near[j].mass) {
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
    for (var i = elements.length - 1; i >= 0; i--)
        elements[i].show();
    for (var i = 0; i < boundaries.length; i++)
        boundaries[i].show();
    showFood();
}


function showFood() {
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

}
