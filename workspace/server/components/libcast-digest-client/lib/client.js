'use strict'

//
// # Libcast digest Client
//
// Basic communication with libcast and file creation
// by digest authentication.
//

// DEBUG=libcastcontroller,requestdigest,client,video node --harmony server/app.js

let debug = require('debug')('client');

let Client = function() {
    // Load needed modules
    let fs = require('fs');
    let util = require('util');
    let parseXml = require('xml2js').parseString;
    let _ = require('lodash');
    let _string = require('underscore.string');
    let moment = require('moment');

    // Load Video object for reference
    let Video = require('./entity/video');

    // API paths
    const path_file = '/services/file/%(slug)s';
    const path_resource = '/services/resource/%(slug)s';
    const path_all_files = '/services/files';
    const path_add_resource = '/services/stream/%(stream)s/resources';


    // Constructor
    let Client = function(username, password) {
        this.host = 'https://console.libcast.com';
        this.port = 80;
        this.headers = '';
        this.username = username;
        this.password = password;
        this.digest = require('./request-digest')(username, password);
    };


    //
    // # Upload
    //
    // Sends a POST request to the Libcast API
    //
    //

    Client.prototype.upload = function(file, video) {

        debug('======= UPLOAD ========');
        debug('instance of video : %s', video instanceof Video);

        let self = this;
        let options = {
            method: 'POST',
            path: path_all_files,
            file: file
        };

        // Create the file
        debug('======= START SEND FILE ========');
        self.digest.request(self._setRequestParams(options), function(error, response, body) {
            if (error) {
                debug('digest error : %s', error.message);
                debug(util.inspect(error));
                throw error;
            }

            // let Video = require('./entity/video')(stream, slug);
            // debug('Http code : ' + response.statusCode);

            if (response.statusCode !== 201) {
                debug('error response code %s', response.statusCode);
                return;
            }

            // debug('Http response : ');
            // debug(response);
            // debug('Http body : ');
            // debug(body);
            // debug('Writing request 2');
            // fs.writeFileSync('request2.txt', util.inspect(response));

            let fileInfo = self._formatResponse(body).file;

            debug(fileInfo);

            // Create a publication
            if (!fileInfo.slug) {
                debug('No slug');
                return;
            }

            options = {
                method: 'POST',
                form: {
                    file: fileInfo.slug[0],
                    title: video.title,
                    // subtitle: '',
                    // published_at: moment().format() + '+01:00',
                    visibility: (video.usage === 'communication') ? 'visible' : 'hidden'
                },
                path: self._setRequestUrl(path_add_resource, {
                    'stream': (video.usage === 'communication') ? 'communication-1' : 'pedagogique'
                })
            };

            debug('======= START SEND PUBLICATION ========');
            self.digest.request(self._setRequestParams(options), function(error, response, body) {
                if (error) {
                    debug('digest error : %s', error.message);
                    throw error;
                }

                if (response.statusCode !== 201) {
                    debug('error response code %s', response.statusCode);
                    return;
                }

                debug('======= PUBLICATION CREATED ========');
            });
        });

    };

    //
    // # Get video data
    //
    // Sends a GET request to the Libcast API
    //
    //

    Client.prototype.show = function(slug) {
        debug('======= HEADERS ========');
        let self = this;
        let options = {
            method: 'GET',
            path: self._setRequestUrl(path_resource, {
                'slug': slug
            })
        };

        debug('----- options -------');
        debug(options);

        return new Promise((resolve, reject) => {
            debug('======= PROMISE START ========');
            self.digest.request(self._setRequestParams(options), function(error, response, body) {
                if (error) {
                    debug('digest error : %s', error.message);
                    throw error;
                }

                // let Video = require('./entity/video')(stream, slug);

                // debug('Http code : ' + response.statusCode);

                if (response.statusCode !== 200) {
                    debug('error response code %s', response.statusCode);
                    reject('Problem, HTTP code ' + response.statusCode);
                    return;
                }

                // debug('Http body : ');
                // debug(body);
                // debug('Writing request 2');
                // fs.writeFileSync('request2.txt', util.inspect(response));
                debug('before resolve');
                resolve(self._formatResponse(body));
                debug('after resolve');
                return true;
            });

            // setTimeout(function() {
            //     // We fulfill the promise !
            //     resolve('test');
            // }, Math.random() * 2000 + 1000);

            // resolve('coucou');
        });



    };

    //
    // # Get video file list
    //
    // Sends a GET request to the Libcast API
    //
    //

    Client.prototype.getFiles = function() {
        let self = this;
        let options = {
            method: 'GET',
            path: path_all_files
        };

        // Set a promise to be handled
        return new Promise((resolve, reject) => {
            debug('======= START GET FILES LIST ========');
            self.digest.request(self._setRequestParams(options), function(error, response, body) {
                if (error) {
                    debug('digest error : %s', error.message);
                    throw error;
                }

                if (response.statusCode !== 200) {
                    debug('error response code %s', response.statusCode);
                    reject('Problem, HTTP code ' + response.statusCode);
                    return;
                }

                debug('Trigger resolve');
                resolve(self._formatResponse(body));

                return true;
            });
        });
    };

    //
    // # Update video
    //
    // Sends a PUT request to the Libcast API
    //
    //

    Client.prototype.update = function(Video) {

    };


    //
    // # Destroy video
    //
    // Sends a DELETE request to the Libcast API
    //
    //

    Client.prototype.destroy = function(Video) {

    };


    //
    // # Set video to draft mode
    //
    // Sends a PUT request to the Libcast API
    //
    //

    Client.prototype.setDraft = function(Video) {

    };

    //
    // # Load a video object from response
    //
    // Returns a Video object
    //
    //

    Client.prototype.loadVideo = function(data) {
        return require('./entity/video')(data);
    };

    //
    // # Sets request params
    //
    // Returns an object to be given to the digest request
    //
    //

    Client.prototype._setRequestParams = function setRequestParams(options) {
        _.merge(options, {
            host: this.host,
            port: this.port
                // headers: {
                //     Accept: 'application/vnd.libcast+x-yaml'
                // }
        });

        return options;
    };

    //
    // # Sets API url
    //
    // Returns a libcast url to be requested
    //
    //

    Client.prototype._setRequestUrl = function setRequestUrl(url, params) {
        return _string.sprintf(url, params);
    };

    //
    // # Formats an xml response into json
    //
    // Returns a json object
    //
    //

    Client.prototype._formatResponse = function formatResponse(res) {
        let parsed;

        parseXml(res, function(err, result) {
            parsed = result;
        });

        // return this._cleanResponse(parsed);
        return parsed;
    };

    //
    // # Cleans a data object parsed from xml
    //
    // Returns a json object
    //
    //
/*    Client.prototype._cleanResponse = function cleanResponse(res) {
        if(_.size(res) > 1) {
            _.forEach(res, function (value, key) {
                this._cleanResponse(value);
            });
        } else if(typeof res === Array && _.size(res) === 1) {
            res = res[0]; // If the entry is an array wit just 1 element, clean it
        } else {
            return res;
        }
    };
*/
    return Client;
}();

module.exports = (username, password) => {
    debug('client load');
    return new Client(username, password);
};