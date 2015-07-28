'use strict';

var express = require('express');
var controller = require('./videotheque.controller');

var router = express.Router();

router.get('/videos/:slug', controller.index);
router.get('/videos', controller.list);

router.post('/', controller.create);

module.exports = router;