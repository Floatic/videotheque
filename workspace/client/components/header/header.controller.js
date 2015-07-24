'use strict';

angular.module('videothequeApp')
  .controller('HeaderCtrl', function ($scope, $location) {
    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });