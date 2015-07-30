'use strict'

let debug = require('debug')('videotheque.socket');

exports.register = function(socket) {
	socket.on('test', function(data,cb){
		debug('====== test SOCKET CALL ====');
		debug(socket.handshake.session);
		// socket.handshake.session.socketTest = 'test';
		cb('Session : ' + socket.handshake.session.test);
	});
};