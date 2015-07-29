/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);

// Start sessions
var session = require('express-session');
app.use(session({
	// genid: function(req) {
	//   return genuuid() // use UUIDs for session IDs
	// },
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

// Start sockets
var socketio = require('socket.io')(server, {
	serveClient: (config.env === 'production') ? false : true,
	path: '/socket.io-client'
});
// Link sockets to session
var sharedsession = require("express-socket.io-session");
socketio.use(sharedsession(session, {
	autoSave: true
}));
require('./config/socketio')(socketio);

// Express and routes middlewares
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function() {
	console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;