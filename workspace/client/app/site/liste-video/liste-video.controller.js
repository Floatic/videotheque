'use strict';

angular.module('videothequeApp')
    .controller('ListeVideoCtrl', function($scope, $http, dialogs, socket) {

        //
        // Variables
        //

        // Column details
        $scope.listeVideo = {
            columns: [{
                label: 'Id',
                field: ''
            }, {
                label: 'Description',
                field: 'title',
                sortable: true,
                style: 'width: 60%; text-align: left;'
            }, {
                label: 'Usage',
                field: 'usage',
                sortable: true
            }, {
                label: 'Taille',
                field: 'filesize',
                sortable: true
            }, {
                label: 'Etat',
                field: ''
            }, {
                label: '',
                field: ''
            }]
        };


        socket.socket.emit('test', {test: 'coucou'}, function(cbdata){
            console.log(cbdata);
        });

        // Load video list
        $http.get('/api/videotheque/videos').success(function(liste) {
            // var videoListe = JSON.parse(liste);
            //                console.log(liste[0]);
            //                console.log(videoListe[0]);
            //                console.log(typeof liste);
            //                console.log(typeof angular.toJson(liste));

            $scope.listeVideo.videos = liste;


            socket.socket.emit('test', {test: 'coucou'}, function(cbdata){
                console.log(cbdata);
            });
        });

        // Column sorting defaults
        // $scope.predicate = 'title';
        // $scope.reverse = false;

        //
        // Methods
        //

        // Sort columns
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        // Display video information
        $scope.displayInfo = function(slug) {
            if (slug === '') {
                dialogs.error(undefined, 'Une erreur est survenue');
            }

            $http.get('/api/videotheque/videos/' + slug).success(function(video) {
                dialogs.create('modal_video_info.html', 'videoInfoCtrl', {
                    video: video
                }, {
                    size: 'lg',
                    keyboard: true,
                    backdrop: 'static',
                    windowClass: 'ajouter-video-form-modal'
                });
            });
        };
    })
    .controller('videoInfoCtrl', function($scope, $modalInstance, data, $sce) {
        // ***************
        // Modal video info controller
        //****************

        //
        // Variables
        //

        $scope.video = data.video;
        $scope.videoPreview = $sce.trustAsHtml(data.video.widgets.widget._);


        //
        // Methods
        //

        $scope.close = function() {
            $modalInstance.close();
        };
    })
    .filter('Filesize', function() {
        //
        // Filter for human display of file size
        //

        return function(size) {
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
    })
    .directive('selectText', ['$window', function($window) {
        var selectElement;

        if ($window.document.selection) {
            selectElement = function(element) {
                var range = $window.document.body.createTextRange();
                range.moveToElementText(element[0]);
                range.select();
            };
        } else if ($window.getSelection) {
            selectElement = function(element) {
                var range = $window.document.createRange();
                range.selectNode(element[0]);
                $window.getSelection().addRange(range);
            };
        }

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    selectElement(element);
                });
            }
        };
    }]);