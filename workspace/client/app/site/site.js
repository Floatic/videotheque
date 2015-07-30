'use strict';

angular.module('videothequeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('ajouter-video', {
        url: '/ajouter-video',
        templateUrl: 'app/site/ajouter-video/ajouter-video.html',
        controller: 'AjouterVideoCtrl'
      })
      .state('liste-video', {
        url: '/liste-video',
        templateUrl: 'app/site/liste-video/liste-video.html',
        controller: 'ListeVideoCtrl'
      })
      .state('home', {
        url: '/',
        templateUrl: 'app/site/home/home.html',
        controller: 'HomeCtrl'
      });
  });