'use strict';

var _ = require('lodash');

// Get list of videos
exports.index = function(req, res) {
  res.json([]);
};

// Add video
exports.create = function(req, res) {
    console.log(req.files);
    res.json([{'statut' : 'success'}]);
}