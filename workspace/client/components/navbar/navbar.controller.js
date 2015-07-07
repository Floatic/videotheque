'use strict';

angular.module('videothequeApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
        {
          'title': 'Accueil',
          'link': '/'
        },
        {
          'title': 'Ajouter une video',
          'link': '/ajouter-video'
        },
        {
          'title': 'Liste des vidéos',
          'link': '/liste-video'
        },
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });