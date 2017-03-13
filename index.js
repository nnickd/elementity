var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use('/scripts', express.static(__dirname + '/node_modules/matter-js/build/'))
app.use('/scripts', express.static(__dirname + '/node_modules/p5/lib/'))
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
