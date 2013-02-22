$(function(){
	var origin = window.location.origin;
	$.getScript(origin + "/socket.io/socket.io.js", function(data, textStatus, jqxhr) {
		var socket = io.connect(origin);
		var roundit = function(float){
			return Math.round(float * 10)/ 10;
		};
		$(window).on('deviceorientation mousemove', function(event){
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
			socket.emit('update', {
				x: x,
				y: y, 
				z: z
			});
		});
	});
});