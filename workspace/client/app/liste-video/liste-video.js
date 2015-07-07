'use strict';

angular.module('videothequeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('liste-video', {
        url: '/liste-video',
        templateUrl: 'app/liste-video/liste-video.html',
        controller: 'ListeVideoCtrl'
      });
  });