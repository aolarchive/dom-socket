var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.use(express.static(__dirname + '/../js'));

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('js.event', function(message){
  	console.log('js.event', message);
    socket.broadcast.emit('js.event', message);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});