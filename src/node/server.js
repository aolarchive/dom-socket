var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('js.event', function(message){
  	console.log('js.event', message);
    socket.broadcast.emit('js.event', message);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});