'use strict';

let express = require('express');
let controller = require('./videotheque.controller');

let router = express.Router();
let multer = require('multer');
let moment = require('moment')

module.exports = function() {
	router.get('/videos/:slug', controller.index);
	router.get('/videos', controller.list);

	router.post('/videos', [multer({
		dest: 'server/uploads/',
		rename: function(fieldname, filename) {
			return moment().format('YYYY-MM-DD_HH-mm-ss_') + filename.replace(/\W+/g, '-').toLowerCase();
		}
	}), controller.create]);

	return router;
};