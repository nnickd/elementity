var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/scripts', express.static(__dirname + '/node_modules/matter-js/build/'))
app.use('/scripts', express.static(__dirname + '/node_modules/p5/lib/'))

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('user connected');
    socket.on('mouse', function(mx, my) {
        io.emit('mouse', mx, my);
    });
    socket.on('element', function(position, angle, radius) {
        socket.broadcast.emit('element', position, angle, radius);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
