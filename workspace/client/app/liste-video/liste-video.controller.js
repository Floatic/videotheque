'use strict';

angular.module('videothequeApp')
        .controller('ListeVideoCtrl', function ($scope, $http) {
            $scope.liste_video = {
                columns: ['Id', 'Titre', 'Usage', 'Taille', 'Etat'],
                videos: [
                    {
                        'id': 1,
                        'title': 'Le geste du maçon',
                        'use': 'Pédagogique',
                        'size': '1go',
                        'status': 'En ligne',
                    },
                    {
                        'id': 2,
                        'title': 'L\'accueil du stagiaire à l\'AFPA',
                        'use': 'Communication',
                        'size': '2go',
                        'status': 'En ligne',
                    },
                    {
                        'id': 3,
                        'title': 'L\'usage du fil à plomb',
                        'use': 'Pédagogique',
                        'size': '500mo',
                        'status': 'Téléchargement en cours',
                    },
                    {
                        'id': 4,
                        'title': 'PUMA arrive sur vos écrans',
                        'use': 'Communication',
                        'size': '13go',
                        'status': 'En ligne',
                    },
                ]
            };

            $http.get('/api/videos').success(function (liste) {
                console.info(liste);
            });
        });
