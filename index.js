var connect = require("connect");
var app = connect().use(connect.static('public')).listen(process.env.PORT || 8080);
var io = require('socket.io');
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});
io.listen(app);

var Phrases = function(){
  var phrases = [
    {
      name:'cat',
      transmitting: false
    },
    {
      name:'yellow',
      transmitting: false
    },
    {
      name:'vase',
      transmitting: false
    },
    {
      name:'iguana',
      transmitting: false
    },
    {
      name:'real',
      transmitting: false
    },
    {
      name:'yoghurt',
      transmitting: false
    },
    {
      name:'noise',
      transmitting: false
    },
    {
      name:'happiness',
      transmitting: false
    },
    {
      name:'steel',
      transmitting: false
    },
    {
      name:'bassoon',
      transmitting: false
    }
  ];

  var findByName = function(name){
    var response = false;
    for(var i = 0, len = phrases.length; i < len; ++i){
      var phrase = phrases[i];
      if(phrase.name === name){
        response = phrase;
      }
    }
    return response;
  };

  var findOff = function(){
    var response = false;
    for(var i = 0, len = phrases.length; i < len; ++i){
      var phrase = phrases[i];
      if(!phrase.transmitting){
        response = phrase;
      }
    }
    return response;
  };

  var request = function(accept,deny){
    var phrase = findOff();
    if(phrase){
      on(phrase);
      accept(phrase);
    }else{
      deny(phrase);
    }
  };
  
  var find = function(name,found, unused, absent){
    var phrase = findByName(name);
    if(phrase){
      if(phrase.transmitting){
        found(phrase.name);
      }else{
        unused(phrase.name);
      }
    }else{
      absent(name);
    }
  };
  
  var on = function(phrase){
    phrase.transmitting = true;
  };

  var off = function(phrase){
    phrase.transmitting = false;
  };
  
  return {
    request: request,
    off: off,
    find: find,
  };
};

var phrases = new Phrases();

var connected = function (socket) {
  socket.on('phraseRequest', function(){
    phrases.request(
      function(phrase){
        socket.set('phrase', phrase, function () {
          socket.emit('accept', phrase.name);
          socket.on('update.' + phrase.name, function (data) {
            socket.broadcast.emit('update.' + phrase.name, data);
          });
        });
      },
      function(){
        socket.emit('deny');
      }
    );
  });
  socket.on('testPhrase', function(name){
    phrases.find(name, 
      function(foundname){
        socket.emit('phraseFound', foundname);
      },
      function(unusedname){
        socket.emit('phraseUnused', unusedname);
      },
      function(absentname){
        socket.emit('phraseAbsent', absentname);
      }
    );
  });
  socket.on('disconnect', function () {
    socket.get('phrase', function (err, phrase) {
      if(phrase){
        phrases.off(phrase);
      }
    });
  });
};
io.sockets.on('connection', connected);