'use strict'

//
// # Video entity
//
// Defines a video
//
//

let Video = function() {
    let _ = require('lodash');

    // Constructor
    let Video = function(stream) {
        this.stream = stream;
    }

}

module.exports = function(stream) {
    return new Video(stream);
}