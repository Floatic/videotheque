'use strict';
//
// # Digest Client
//
// Use together with HTTP Client to perform requests to servers protected
// by digest authentication.
//

let debug = require('debug')('requestdigest');

let HTTPDigest = function() {
    let crypto = require('crypto');
    let request = require('request');
    let _ = require('lodash');
    let fs = require('fs');
    let util = require('util');

    let HTTPDigest = function(username, password) {
        this.nc = 0;
        this.username = username;
        this.password = password;
    };

    //
    // ## Make request
    //
    // Wraps the http.request function to apply digest authorization.
    //
    HTTPDigest.prototype.request = function(options, callback) {
        debug('======= Start requestdigest ========');
        let self = this;
        options.url = options.host + options.path;
        return request(options, function(error, res) {
            if (error) {
                debug('digest error : %s', error.message);
                debug(util.inspect(error));
                throw error;
            }

            self._handleResponse(options, res, callback);
        });
    };

    //
    // ## Handle authentication
    //
    // Parse authentication headers and set response.
    //
    HTTPDigest.prototype._handleResponse = function handleResponse(options, res, callback) {
        //console.log('Writing request 1');
        //        fs.writeFileSync('request.txt', util.inspect(res));

        if (!res || !res.caseless) {
            debug(util.inspect(res));
            throw new Error('Caseless is empty');
        }

        let challenge = this._parseDigestResponse(res.caseless.dict['www-authenticate']);
        let ha1 = crypto.createHash('md5');
        ha1.update([this.username, challenge.realm, this.password].join(':'));
        let ha2 = crypto.createHash('md5');
        ha2.update([options.method, options.path].join(':'));

        let cnonceObj = this._generateCNONCE(challenge.qop);

        // Generate response hash
        let response = crypto.createHash('md5');
        let responseParams = [
            ha1.digest('hex'),
            challenge.nonce
        ];

        if (cnonceObj.cnonce) {
            responseParams.push(cnonceObj.nc);
            responseParams.push(cnonceObj.cnonce);
        }

        responseParams.push(challenge.qop);
        responseParams.push(ha2.digest('hex'));
        response.update(responseParams.join(':'));

        // Setup response parameters
        let authParams = {
            username: this.username,
            realm: challenge.realm,
            nonce: challenge.nonce,
            uri: options.path,
            qop: challenge.qop,
            opaque: challenge.opaque,
            response: response.digest('hex'),
            algorithm: 'MD5'
        };

        authParams = this._omitNull(authParams);

        if (cnonceObj.cnonce) {
            authParams.nc = cnonceObj.nc;
            authParams.cnonce = cnonceObj.cnonce;
        }

        let headers = options.headers || {};
        headers.Authorization = this._compileParams(authParams);
        options.headers = headers;
        //console.log('headers');
        //console.log(headers);

        debug('======= OPTIONS ========');
        debug(options);

        switch (options.method) {
            case 'POST':
                var postRequest;

                if (options.file) {
                    debug('======= SEND A FILE ========');

                    let formData = {
                        // Pass a simple key-value pair
                        // my_field: 'my_value',
                        // Pass data via Buffers
                        // my_buffer: new Buffer([1, 2, 3]),
                        // Pass data via Streams
                        path: fs.createReadStream(options.file),
                    };

                    debug(formData);

                    debug('======= Start post request ========');
                    postRequest = request.post({
                        url: options.url,
                        headers: options.headers,
                        formData: formData
                    }, function(error, response, body) {
                        debug('======= End post request ========');
                        callback(error, response, body);
                    });
                    // debug(util.inspect(postRequest));

                    return postRequest;
                } else {
                    debug('======= CREATE A PUBLICATION ========');

                    debug('======= Start post request ========');
                    /*postRequest = request.post({
                        url: options.url,
                        headers: options.headers,
                        form: options.form
                    }, function(error, response, body) {
                        debug('======= End post request ========');
                        callback(error, response, body);
                    });

                    // debug(util.inspect(postRequest));

                    return postRequest;*/

                    postRequest = request({
                        headers: options.headers,
                        url: options.url,
                        formData: options.form,
                        method: options.method
                    }, function(error, response, body) {
                        debug('======= End post request ========');
                        callback(error, response, body);
                    });
                    // debug(util.inspect(postRequest));

                    return postRequest;
                }

                break;
            default:
                return request(options, function(error, response, body) {
                    callback(error, response, body);
                });
        }
    };

    //
    // ## Delete null or undefined value in an object
    //
    HTTPDigest.prototype._omitNull = function omitNull(data) {
        return _.omit(data, function(elt) {
            return elt === null;
        });
    };

    //
    // ## Parse challenge digest
    //
    HTTPDigest.prototype._parseDigestResponse = function parseDigestResponse(digestHeader) {
        let prefix = 'Digest ';
        let challenge = digestHeader.substr(digestHeader.indexOf(prefix) + prefix.length);
        let parts = challenge.split(',');
        let length = parts.length;
        let params = {};

        for (let i = 0; i < length; i++) {
            let paramSplitted = this._splitParams(parts[i]);

            if (paramSplitted.length > 2) {
                params[paramSplitted[1]] = paramSplitted[2].replace(/\"/g, '');
            }
        }

        return params;
    };

    HTTPDigest.prototype._splitParams = function splitParams(paramString) {
        return paramString.match(/^\s*?([a-zA-Z0-0]+)=("?(.*)"?|MD5|MD5-sess|token)\s*?$/);
    };

    //
    // ## Parse challenge digest
    //
    HTTPDigest.prototype._generateCNONCE = function generateCNONCE(qop) {
        let cnonce = false;
        let nc = false;

        if (typeof qop === 'string') {
            let cnonceHash = crypto.createHash('md5');

            cnonceHash.update(Math.random().toString(36));
            cnonce = cnonceHash.digest('hex').substr(0, 8);
            nc = this._updateNC();
        }

        return {
            cnonce: cnonce,
            nc: nc
        };
    };

    //
    // ## Compose authorization header
    //
    HTTPDigest.prototype._compileParams = function compileParams(params) {
        let parts = [];
        for (let i in params) {
            let param = i + '=' + (this._putDoubleQuotes(i) ? '"' : '') + params[i] + (this._putDoubleQuotes(i) ? '"' : '');
            parts.push(param);
        }

        return 'Digest ' + parts.join(',');
    };

    //
    // ## Define if we have to put double quotes or not
    //
    HTTPDigest.prototype._putDoubleQuotes = function putDoubleQuotes(i) {
        let excludeList = ['qop', 'nc'];

        return (_.includes(excludeList, i) ? false : true);
    };

    //
    // ## Update and zero pad nc
    //
    HTTPDigest.prototype._updateNC = function updateNC() {
        let max = 99999999;
        this.nc++;
        if (this.nc > max) {
            this.nc = 1;
        }
        let padding = new Array(8).join('0') + '';
        let nc = this.nc + '';

        return padding.substr(0, 8 - nc.length) + nc;
    };

    // Return response handler
    return HTTPDigest;
}();

module.exports = function _createDigestClient(username, password) {
    return new HTTPDigest(username, password);
};