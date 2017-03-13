var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

var engine;
var world;
var elements = [
    []
];
var boundaries = [];
var foods = [];

function setup() {
    createCanvas(800, 800);
    engine = Engine.create();
    world = engine.world;
    walls(10);
    world.gravity.y = 0;
    randomFood(1000);
}

function randomFood(amount) {
    for (var i = 0; i < amount; i++) {
        foods.push(new Food(random(0, width), random(0, height), 3));
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

function mouseDragged() {
    elements[elements.length - 1].push(new Circle(mouseX, mouseY, random(1, 3)));
}

function mouseReleased() {
    elements.push([]);
}

function draw() {
    background(51);
    Engine.update(engine);

    for (var k = 0; k < elements.length; k++) {
        for (var i = elements[k].length - 1; i >= 0; i--) {
            if (i > 0) {
                elements[k][i].seek(elements[k][i - 1].body.position);
            } else {
                elements[k][i].seek(elements[k][elements[k].length - 1].body.position);
            }
            for (var j = foods.length - 1; j >= 0; j--) {
                if (Matter.Bounds.overlaps(elements[k][i].body.bounds, foods[j].body.bounds)) {
                    elements[k][i].absorb(foods[j]);
                    World.remove(world, foods[j].body);
                    foods.splice(j, 1);
                }
            }
        }

    }

    for (var k = 0; k < elements.length; k++) {
        for (var i = elements[k].length - 1; i >= 0; i--) {
            elements[k][i].show();
        }
    }

    for (var i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }

    for (var i = 0; i < foods.length; i++) {
        foods[i].show();
    }
}
