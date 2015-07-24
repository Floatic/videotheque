'use strict';

angular.module('videothequeApp')
        .controller('AjouterVideoCtrl', function ($scope, $rootScope, FileUploader, dialogs, $http, $filter) {
            // ***************
            // Page controller
            //****************

            //
            // Variables
            //

            // Uploader object
            var uploader = $scope.uploader = new FileUploader({
                url: '/api/libcast'
            });

            // Valid formats
            var formats = ['mp4','avi','wmv','mpg/mpeg','mov','m4v','3gp','flv','asf','quicktime'];

            //
            // Methods
            //

            // Add button event
            $scope.upload = function () {
                // console.log('click');
                setTimeout(function () {
                    angular.element('#upload').trigger('click');
                }, 0);
            };

            //
            // Upload filters
            //

            uploader.filters.push({
                name: 'fileType',
                fn: function (item) {
                    var itemType = _.words(item.type, /[^/ ]+/g);

                    return (_.indexOf(formats, itemType[1]) != -1) ? true : false;
                }
            });

            //
            // Upload callbacks
            //

            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
//                console.info('onWhenAddingFileFailed', item, filter, options);

                // Upload refused
                dialogs.error(undefined, 'Ajout du fichier impossible. Formats acceptés : ' + _(formats).toString());
            };
            uploader.onAfterAddingFile = function (fileItem) {
//                console.info('onAfterAddingFile', fileItem);

                var dlg = dialogs.create('modal_form.html', 'formCtrl', {}, {size: 'lg', keyboard: true, backdrop: 'static', windowClass: 'ajouter-video-form-modal'});
                dlg.result.then(function (videoData) {
                    // ** Validation

                    // Save file data
                    fileItem.formData.push({fileData: angular.toJson(videoData)});

                    // Upload file
                    fileItem.upload();

//                    $http.post('/api/videos', {video: angular.toJson(videoData)})
//                            .success(function (res) {
//                                // Upload file
//                                if (res.success) {
//                                    fileItem.upload();
//                                }
//                            });

                }, function () {
                    // ** Annulation du modal
                });
            };
            uploader.onProgressItem = function (fileItem, progress) {
//                console.info('onProgressItem', fileItem, progress);

                // Upload progression bar
                dialogs.wait(undefined, undefined, progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
//                console.info('onSuccessItem', fileItem, response, status, headers);

                // Success message
                dialogs.notify('Téléchargement terminé', 'Votre fichier a correctement été téléchargé sur notre serveur. <br>Le téléchargement sur le serveur Libcast est en cours. <br>Veuillez vous rendre sur la liste des vidéos pour suivre l\'état d\'avancement de votre vidéo');
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
//                console.info('onErrorItem', fileItem, response, status, headers);

                // Error message
                dialogs.error(undefined, 'Le téléchargement a échoué');
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
//                console.info('onCancelItem', fileItem, response, status, headers);

                // Error message
                dialogs.error(undefined, 'Le téléchargement a été annulé');
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
//                console.info('onCompleteItem', fileItem, response, status, headers);

                // Close progression bar
                $rootScope.$broadcast('dialogs.wait.complete');
            };
        })
        .controller('formCtrl', function ($scope, $modalInstance, data) {
            // ***************
            // Modal form controller
            //****************

            //
            // Variables
            //

            $scope.video = {
                title: '',
                description: '',
                usage: '',
                usagerights: ''
            };

            //
            // Methods
            //

            // Cancel form action
            $scope.cancel = function () {
                $modalInstance.dismiss('Canceled');
            }; // end cancel

            // Save form action
            $scope.save = function (form) {
                if (form.$valid) {
                    $modalInstance.close($scope.video);
                } else {
                    // Set fields dirty in case validation button would be manually enabled
                    angular.forEach(form, function (val, key) {
                        if (!key.match(/\$/)) {
                            val.$dirty = true;
                        }
                    });
                }
            }; // end save

            // Form can be validated by hitting the enter key
//            $scope.hitEnter = function (evt) {
//                if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.user.name, null) || angular.equals($scope.user.name, '')))
//                    $scope.save();
//            };
        })
        .config(['dialogsProvider', '$translateProvider', function (dialogsProvider, $translateProvider) {
                $translateProvider.translations('fr-FR', {
                    DIALOGS_ERROR: "Erreur",
                    DIALOGS_ERROR_MSG: "Une erreur inconnue est survenue.",
                    DIALOGS_CLOSE: "Fermer",
                    DIALOGS_PLEASE_WAIT: "Veuillez patienter",
                    DIALOGS_PLEASE_WAIT_ELIPS: "Veuillez patienter...",
                    DIALOGS_PLEASE_WAIT_MSG: "Votre téléchargement est en cours.",
                    DIALOGS_PERCENT_COMPLETE: "%",
                    DIALOGS_NOTIFICATION: "Notification",
                    DIALOGS_NOTIFICATION_MSG: "Notification d'application inconnue.",
                    DIALOGS_CONFIRMATION: "Confirmation",
                    DIALOGS_CONFIRMATION_MSG: "Confirmation requise.",
                    DIALOGS_OK: "OK",
                    DIALOGS_YES: "Oui",
                    DIALOGS_NO: "Non"
                });

                $translateProvider.preferredLanguage('fr-FR');

                // Enable escaping of HTML
                $translateProvider.useSanitizeValueStrategy('escaped');
            }]);