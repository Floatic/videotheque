'use strict';

//let _ = require('lodash');
let request = require('request');
let fs = require('fs');
let filePath = 'server/components/data/videos.txt';

// Get list of videos
exports.index = function(req, res) {
    // Get file list
    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.json({
                'success': false
            });
            throw err;
        }

        // Prepare file data
        //        let fileList = '{' + data + '}';

        res.send([data]);
    });

    // Get uploaded files
    //    fs.readdir(uploadPath, function (err, files) {
    //        if (err)
    //            throw err;
    //
    //        let result = new Array();
    //
    //        for (let index in files) {
    //            if (fs.lstatSync(uploadPath + files[index]).isFile()) {
    //                result[index] = files[index];
    //            }
    //        }
    //
    //        res.json(result);
    //    });



};

// Add video
exports.create = function(req, res) {
    console.log(req.files.file);

    if (req.files.file && req.body.fileData) {
        let fileData = JSON.parse(req.body.fileData);

        // Append server filename to filedata
        fileData.filename = req.files.file.name;
        fileData.filesize = req.files.file.size;

        // Save data
        fs.readFile(filePath, function(err, data) {
            if (err) {
                res.json({
                    'success': false
                });
                throw err;
            }

            let prefix = (data === '') ? '' : ',';
            fs.appendFile(filePath, prefix + JSON.stringify(fileData), function(err) {
                if (err) {
                    res.json({
                        'success': false
                    });
                    throw err;
                }

                // Send the video to libcast
                request.post({
                    url: 'http://service.com/upload',
                    form: {
                        key: 'value'
                    }
                }, function(err, httpResponse, body) { /* ... */ })

                res.json({
                    'success': true
                });
            });
        });

        return;
    }

    res.json({
        'success': false
    });
}