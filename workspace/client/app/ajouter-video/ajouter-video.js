'use strict';

angular.module('videothequeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ajouter-video', {
        url: '/ajouter-video',
        templateUrl: 'app/ajouter-video/ajouter-video.html',
        controller: 'AjouterVideoCtrl'
      });
  });