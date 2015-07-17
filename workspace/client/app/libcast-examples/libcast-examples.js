'use strict';

angular.module('videothequeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('libcast-examples', {
        url: '/libcast-examples',
        templateUrl: 'app/libcast-examples/libcast-examples.html',
        controller: 'LibcastExamplesCtrl'
      });
  });