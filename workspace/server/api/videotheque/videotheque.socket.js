'use strict'

let debug = require('debug')('videotheque.socket');

exports.register = function(socket) {
	socket.on('test', function(data){
		debug(data);
	});
}

function onSave(socket, data) {
  socket.emit('videotheque:save', data);
}

function onRemove(socket, data) {
  socket.emit('videotheque:remove', data);
}