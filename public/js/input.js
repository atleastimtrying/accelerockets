var roundit = function(float){
	return Math.round(float * 10)/ 10;
};
$(function(){
	var origin = window.location.origin;
	$.getScript(origin + "/socket.io/socket.io.js", function(data, textStatus, jqxhr) {
		var socket = io.connect(origin);
		socket.emit('phraseRequest');
		socket.on('accept', function(phrase){
			$('#passphrase').html(phrase);
			$(window).on('deviceorientation, mousemove', function(event){
				event = event.originalEvent;
				if(event.alpha){
					var x = roundit(event.alpha);
					var y = roundit(event.beta);
					var z = roundit(event.gamma);
				}else{
					var x = event.pageX;
					var y = event.pageY;
					var z = 0;
				}
				socket.emit('update.' + phrase, {
					x: x
				 	,y: y 
				 	,z: z
				});
			});
		});
		socket.on('deny', function(){
			$('#passphrase').html('No sessions free at the moment try refreshing? :( ');
		});
	});
});