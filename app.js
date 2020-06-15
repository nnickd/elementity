var socket = io();

var elements = {
    pos: [],
    ang: [],
    rad: []
}

var foods = {
    pos: [],
    ang: [],
    rad: []
}

socket.on('render elements', function(pos, ang, rad) {
    elements.pos = pos;
    elements.ang = ang;
    elements.rad = rad;
});

socket.on('render foods', function(pos, ang, rad) {
    foods.pos = pos;
    foods.ang = ang;
    foods.rad = rad;
});

function setup() {
    createCanvas(800, 800);
}

function draw() {
    background(51);
    socket.emit('mouse', mouseX, mouseY)
    renderFoods();
    renderElements();
}

function renderFoods() {
    for (var i = 0; i < foods.pos.length; i++) {
        push();
        translate(foods.pos[i].x, foods.pos[i].y);
        rotate(foods.ang[i]);
        rectMode(CENTER);
        fill(color(0, 255, 100));
        noStroke();
        ellipse(0, 0, foods.rad[i] * 2);
        pop();
    }
}

function renderElements() {
    for (var i = 0; i < elements.pos.length; i++) {
        push();
        colorMode(HSB)
        translate(elements.pos[i].x, elements.pos[i].y);
        rotate(elements.ang[i]);
        rectMode(CENTER);
        fill(color(270, 100, 100));
        noStroke();
        ellipse(0, 0, elements.rad[i] * 2);
        pop();
    }
}
