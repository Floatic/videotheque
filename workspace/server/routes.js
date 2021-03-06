/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
// var debug = require('debug')('test');

module.exports = function(app) {
  // Insert routes below
  app.use('/api/videotheque', require('./api/videotheque')());
  app.use('/api/videos', require('./api/video'));
  app.use('/api/things', require('./api/thing'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      //Set user ?
      req.session.user = 'guillaume.burguiere@oatic.fr';


      res.sendfile(app.get('appPath') + '/index.html', {
        session: req.session
      });
    });
};