'use strict';

angular.module('videothequeApp')
        .controller('ListeVideoCtrl', function ($scope, $http) {

            //
            // Variables
            //

            $scope.listeVideo = {
                columns: [
                    {
                        label: 'Id',
                        field: ''
                    },
                    {
                        label: 'Description',
                        field: 'title',
                        sortable: true,
                        style: 'width: 60%; text-align: left;'
                    },
                    {
                        label: 'Usage',
                        field: 'usage',
                        sortable: true
                    },
                    {
                        label: 'Taille',
                        field: 'filesize',
                        sortable: true
                    },
                    {
                        label: 'Etat',
                        field: ''
                    },
                    {
                        label: '',
                        field: ''
                    }
                ]
            };

            $http.get('/api/videos').success(function (liste) {
                var videoListe = JSON.parse(liste);
//                console.log(liste[0]);
//                console.log(videoListe[0]);
//                console.log(typeof liste);
//                console.log(typeof angular.toJson(liste));

                $scope.listeVideo.videos = videoListe;
            });

            $scope.predicate = 'title';
            $scope.reverse = false;

            //
            // Methods
            //

            $scope.order = function(predicate) {
              $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
              $scope.predicate = predicate;
            };
        })
        .filter('Filesize', function () {
            //
            // Filter for human display of file size
            //

            return function (size) {
                if (isNaN(size)) {
                    size = parseInt(size);
                }

                if (size < 1024) {
                    return size + ' O';
                }

                size /= 1024;

                if (size < 1024) {
                    return Math.round(size) + ' Ko';
                }

                size /= 1024;

                if (size < 1024) {
                    return size.toFixed(2) + ' Mo';
                }

                size /= 1024;

                if (size < 1024) {
                    return size.toFixed(2) + ' Go';
                }

                size /= 1024;

                return size.toFixed(2) + ' To';
            };
        });

