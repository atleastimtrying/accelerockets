var phrase = '';
var origin = window.location.origin;
var animate = function (data) {
  console.log(data);
  $('#display').css({
    '-webkit-transform': ' rotateX(' + -data.y + 'deg) rotateY(' + data.x + 'deg) rotateZ(' + data.z + 'deg)'
  });
}
var startSockets = function() {
  var socket = io.connect(origin);
  $('#connect').click(function(){
    phrase = $('#passphrase').val();
    socket.emit('testPhrase', phrase);
  });

  socket.on('phraseFound', function(){
    socket.on('update.' + phrase, animate);
    $('header').html('<h1>Connected to : ' + phrase + ', now syncing!</h1>');
  });

  socket.on('phraseUnused', function(){
    $('#error').html('phrase: ' + phrase + ' is not in use.');
  });

  socket.on('phraseAbsent', function(){
    $('#error').html('phrase: ' + phrase + ' isnt one of ours, typing error?');
  });
  
};

$(function(){
  $.getScript(origin + "/socket.io/socket.io.js", startSockets);
});