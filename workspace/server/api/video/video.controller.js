'use strict';

//var _ = require('lodash');
var fs = require('fs');

// Get list of videos
exports.index = function (req, res) {
    var uploadPath = 'server/uploads/';

    // Get uploaded files
    fs.readdir(uploadPath, function (err, files) {
        if (err)
            throw err;

        var result = new Array();

        for (var index in files) {
            if (fs.lstatSync(uploadPath + files[index]).isFile()) {
                result[index] = files[index];
            }
        }

        res.json(result);
    });



};

// Add video
exports.create = function (req, res) {
    console.log(typeof req.body.video);

    fs.writeFileSync('server/components/data/videos.txt', JSON.stringify(req.body.video));

    res.json({'success': true});
}