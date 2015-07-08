'use strict';

angular.module('videothequeApp')
        .controller('AjouterVideoCtrl', function ($scope, FileUploader) {
            var uploader = $scope.uploader = new FileUploader({
                url: '/api/videos'
            });

            // Button event
            $scope.upload = function(){
                console.log('click');
                setTimeout(function () {
                  angular.element('#upload').trigger('click');
                }, 0);
            };

            // CALLBACKS

            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);

                // Upload file directly
                fileItem.upload();
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function (item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function (fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function (progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
            };

//            console.info('uploader', uploader);

        });
//        .directive('myTest', function () {
//            return {
//                link: function (scope, element, attr) {
//                    element.on('click', function (event) {
//                        var button = angular.element(element);
////console.log(el);
//                        el.css({
//                            position: 'relative',
//                            overflow: 'hidden',
//                            width: button.offsetWidth,
//                            height: button.offsetHeight
//                        });
//
//                        var fileInput = angular.element('<input type="file" />');
//                        fileInput.css({
//                            position: 'absolute',
//                            top: 0,
//                            left: 0,
//                            'z-index': '2',
//                            width: '100%',
//                            height: '100%',
//                            opacity: '0',
//                            cursor: 'pointer'
//                        });
//
//                        button.append(fileInput);
//                    });
//                }
//            };
//        });
