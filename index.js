var connect = require("connect");
var app = connect().use(connect.logger('dev')).use(connect.static('public')).listen(8080);
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  socket.on('update', function (data) {
    socket.broadcast.emit('update', data);
  });
});