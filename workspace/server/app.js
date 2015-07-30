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

// Set global root path
var path = require('path');
global.appRoot = path.resolve(__dirname);

// Start sessions
var session = require('express-session')({
	// genid: function(req) {
	//   return genuuid() // use UUIDs for session IDs
	// },
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
});

// Express and routes middlewares
require('./config/express')(app, session);
require('./routes')(app);


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

// Start server
server.listen(config.port, config.ip, function() {
	console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;