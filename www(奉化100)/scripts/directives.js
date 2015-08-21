define(['ionic', 'ebuy.config'],  function(){
    'use strict';

    var dir = angular.module('ebuy.directives', ['ionic']);

    /*Name: banner init directive
     *Author: Peach
     *Time: 2014-08-23
    */
    dir.directive('bannerProduce', ['config', '$window', function(config, $window){
        return {
            require: '?^ionSlideBox',
            restrict: 'A',
            template: '',
            replace: true,
            link: function($scope, iElm, iAttrs, controller) {
                $scope.check = function(){
                    return iElm.find('img').size();
                }

                var watcher = $scope.$watch('check()', function(data){
                    if(data){
                        var ratio = config['banner'].width/config['banner'].height,
                            height = $window.innerWidth/ratio;
                        iElm.css('height', height);
                        iElm.animate({'opacity': 1}, 500);
                        watcher();
                    }
                })
            }
        };
    }]);

    /*Name: scroll toggle
     *Author: Peach
     *Time: 2014-08-24
     *Content: toggle display when the content is scrolling
    */
    dir.directive('scrollToggle', ['$document', function($document){
        return {
            restrict: 'A',
            link: function($scope, iElm, iAttrs, controller) {
                var edge = iAttrs['scrollToggle']*1,
                    target = angular.element(iAttrs['toggleElm']);

                $document.find('.scroll-content').scroll(function(){
                    if(iElm.position().top <= edge){
                        iElm.css('visibility', 'hidden');
                        target.show();
                    }
                    else{
                        iElm.css('visibility', 'visible');
                        target.hide();
                    }
                });
            }
        };
    }]);

    /*Name: history go back
     *Author: Peach
     *Time: 2014-08-26
    */
    dir.directive('goBack', ['$timeout', '$state', '$ionicNavBarDelegate'
        , '$ionicScrollDelegate'
        , function($timeout, $state, $ionicNavBarDelegate, $ionicScrollDelegate){
        return {
            restrict: 'A',
            link: function($scope, iElm, iAttrs, controller) {
                var states = ['/home', '/notice', '/app/integral',
                    '/account', '/cart', '/login',
                    '/register', '/forgot'];

                $scope.checkUrl = function(){
                    return $state.current.url;
                }

                $scope.$watch('checkUrl()', function(url){
                    if(url == '^')
                        return;

                    // set the content scroll y to 0 when you change url
                    $timeout(function(){
                        $ionicScrollDelegate.forgetScrollPosition();
                    }, 100);

                    if(states.indexOf(url) == -1){
                        if(iElm.parent().hasClass('no-animation'))
                            return $timeout(function(){
                                iElm.removeClass('ng-hide');
                            }, 1);
                        
                        iElm.addClass('ng-animate ng-hide-remove')
                        $timeout(function(){
                            iElm.removeClass('ng-hide')
                            .addClass('ng-hide-remove-active');
                            $timeout(function(){
                                iElm.removeClass('ng-animate ng-hide-remove ng-hide-remove-active');
                            }, 150);
                        }, 150);
                    }
                    else{
                        if(iElm.css('display') != 'none'){
                            if(iElm.parent().hasClass('no-animation'))
                                return iElm.addClass('ng-hide');

                            iElm.addClass('ng-animate ng-hide-add ng-hide')
                                .addClass('ng-hide-add-active');
                            $timeout(function(){
                                iElm.removeClass('ng-animate ng-hide-add ng-hide-add-active');
                            }, 340);
                        }
                    }
                });

                iElm.click(function(){
                    if($ionicNavBarDelegate.getPreviousTitle())
                        $ionicNavBarDelegate.back();
                    else
                        $state.transitionTo('tab.home');
                });
            }
        };
    }]);

    /*Name: form produce directive
     *Author: Peach
     *Time: 2014-08-28
     *See: need form control, just like input/textarea/checkbox
    */
    dir.directive('formProduce', ['config', 'configFactory', 'warningForm', 'requestProxy'
        , function(config, configFactory, warningForm, requestProxy){
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var controls = {},
                    values = {},
                    onlyFun = null,
                    elmCount = 0;

                this.addControl = function(name, control){
                    if(controls[name] === undefined)
                        elmCount++;
                    controls[name] = control;
                }
                this.setValue = function(name, value){
                    values[name] = value;
                }
                this.setOnlyFun = function(fun){
                    onlyFun = fun;
                }
                $element.submit(startSubmit);
                this.startSubmit = startSubmit;

                function startSubmit(onlyCheck){
                    for(var i in values){
                        //if not require, don't check it
                        if(!controls[i].require)
                            continue;
                        //check is null
                        if(!values[i]){
                            warningForm(controls[i].element, controls[i].label + '\u4E0D\u80FD\u4E3A\u7A7A !');  //不能为空
                            return false;
                        }
                        //check is seem to another one
                        if(controls[i].seemAs && values[i] != values[controls[i].seemAs]){
                            warningForm(controls[i].element, (controls[i].label
                                + '\u4E0E' + controls[controls[i].seemAs].label
                                + '\u5FC5\u987B\u4E00\u81F4 !'));  //与...必须一致
                            return false;
                        }
                        //check is overflow
                        if(controls[i].max && values[i]*1>controls[i].max){
                            warningForm(controls[i].element, controls[i].label
                                + '\u4E0D\u80FD\u8D85\u8FC7 ' + controls[i].max + ' !');  //不能超过
                            return false;
                        }
                        if(controls[i].min && values[i]*1<controls[i].min){
                            warningForm(controls[i].element, controls[i].label
                                + '\u4E0D\u80FD\u4F4E\u4E8E ' + controls[i].min + ' !');  //不能低于
                            return false;
                        }
                        //check the RegExp
                        if(controls[i].pattern){
                            var t = controls[i].pattern.split('/'),
                                r = new RegExp(t[1], t[t.length-1]);
                            if(!r.test(values[i])){
                                warningForm(controls[i].element, controls[i].warning || (controls[i].label + '\u4E0D\u7B26\u5408\u89C4\u8303 !'));  //不符合规范
                                return false;
                            }
                        }
                    }
                    var requestConf = {
                            keyName: $scope.formConf.keyName
                        };

                    if(config['resConfig'][requestConf.keyName]['method'] == 'GET')
                        requestConf.params = values;
                    else
                        requestConf.data = values;

                    //check is exist
                    var existCount = 0,
                        checkCount = 0;
                    for(var i in values){
                        checkCount++;
                        if(controls[i].isExist){
                            existCount++;
                            var checkConf = configFactory([controls[i].isExist], {params: {}}),
                                tempKey = i;
                            checkConf.params[i] = values[i];
                            requestProxy(checkConf)
                                .success(function(data){
                                    if(data[tempKey]){
                                        warningForm(controls[tempKey].element, controls[tempKey].label
                                        + '\u5DF2\u88AB\u4F7F\u7528 !');  //已被使用
                                        isExist = true;
                                    }else if(elmCount == checkCount)
                                        request();
                                });
                        }
                    }

                    if(!existCount)
                        request();

                    function request(){
                        //if only need check the form, dont' request
                        if(onlyCheck == true && onlyFun)
                            return $scope.$eval(onlyFun);
                        //if the config have a function for excuting, don't request
                        if($scope.formConf.fun){
                            $scope.formConf.fun();
                            return false;
                        }

                        var btnTxt = (function(){
                            //get all submit element
                            var e = jQuery($element).find('input[type=submit],button:not(button[type=button])'),
                                t = [];

                            for(var i=0;i<e.size();i++){
                                t.push(e.eq(i).val() || e.eq(i).html());
                                if(e.eq(i).val())
                                    e.eq(i).val('提交中...');
                                else
                                    e.eq(i).html('提交中...');
                                e.attr('disabled', 'disabled');
                            }
                            return t;
                        })();
                        requestProxy(requestConf)
                            .success(function(d, s, h, c){
                                if($scope.formConf['success'])
                                    $scope.formConf['success'](d, s, h, c);
                                resetBtn(btnTxt);
                            })
                            .error(function(d, s, h, c){
                                if($scope.formConf['error'])
                                    $scope.formConf['error'](d, s, h, c);
                                resetBtn(btnTxt);
                            });
                    }

                    function resetBtn(btnTxt){
                        var e = jQuery($element).find('input[type=submit],button:not(button[type=button])');

                        for(var i=0;i<e.size();i++){
                            if(e.eq(i).val())
                                e.eq(i).val(btnTxt[i]);
                            else
                                e.eq(i).html(btnTxt[i]);
                            e.removeAttr('disabled');
                        }
                    }
                    return false;
                }
            }],
            link: function($scope, iElm, iAttrs, controller) {
                //set a function for watch
                $scope.checkConfig = function(){
                    return $scope.$eval(iAttrs['formProduce']);
                }
                //watch the config
                var watcher = $scope.$watch('checkConfig()', function(conf){
                    $scope.formConf = conf;
                });
            }
        };
    }]);
    /*Name: normal input directive
     *Author: Peach
     *Time: 2014-08-28
     *See: require form produce
    */
    dir.directive('inputProduce',['configFactory', 'warningForm', 'requestProxy', function(configFactory, warningForm, requestProxy){
        return {
            restrict: 'A',
            scope: true,
            require: '^?formProduce',
            link: function($scope, iElm, iAttrs, formProduce) {
                //set a function for watch
                $scope.checkConfig = function(){
                    return $scope.$eval(iAttrs['inputProduce']);
                }
                //watch the config
                var watcher = $scope.$watch('checkConfig()', function(conf){
                    if(conf){
                        var control = {
                                label: conf.label,
                                pattern: conf.pattern,
                                warning: conf.warning,
                                require: conf.require,
                                seemAs: conf.seemAs,
                                isExist: conf.isExist,
                                min: conf.min,
                                max: conf.max,
                                element: iElm
                            },
                            name = conf.name;
                        formProduce.addControl(name, control);

                        $scope.getVal = function(){
                            return $scope.$eval(iAttrs['ngModel']);
                        }
                        $scope.$watch('getVal()', function(data){
                            formProduce.setValue(name, jQuery.trim(data));
                        });
                        if(conf.isExist){
                            iElm.bind('blur', function(){
                                if(!iElm.val())
                                    return;
                                if(control.pattern){
                                    var t = control.pattern.split('/'),
                                        r = new RegExp(t[1], t[t.length-1]);
                                    if(!r.test(iElm.val()))
                                        return;
                                }
                                var checkConf = configFactory([conf.isExist], {params: {}});
                                checkConf.params[name] = jQuery.trim(iElm.val());
                                requestProxy(checkConf)
                                    .success(function(data){
                                        if(data[name])
                                            warningForm(iElm, conf.label
                                            + '\u5DF2\u88AB\u4F7F\u7528 !');  //已被使用
                                    });
                            });
                        }
                        //watcher();
                    }
                }, true);
                
            }
        };
    }]);
    /*Name: phone verify directive
     *Author: Peach
     *Time: 2014-08-28
     *See: require form produce
    */
    dir.directive('phoneProduce',['configFactory', 'warningForm', 'requestProxy', '$timeout'
        , function(configFactory, warningForm, requestProxy, $timeout){
        return {
            restrict: 'A',
            scope: true,
            require: '^?formProduce',
            link: function($scope, iElm, iAttrs, formProduce) {
                //set a function for watch
                $scope.checkConfig = function(){
                    return $scope.$eval(iAttrs['phoneProduce']);
                }
                //watch the config
                var watcher = $scope.$watch('checkConfig()', function(conf){
                    if(conf){
                        var control = {
                                label: conf.label,
                                pattern: conf.pattern,
                                warning: conf.warning,
                                require: conf.require,
                                element: iElm
                            },
                            name = conf.name,
                            requestConf = configFactory([conf.keyName]),
                            sendBtn = angular.element(iAttrs['phoneSend']),
                            sendTxt = sendBtn.val() || sendBtn.html();

                        if(requestConf.method == 'GET')
                            requestConf['params'] = {};
                        else
                            requestConf['data'] = {};
                        formProduce.addControl(name, control);

                        $scope.getVal = function(){
                            return ($scope.$eval(iAttrs['ngModel']));
                        }
                        $scope.$watch('getVal()', function(data){
                            var t = jQuery.trim(data);
                            formProduce.setValue(name, t);
                            if(requestConf.method == 'GET')
                                requestConf.params[name] = t;
                            else
                                requestConf.data[name] = t;
                        });

                        sendBtn.click(function(){
                            if(!iElm.val() && control.pattern){
                                warningForm(iElm, control.label + '\u4E0D\u80FD\u4E3A\u7A7A !');  //不能为空
                                return;
                            }
                            if(control.pattern){
                                var t = control.pattern.split('/'),
                                    r = new RegExp(t[1], t[t.length-1]);
                                if(!r.test(iElm.val())){
                                    warningForm(iElm, control.warning || (control.label + '\u4E0D\u7B26\u5408\u89C4\u8303 !'));  //不符合规范
                                    return;
                                }
                            }
                            if(conf.isExist){
                                var checkConf = configFactory([conf.isExist], {params: {}});
                                checkConf.params[name] = iElm.val();
                                requestProxy(checkConf)
                                    .success(function(data){
                                        if(data[name])
                                            warningForm(iElm, conf.label
                                            + '\u5DF2\u88AB\u4F7F\u7528 !');  //已被使用
                                        else
                                            request();
                                    });
                            }else
                                request();

                            function request(){
                                sendBtn.val()?sendBtn.val('...'): sendBtn.html('...');
                                sendBtn.attr('disabled', 'disabled');
                                requestProxy(requestConf)
                                    .success(function(data){
                                        warningForm(null, data.message);
                                        startTimeout(60);
                                    }).error(function(){
                                        sendBtn.val()?sendBtn.val(sendTxt): sendBtn.html(sendTxt);
                                        sendBtn.removeAttr('disabled');
                                    });
                            }
                        });
                        //watcher();
                    }
                    function startTimeout(t){
                        if(!t){
                            sendBtn.removeAttr('disabled');
                            sendBtn.val()?sendBtn.val(sendTxt): sendBtn.html(sendTxt);
                            return;
                        }
                        var str = t--;
                        sendBtn.val()?sendBtn.val(str): sendBtn.html(str);
                        $timeout(function(){startTimeout(t)}, 1000);
                    }
                });
            }
        };
    }]);

    /*Name: ready hide directive
     *Author: Peach
     *Time: 2014-09-01
    */
    dir.directive('readyRemove', function(){
        return {
            restrict: 'A',
            link: function($scope, iElm, iAttrs, controller) {
                var obj = angular.element(iAttrs['readyRemove']);

                function bind(){
                    iElm.fadeOut(300, function(){
                        $(this).remove();
                    });
                    obj.unbind('load', bind);
                }

                obj.bind('load', bind);
            }
        };
    });
    /*Name: only check form directive
     *Author: Peach
     *Time: 2014-5-28
     *See: require form produce
    */
    dir.directive('formOnlyCheck',['requestProxy', function(requestProxy){
        return {
            restrict: 'A',
            require: '^?formProduce',
            link: function($scope, iElm, iAttrs, formProduce) {
                formProduce.setOnlyFun(iAttrs['formOnlyCheck']);

                iElm.click(function(){
                    formProduce.startSubmit(true);
                });
            }
        };
    }]);

    /*Name: blur input after enter directive
     *Author: Peach
     *Time: 2014-09-02
    */
    dir.directive('returnBlur', function(){
        return {
            restrict: 'A',
            link: function($scope, iElm, iAttrs, controller) {
                iElm.keyup(function(e){
                    if(e.keyCode == 13)
                        iElm.blur();
                });
            }
        };
    });

    /**Name: cache-src for image cache
     *Author: lagel
     *Time: 2014-10-21
    */
    dir.directive('cacheSrc', ['fileService', function(fileService) {
        return {
            restrict: 'A',
            link: function($scope, iElm, iAttrs) {
                $scope.checkSrc = function(){
                    return iAttrs['cacheSrc'];
                }

                var watcher = $scope.$watch('checkSrc()', function(data){
                    if(data){
                        fileService.read(iAttrs.cacheSrc, function(res) {
                            var image;
                            if (res.success) {
                                image = res.message;
                            } else {
                                fileService.save(iAttrs.cacheSrc, function(res) {
                                    console.error("save cache: " + res.success);
                                });
                            }
                            iAttrs.$set('src', image? image: iAttrs.cacheSrc);
                        });
                        watcher();
                    }
                });
                
            }
        }
    }]);


    /*Name: add clear input button directive
     *Author: Peach
     *Time: 2014-09-15
    */
    dir.directive('oneKeyClearInput',['$timeout', function($timeout){
        return {
            restrict: 'A',
            link: function($scope, iElm, iAttrs, controller) {
                var btn = angular.element('<i class="icon ion-ios7-close one-key-clear"></i>'),
                    handleId = iElm.html().length
                        + iElm.attr('class')?iElm.attr('class').split(' ').join(''): ''
                        + 'oneKey',
                    iconSize = 18,  //set the size for icon
                    touchScope = 6,  //set the touch scope for icon button
                    container = null;

                function init(){
                    // get parent
                    container = iElm.offsetParent();

                    // calc position
                    var top = iElm.offset().top + iElm.outerHeight()/2
                            - iconSize/2 - container.offset().top
                            - touchScope*1.4,
                        left = iElm.offset().left + iElm.outerWidth() 
                            - iconSize - touchScope - container.offset().left - 5;
                    
                    // set styles
                    btn.css({'position': 'absolute', 'top': top
                        , 'left': left, 'fontSize': iconSize
                        , 'color': '#ccc', 'padding': touchScope
                        , 'display': 'none', 'zIndex': 1000});

                    // push to dom
                    container.find('.one-key-clear').remove();
                    container.append(btn);

                    // bind event
                    if(container.is('label')){
                        container.click(function(e){
                            var x = e.clientX,
                                y = e.clientY,
                                top = btn.offset().top;
                                left = btn.offset().left;

                            // check touch scope for label
                            // because the click event of object can not be trigger
                            // when the obj is belong to the label
                            if(x > left - touchScope
                                && x < left + iconSize + touchScope
                                && y > top - touchScope 
                                && y < top + iconSize + touchScope){

                                $scope.$apply(iAttrs['ngModel'] + '=null');
                            }
                        });
                    }
                    btn.click(function(e){
                        $scope.$apply(iAttrs['ngModel'] + '=null');
                        e.stopPropagation();
                    });
                }

                $scope.checkVal = function(){
                    return $scope.$eval(iAttrs['ngModel']);
                }

                $scope.$watch('checkVal()', function(data){
                    if(data){
                        if(!container){
                            init();
                        }
                        btn.show();
                    }
                    else
                        btn.hide();
                });
            }
        };
    }]);
});