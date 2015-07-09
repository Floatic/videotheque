'use strict';

angular.module('videothequeApp')
        .controller('AjouterVideoCtrl', function ($scope, $rootScope, FileUploader, dialogs) {
            var uploader = $scope.uploader = new FileUploader({
                url: '/api/videos'
            });

            // Button event
            $scope.upload = function () {
                console.log('click');
                setTimeout(function () {
                    angular.element('#upload').trigger('click');
                }, 0);
            };

            // Upload filters
            uploader.filters.push({
                name: 'fileType',
                fn: function(item) {
                    var itemType = item.type;
                    return (itemType.indexOf('video') != -1) ? true : false;
                }
            });

            //
            // Upload callbacks
            //

            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
//                console.info('onWhenAddingFileFailed', item, filter, options);

                // Upload refused
                dialogs.notify('Erreur','Ajout du fichier impossible');
            };
            uploader.onAfterAddingFile = function (fileItem) {
//                console.info('onAfterAddingFile', fileItem);

                // Upload file directly
                fileItem.upload();
            };
            uploader.onProgressItem = function (fileItem, progress) {
//                console.info('onProgressItem', fileItem, progress);

                // Upload progression bar
                dialogs.wait('Veuillez patienter...', 'Votre téléchargement est en cours', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
//                console.info('onSuccessItem', fileItem, response, status, headers);

                // Success message
                dialogs.notify('Téléchargement terminé','Votre fichier est en ligne !');
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
//                console.info('onErrorItem', fileItem, response, status, headers);

                // Error message
                dialogs.notify('Erreur','Le téléchargement a échoué');
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
//                console.info('onCancelItem', fileItem, response, status, headers);

                // Error message
                dialogs.notify('Erreur','Le téléchargement a été annulé');
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
//                console.info('onCompleteItem', fileItem, response, status, headers);

                // Close progression bar
                $rootScope.$broadcast('dialogs.wait.complete');
            };
        });