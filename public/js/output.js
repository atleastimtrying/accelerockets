$(function(){
  var origin = window.location.origin;
  $.getScript(origin + "/socket.io/socket.io.js", function() {
    var socket = io.connect(origin);
    socket.on('update', function (data) {
      console.log('update');
      $('#display').css({
        '-webkit-transform': ' rotateX(' + -data.y + 'deg) rotateY(' + data.x + 'deg) rotateZ(' + data.z + 'deg)'
      });
    });
  });
});