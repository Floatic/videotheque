'use strict'

//
// # Libcast digest Client
//
// Basic communication with libcast and file creation
// by digest authentication.
//

let Client = function() {
    let _ = require('lodash');
    let digest = require('./lib/request-digest')(this.user, this.password);
//    let fs = require('fs');

    // Constructor
    let Client = function(user, password) {
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

    Client.prototype.upload = function(Video) {
        this.client.upload();
    }

    //
    // # Get video data
    //
    // Sends a GET request to the Libcast API
    //
    //

    Client.prototype.show = function(Video) {
        
    }

    //
    // # Update video
    //
    // Sends a PUT request to the Libcast API
    //
    //

    Client.prototype.update = function(Video) {
        
    }


    //
    // # Destroy video
    //
    // Sends a DELETE request to the Libcast API
    //
    //

    Client.prototype.destroy = function(Video) {
        
    }


    //
    // # Set video to draft mode
    //
    // Sends a PUT request to the Libcast API
    //
    //

    Client.prototype.setDraft = function(Video) {
        
    }

}
