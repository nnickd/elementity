// var Engine = Matter.Engine,
//     World = Matter.World,
//     Bodies = Matter.Bodies,
//     Composite = Matter.Composite,
//     Vector = Matter.Vector;

var socket = io();

var engine;
var world;
var food;
var elements = [];
var boundaries = [];
var dead = [];

var bpos = [];
var bang = [];
var brad = [];
var fpos = [];
var fang = [];
var frad = [];

socket.on('render', function(bpos, bang, brad, fpos, fang, frad) {
    bpos = bpos;
    bang = bang;
    brad = brad;
    fpos = fpos;
    fang = fang;
    frad = frad;
    background(51);
    socket.emit('mouse', socket.id, mouseX, mouseY)

    for (var i = 0; i < fpos.length; i++) {
        push();
        translate(fpos[i].x, fpos[i].y);
        rotate(fang[i]);
        rectMode(CENTER);
        fill(color(0, 255, 0));
        noStroke();
        ellipse(0, 0, frad[i] * 2);
        pop();
    }
    for (var i = 0; i < bpos.length; i++) {
        push();
        translate(bpos[i].x, bpos[i].y);
        rotate(bang[i]);
        rectMode(CENTER);
        fill(127);
        noStroke();
        ellipse(0, 0, brad[i] * 2);
        pop();
    }
});

function setup() {
    createCanvas(800, 800);
    socket.emit('mouse', socket.id, mouseX, mouseY)
    // engine = Engine.create();
    // world = engine.world;
    // food = Composite.create();
    // world.gravity.y = 0;
    // World.add(world, food);
    // randomFood(300, width, height);
    // socket.emit('mouse', socket.id, mouseX, mouseY);
}



// function draw() {
//     // background(51);
//     // Engine.update(engine);
//     socket.emit('mouse', socket.id, mouseX, mouseY)
//     // show();
//     // tick();
// }

// function tick() {
//     move();
//     eat();
//     absorb();
//     cleanup();
//     show();
// }

function show() {
    // if (bpos !== undefined) {
    showFood();
    showElements();
    // }
}

// function show() {
//   for (var i = 0; i < food.bodies.length; i++)
//   showFood(food.bodies[i]);
//
//   for (var i = elements.length - 1; i >= 0; i--)
//   elements[i].show();
//
//   for (var i = 0; i < boundaries.length; i++)
//   boundaries[i].show();
// }

function showFood() {
    for (var i = 0; i < fpos.length; i++) {
        push();
        translate(fpos[i].x, fpos[i].y);
        rotate(fang[i]);
        rectMode(CENTER);
        fill(color(0, 255, 0));
        noStroke();
        ellipse(0, 0, frad[i] * 2);
        pop();
    }
}

function showElements() {
    for (var i = 0; i < bpos.length; i++) {
        push();
        translate(bpos[i].x, bpos[i].y);
        rotate(bang[i]);
        rectMode(CENTER);
        fill(127);
        noStroke();
        ellipse(0, 0, brad[i] * 2);
        pop();
    }
}

// function move() {
//     var mouse = {
//         x: mouseX,
//         y: mouseY
//     };
//     for (var i = 0; i < elements.length; i++) {
//         elements[i].seek(mouse);
//     }
// }
//
// function eat() {
//     for (var i = elements.length - 1; i >= 0; i--) {
//         var near = Matter.Query.region(food.bodies, elements[i].body.bounds);
//         for (var j = 0; j < near.length; j++) {
//             var distance = Vector.magnitude(Vector.sub(elements[i].body.position, near[j].position));
//             if (distance <= elements[i].radius) {
//                 elements[i].absorb(near[j]);
//                 Composite.remove(food, near[j]);
//                 randomFood(1, width, height);
//             }
//         }
//     }
// }
//
// function absorb() {
//     for (var i = elements.length - 1; i >= 0; i--) {
//         var near = Matter.Query.region(world.bodies, elements[i].body.bounds);
//         for (var j = 0; j < near.length; j++) {
//             var distance = Vector.magnitude(Vector.sub(elements[i].body.position, near[j].position));
//             if (elements[i].body.circleRadius > near[j].circleRadius && distance <= elements[i].radius) {
//                 elements[i].absorb(near[j]);
//                 World.remove(world, near[j])
//                 dead.push(near[j]);
//             }
//         }
//     }
// }
//
// function cleanup() {
//     for (var i = elements.length - 1; i >= 0; i--) {
//         for (var j = 0; j < dead.length; j++) {
//             if (elements[i].body === dead[j]) {
//                 elements.splice(i, 1);
//                 dead.splice(j, 1);
//                 break;
//             }
//         }
//     }
// }
