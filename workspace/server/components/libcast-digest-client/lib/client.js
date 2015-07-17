'use strict'

//
// # Libcast digest Client
//
// Basic communication with libcast and file creation
// by digest authentication.
//

var Client = function() {
    var _ = require('lodash');
    var digest = require('./lib/request-digest')(this.user, this.password);
//    var fs = require('fs');

    // Constructor
    var Client = function(user, password) {
        this.host = 'https://console.libcast.com';
        this.port = 80;
        this.headers = '';
        this.user = user;
        this.password = password;
    }

    //
    // # Upload
    //
    // Sends a POST request to the Libcast API
    //
    //

    //
    // # Get video list
    //
    // Sends a GET request to the Libcast API
    //
    //

    //
    // # Upload
    //
    // Sends a POST request to the Libcast API
    //
    //

    //
    // # Destroy
    //
    // Sends a DELETE request to the Libcast API
    //
    //
}
