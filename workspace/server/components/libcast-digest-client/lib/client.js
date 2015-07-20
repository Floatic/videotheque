'use strict'

//
// # Libcast digest Client
//
// Basic communication with libcast and file creation
// by digest authentication.
//

let Client = function() {
    // Load needed modules
    let _ = require('underscore.string');
    let fs = require('fs');
    let util = require('util');
    let parseXml = require('xml2js').parseString;

    // API paths
    const path_file = '/services/file/%(slug)s';
    const path_resource = '/services/resource/%(slug)s';


    //    let fs = require('fs');

    // Constructor
    let Client = function(username, password) {
        this.host = 'https://console.libcast.com';
        this.port = 80;
        this.headers = '';
        this.username = username;
        this.password = password;
        this.digest = require('request-digest')(username, password);
    };


    //
    // # Upload
    //
    // Sends a POST request to the Libcast API
    //
    //

    Client.prototype.upload = function() {
        console.log('test');

        return false;
    };

    //
    // # Get video data
    //
    // Sends a GET request to the Libcast API
    //
    //

    Client.prototype.show = function(slug) {
        console.log('======= HEADERS ========')
        console.log(this._setRequestParams(slug, 'GET'));
        let self = this;

        return new Promise((resolve, reject) => {
            self.digest.request(self._setRequestParams(slug, 'GET'), function(error, response, body) {
                if (error) {
                    throw error;
                }

                // let Video = require('./entity/video')(stream, slug);

                // console.log('Http code : ' + response.statusCode);

                if (response.statusCode !== 200) {
                    reject('Problem, HTTP code ' + response.statusCode);
                    return;
                }

                // console.log('Http body : ');
                // console.log(body);
                // console.log('Writing request 2');
                // fs.writeFileSync('request2.txt', util.inspect(response));

                resolve(self._formatResponse(body));

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

    Client.prototype._setRequestParams = function setRequestParams(slug, method) {
        return {
            host: this.host,
            path: this._setRequestUrl(path_resource, {
                slug: slug
            }),
            port: this.port,
            method: method
                // headers: {
                //     Accept: 'application/vnd.libcast+x-yaml'
                // }
        };
    };

    //
    // # Sets API url
    //
    // Returns a libcast url to be requested
    //
    //

    Client.prototype._setRequestUrl = function setRequestUrl(url, params) {
        return _.sprintf(url, params);
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

        return parsed;
    };

    return Client;
}();

module.exports = function(username, password) {
    return new Client(username, password);
}