'use strict';

var _ = require('lodash');

// Get list of videos
exports.index = function (req, res) {
    var fs = require('fs');

    // Get uploaded files
    fs.readdir('/server/uploads', function(err, files) {
        if (err)
           throw err;

        var result=new Array();

        for (var index in files) {
            if(fs.lstatSync("/server/uploads/" + files[index]).isFile())
            result[index] = files[index];
        }

        console.log(result);
    });

    res.json([]);
};

// Add video
exports.create = function (req, res) {
    console.log(req.files);
    res.json([{'statut': 'success'}]);
}