define(['ionic', 'cordova', 'app'], function() {
    'use strict';

    var service = angular.module('ebuy.phoneGapPlugin', ['ionic', 'ebuy']);
    /**
     * @name: Prompt info by toastService
     * @author: lagel
     * @time: 2014-08-27
     */
    service.factory('toastService', function() {
        return {
            time: 0, 
            show: function(message, time, success, failure) {
                var showTime = time;
                if (arguments.length <= 2) {
                    showTime = 2000;
                }
                cordova.exec(success, failure, 'ToastPlugin', 'show', [message, showTime]);
            },
            exit: function() {
                var now = new Date().getTime();
                if (now - this.time > 2000) {
                    this.time = now;
                    this.show('再按一次退出系统');
                } else {
                    navigator.app.exitApp();
                }
            }
        }
    });

    /**
     * @name: Payment order interface
     * @author: lagel
     * @time: 2014-08-27
     */
    service.factory('alipayService', function() {
        return {
            pay: function(order, success, failure) {
                cordova.exec(success, failure, 'AliPayPlugin', 'pay', [order]);
            }
        }
    });

    /**
     * @name: call plugin
     * @author: lagel
     * @time: 2014-08-27
     */
    service.factory('phoneService', function() {
        return {
            call: function(number, success, failure) {
                cordova.exec(success, failure, 'PhonePlugin', 'call', [number]);
            }
        }
    });

    /**
     * @name: get appinfo interface
     * @author: lagel
     * @time: 2014-09-18
     */
    service.factory('appInfoService', function() {
        return {
            info: function(success, failure) {
                cordova.exec(success, failure, 'AppInfoPlugin', 'info', []);
            }
        }
    });

    /**
     * @name: pushService interface
     * @author: lagel
     * @time: 2014-09-20
     */
    service.factory('pushService', function() {
        return {
            register: function(success, failure) {
                cordova.exec(success, failure, 'PushPlugin', 'register', []);
            },
            unregister: function(success, failure) {
                cordova.exec(success, failure, 'PushPlugin', 'unregister', []);
            }
        }
    });

    /**
     * @name: avatarService provide a pictur by visit native source.
     * @author: lagel
     * @time: 2014-10-29
     * @description: if the source is null then get picture from camera else from library
     */

     service.factory('avatarService',['config', function(config) {
        return {
            modifyAvatar: function(source, token, success, failure) {
                var pictureSource, destinationType;
                pictureSource   = navigator.camera.PictureSourceType;
                destinationType = navigator.camera.DestinationType;
                if (source) {
                    getLibrary();
                } else {
                    getCamera();
                }

                function getCamera() {
                    navigator.camera.getPicture(onSuccessPic, failure,
                        {
                            quality: 50,
                            destinationType : destinationType.FILE_URI,
                            sourceType : pictureSource.CAMERA,
                            allowEdit: true,
                            targetHeight: 200,
                            targetWidth: 200
                        }
                    );
                }

                function getLibrary() {
                    navigator.camera.getPicture(onSuccessPic, failure,
                        {
                            quality: 50,
                            destinationType: destinationType.FILE_URI,
                            sourceType: pictureSource.PHOTOLIBRARY,
                            targetWidth : 200,
                            targetHeight : 200
                        }
                    );
                }

                function onSuccessPic(imageURI) {
                    var options = new FileUploadOptions();
                    options.fileKey = "avatar";
                    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";
                    options.headers = {'bearer_token': token};
                    options.httpMethod = 'PUT';
                    var ft = new FileTransfer();
                    ft.upload(imageURI, config.platformConfig.host
                            + config.resConfig.uploadAvatar.url,
                              success, failure, options);
                }
            }
        }
     }]);

    /**
     * @name: fileManagerService interface
     * @author: lagel
     * @time: 2014-10-21
     */
    service.factory('fileService', function() {
        var writeList = [];
        var cacheDir = 'fenghua100';
        var launchDir = 'launch';
        var imageFormat = {
            'large_image': 'Default-568h@2x~iphone.png',
            'image': 'Default@2x~iphone.png',
            'mini_image': 'Default~iphone.png'
        };
        return {
            init: function(dirName, fileName, success, failure) {
                // console.error(dirName, 1);
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, failure);
                // console.error(dirName, 2);
                function onSuccess(fileSystem) {
                    // console.error(dirName, 'dirName');
                    fileSystem.root.getDirectory(dirName, {create: true},
                        function(dataDir) {
                            dataDir.getFile(fileName, {}, getFileEntry, failure);
                        }, failure);
                }

                function getFileEntry(fileEntry) {
                    // console.error(fileName, 'success');
                    success(fileEntry);
                }

            },
            save: function(url, callback) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, null);

                function success(fileSystem) {
                    var fileTransfer = new FileTransfer();
                    var uri = encodeURI(url);
                    var hash =  fileSystem.root.fullPath + "/fenghua100/";
                    var end = "";
                    if (uri.indexOf('_') == -1) {
                        end = uri.substring(uri.lastIndexOf('/') + 1);    
                    } else {
                        end = (uri.substring(uri.lastIndexOf('/') + 1, uri.indexOf('_')) + 
                                 uri.substring(uri.lastIndexOf('.')));
                    }
                    hash += end;
                    writeList.push(end);
                    fileTransfer.download(
                        uri,
                        hash,
                        function(entry) {
                            callback({success: true, message: 'success...'});
                            if(writeList.indexOf(end) != -1)
                                writeList = writeList.splice(writeList.indexOf(end)
                                    , 1);
                        },
                        function(error) {
                            callback({success: false, message: 'failure...'});
                        },
                        false
                    );
                }
            },
            read: function(url, callback, type) {
                var fileName = "";
                if (url.indexOf('_') == -1) {
                    fileName = url.substring(url.lastIndexOf('/') + 1);    
                } else {
                    fileName = (url.substring(url.lastIndexOf('/') + 1, url.indexOf('_')) + 
                                url.substring(url.lastIndexOf('.')));
                }
                // console.error(fileName);

                var tempList = writeList.slice();
                // console.error(tempList);

                if (tempList.indexOf(fileName) != -1) {
                    callback({success: true, message: ''});
                    return;
                }
                // console.log(type, 'type');
                // console.error(launchDir, 'launchDir');
                var readDir = (type ? launchDir : cacheDir);
                // console.log(readDir, 'readdir');

                this.init(readDir, fileName, getFileEntry, fail);

                function getFileEntry(fileEntry) {
                    fileEntry.file(readFile, fail);
                }

                function readFile(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        callback({success: true, message: evt.target.result});
                    }
                    reader.readAsDataURL(file);
                }

                function fail(data) {
                    console.error(data, 'error');
                    callback({success: false, message: JSON.stringify(data)})
                }
            },
            clear: function(callback) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, null);
                callback = callback || function(){};

                function success(fileSystem) {
                    fileSystem.root.getDirectory(cacheDir, {create: true},
                        function(dataDir) {
                            dataDir.removeRecursively(
                                function() {
                                    callback({success: true, message: 'clear cache success..'});
                                },
                                function() {
                                    callback({success: false, message: 'clear cache failure..'});
                                }
                            );
                        }
                    );
                }
            },
            launch: function(url, key, callback) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, null);
                console.error("launch: ", url);
                function success(fileSystem) {
                    var fileTransfer = new FileTransfer();
                    var uri = encodeURI(url);
                    var hash =  fileSystem.root.fullPath + "/" + launchDir + "/";
                    hash += imageFormat[key];
                    console.error(hash);
                    fileTransfer.download(
                        uri,
                        hash,
                        function(entry) {
                            callback({success: true, message: 'success...'});
                        },
                        function(error) {
                            callback({success: false, message: 'failure...'});
                        },
                        false
                    );
                }
            },
        }
    });

})