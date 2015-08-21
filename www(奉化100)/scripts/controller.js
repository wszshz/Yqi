define(['ionic', 'ebuy.config', 'ebuy.services', 'ebuy.phoneGapPlugin'], function(){
    'use strict';

    var ctrl = angular.module('ebuy.controllers', ['ebuy.services', 'ebuy.phoneGapPlugin']);
    
    /*Name: tabs controller
     *Author: Peach
     *Time: 2014-08-27
    */
    ctrl.controller('tabsCtrl', ['$state', '$scope', function($state, $scope){
        $scope.goToState = function(state){
            if($state.current.name != state)
                $state.transitionTo(state, {}, {reload: state=='tab.home'?false: true});
        }
    }]);

    /*Name: home controller
     *Author: Peach, Tanjie
     *Time: 2014-08-23
    */
    ctrl.controller('homeCtrl', ['localStorageService', 'cacheService'
        , 'warningForm', 'requestProxy', 'config', '$scope', '$ionicSlideBoxDelegate'
        , '$timeout', '$ionicModal', '$ionicLoading', '$ionicScrollDelegate', '$state'
        , function(localStorageService, cacheService, warningForm
           , requestProxy, config, $scope, $ionicSlideBoxDelegate, $timeout
           , $ionicModal, $ionicLoading, $ionicScrollDelegate, $state){

        var homeData = {
            banners: [],
            conf: config['banner'],
            hotStoreFirst: [],
            hotStoreSecond: [],
            currentArea: localStorageService.get('area')
        };
        $scope.homeData = homeData;

        // set the carryout type to default
        localStorageService.remove('carryoutType');

        cacheService({keyName: 'getBanners'}, 'banners')
            .success(function(data){
                homeData.banners = data;
                $ionicSlideBoxDelegate.update();
            });

        //get hot store
        cacheService({keyName: 'getHotStore'}, 'hotStore')
            .success(function(data){
                $timeout(function(){
                    homeData.hotStores = data;
                }, 1);
            });

        $scope.openModal = function(){
            if(!$scope.modal){
                $ionicModal.fromTemplateUrl('templates/search.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    focusFirstInput: true
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }else
                $scope.modal.show();
        }

        $scope.openAreaModal = function(){
            if(!$scope.areaModal){
                $ionicModal.fromTemplateUrl('templates/toggle_area.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.areaModal = modal;
                    $scope.areaModal.show();
                });

                requestProxy({keyName: 'areas'}).success(function (data) {
                    $scope.availableAreas = data;
                });
            }else
                $scope.areaModal.show();
        }

        $scope.closeModal = function(business){
            if(business){
                $scope.modal.hide();
                $scope.searchResults = null;
                $scope.listType = null;
                $scope.searchControls.models.search = null;
            }
        }

        $scope.closeAreaModal = function () {
            $scope.areaModal.hide();
        };

        // toggle area and clear data about the previous area
        $scope.toggleArea = function (area) {
            $scope.closeAreaModal();
            if(homeData.currentArea && area.zip_code == homeData.currentArea.zip_code)
                return;
            localStorageService.set('area', area);
            localStorageService.remove('cache');
            localStorageService.remove('ebuyCart');
            homeData.currentArea = area;
            $state.go('tab.home', {}, {reload: true});
        }
        
        $scope.$on('$destroy', function(){
            if($scope.modal){
                $scope.modal.remove();
            }
        });

        // search modal functions
        var searchControls = {
            conf: {
                keyName: 'search'
            },
            search: {
                label: '关键字',
                name: 'keyword',
                require: true
            },
            models: {
                search: null
            }
        };

        $scope.searchControls = searchControls;

        searchControls.conf['success'] = function(data){
            if(data.message){
                warningForm(null, data.message);
                return;
            }
            $scope.searchResults = data;
            $scope.listType = 1;
            $ionicLoading.hide();
        }

        $scope.showLoading = function(){
            if(searchControls.models.search)
                $ionicLoading.show({
                    template: '搜索中...',
                    noBackdrop: true
                });
            return false;
        }

        $scope.changeListType = function(type){
            $scope.listType = type;
            $ionicScrollDelegate.scrollTo(0, 0, false);
        }
    }]);

    /*Name: notice controller
     *Author: Peach
     *Time: 2014-08-23
    */
    ctrl.controller('noticeCtrl', ['localStorageService', 'cacheService', 'configFactory', 'requestProxy'
        , 'config', '$scope', '$timeout'
        , function(localStorageService, cacheService, configFactory, requestProxy, config, $scope, $timeout){
        var notice = {
            data: [],
            newData: {},
            currentPage: 0,
            hasMore: true,
            hasCache: !!localStorageService.get('cache')&&localStorageService.get('cache')['notices']
        }
        $scope.notice = notice;
        $scope.loadMore = function(){
            var conf = configFactory(['getNotices']
                , {params: {page: notice.currentPage + 1}});
            cacheService(conf, 'notices')
                .success(function(data){
                    if(!data.next)
                        notice.hasMore = false;
                    // show the notices when infinite scroll be hidden
                    notice.currentPage++;
                    notice.newData[data.cachePage] = data.results;
                    notice.data = [];
                    for(var i in notice.newData){
                        notice.data = notice.data.concat(notice.newData[i]);
                    }

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
        }
    }]);

    /*Name: app controller
     *Author: Peach
     *Time: 2014-09-01
    */
    ctrl.controller('appCtrl', ['$timeout', 'config', '$scope'
        , function($timeout, config, $scope){
        var appData = {
            list: [
                {
                    name: '积分商城',
                    icon: 'ion-heart',
                    see: '用积分兑换心仪物品',
                    className: 'app-integral',
                    key: 'integral'
                }
            ]
        }
        appData.list = appData.list.concat(config['apps']);
        $timeout(function(){
            $scope.appData = appData;
        }, 1);
    }]);

    /*Name: cart controller
     *Author: Peach
     *Time: 2014-08-26
    */
    ctrl.controller('cartCtrl', ['alipayService', 'warningForm', 'configFactory', 'requestProxy'
        , 'localStorageService', 'cartOperation', '$scope', '$ionicPopup'
        , '$ionicModal', '$ionicLoading'
        , '$state', '$location'
        , function(alipayService, warningForm, configFactory, requestProxy, localStorageService
        , cartOperation, $scope, $ionicPopup, $ionicModal, $ionicLoading
        , $state, $location){
        var cartData = {
            shops: null,
            address: null,
            currentAddr: {},
            paymentMethod: 2,
            note: null
        }
        $scope.cartData = cartData;

        // init data from localstorage
        function initData(){
            var t = cartOperation.get();
            cartData.shops = [];
            for(var i in t){
                cartData.shops.push(t[i]);
            }
        }
        initData();

        $scope.addQuantity = function(item, shop){
            if(item.quantity == 99)
                return;
            item.quantity++;
            cartOperation.set(item, shop);
        }

        $scope.subQuantity = function(item, shop){
            if(item.quantity == 1)
                return;
            item.quantity--;
            cartOperation.set(item, shop);
        }

        // set a function to remove items or shop
        $scope.removeItem = function(itemId, shopId){
           $ionicPopup.confirm({
                title: '移除商品确认',
                template: '您确定移除此' + (itemId?'': '店铺所有已选')
                    + '商品吗?',
                buttons: [
                    {text: '取消'},
                    {
                        text: '移除',
                        type: 'button-assertive',
                        onTap: function(){return true;}
                    }
                ]
           })
           .then(function(res) {
                if(res) {
                    cartOperation.remove(itemId, shopId);
                    initData();
                }
           });
        }

        // set a functiont to calculation the total information of shop
        $scope.calcGroupTotal = function(items){
            var r = {
                count: 0,
                totalPrice: 0
            }

            for(var i in items){
                r.count += items[i].quantity*1;
                r.totalPrice += items[i].quantity * items[i].price;
            }

            return r;
        }

        // set a function to calculation the total information of cart
        $scope.calcCartTotal = function(){
            var t = cartOperation.get(),
                r = {
                    count: 0,
                    totalPrice: 0
                };

            for(var i in t){
                var temp = t[i].items;
                for(var j in temp){
                    r.count += temp[j].quantity*1;
                    r.totalPrice += temp[j].quantity * temp[j].price;
                }
            }

            return r;
        }

        //request the address when user be logined
        if(localStorageService.get('bearer_token')){
            requestProxy({keyName: 'getAddress'})
                .success(function(data){
                    cartData.address = data;
                });
        }

        $ionicModal.fromTemplateUrl('templates/cart_addr_select.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            if($location.search()['address']){
                $scope.modal.show();
                cartData.currentAddr.id = $location.search()['address'];
            }
        });

        $scope.openModal = function(){
            if(!cartData.address.length){
                warningForm(null, '请先添加一个收货地址!');
                return $location.url('/tab/account/address/add?cart=true');
            }
            $scope.modal.show();
        }
        $scope.closeModal = function(){
            if(!cartData.currentAddr || !cartData.currentAddr.id){
                return warningForm(null, '请先选择一个收货地址!');
            }
            placeOrder();
            $scope.modal.hide();
        }
        $scope.$on('$destroy', function(){
            $scope.modal.remove();
        });

        $scope.selectAddr = function(addr){
            cartData.currentAddr = addr;
        }

        function placeOrder(fee){

            $ionicLoading.show({
                template: '下单中...',
                noBackdrop: true
            })

            var conf = configFactory(['addOrder'], {data: {}});

            //produce order
            conf.data['order_data'] = JSON.stringify(cartOperation.produceOrder());
            //set address
            conf.data['address_id'] = cartData.currentAddr.id;
            //set payment method
            conf.data['payment_id'] = cartData.paymentMethod;
            //set note of order
            conf.data['message'] = cartData.note;
            //set delivery fee if it is exsit
            if(fee)
                conf.data['delivery_fee'] = fee;

            requestProxy(conf)
                .success(function(data, status, header){
                    $ionicLoading.hide();

                    if(data.code >= 400){
                        return warningForm(null, data.message || '订单创建失败, 请稍后重试!');
                    }

                    if(data.tooltip)
                        $ionicPopup.confirm({
                            title: '订单提示',
                            template: data.tooltip + '<br/>是否确定提交订单?',
                            buttons: [
                                {text: '取消'},
                                {
                                    text: '确定',
                                    type: 'button-positive',
                                    onTap: function(){return true;}
                                }
                            ]
                        })
                        .then(function(res) {
                            if(res) {
                                placeOrder(data.delivery_fee + '');
                            }
                        });
                    else{
                        cartOperation.remove();
                        cartData.shops = null;

                        $ionicPopup.confirm({
                            title: '订单成功提示',
                            template: '订单创建成功, 感谢您使用奉化100!<br/>'
                                + (cartData.paymentMethod == 1
                                ?'请在支付宝中完成付款'
                                : '点击确定进入我的订单'),
                            buttons: [{
                                text: '确定',
                                type: 'button-balanced',
                                onTap: function(){return true;}
                            }]
                        })
                        .then(function(res) {
                            if(res) {
                                if(cartData.paymentMethod == 1){
                                    alipayService.pay(data.partner, function(resText) {
                                        $ionicPopup.confirm({
                                            title: '支付信息提示',
                                            template: resText + ', 前往订单详情',
                                            buttons: [{
                                                text: '确定',
                                                type: 'button-balanced',
                                                onTap: function(){return true;}
                                            }]
                                        })
                                        .then(function(res) {
                                            if (res)
                                                $state.transitionTo('tab.order-detail', {orderId: data.id});
                                        });
                                    }, function(err) {
                                        $ionicPopup.confirm({
                                            title: '支付信息提示',
                                            template: err,
                                            buttons: [{
                                                text: '确定',
                                                type: 'button-balanced',
                                                onTap: function(){return true;}
                                            }]
                                        })
                                        .then(function(res) {
                                            if (res)
                                                $state.transitionTo('tab.order-detail', {orderId: data.id});
                                        });
                                    });
                                } else {
                                    $state.transitionTo('tab.order-detail', {orderId: data.id});
                                }
                            }
                        });
                    }
                })
                .error(function(){
                    $ionicLoading.hide();
                });
        }
    }]);

    ctrl.controller('accountCtrl', ['cacheService', 'requestProxy', 'localStorageService', '$ionicPopup'
        , '$state', '$scope', '$timeout'
        , function(cacheService, requestProxy, localStorageService
        , $ionicPopup, $state, $scope, $timeout){

        var accountData = {
            data: null
        }

        $scope.accountData = accountData;

        cacheService({keyName: 'getAccount'}, 'account')
            .success(function(data){
                $timeout(function(){
                    accountData.data = data;
                }, 1);
            });

        $scope.logout = function(){
           $ionicPopup.confirm({
                title: '退出登录确认',
                template: '您确定退出此账户吗?',
                buttons: [
                    {text: '取消'},
                    {
                        text: '退出',
                        type: 'button-assertive',
                        onTap: function(){return true;}
                    }
                ]
           })
           .then(function(res) {
                if(res) {
                    localStorageService.remove('bearer_token');
                    $state.transitionTo('login');
                }
           });
        }
    }]);

    /*Name: store detail controller
     *Author: Peach
     *Time: 2014-08-25
    */
    ctrl.controller('storeCtrl', ['warningForm', 'cartOperation'
        , 'configFactory', 'requestProxy', 'config', '$scope'
        , '$timeout', '$ionicScrollDelegate', '$stateParams'
        , '$location'
        , function(warningForm, cartOperation, configFactory
            , requestProxy, config, $scope, $timeout
            , $ionicScrollDelegate, $stateParams, $location){
            var storeData = {
                banner: null,
                data: null,
                items: [],
                currentGroup: $location.search()['groupId'],
                currentPage: 0,
                hasMore: true,
                first: true,
                storeId: $stateParams['storeId'],
                modalToggle: false,
                modalItem: null,
                modalBanner: null,
                category: $location.search()['category'],
                isHot: !!$location.search()['hot']
            }
            $scope.storeData = storeData;

            //load the goods data if the url has the groupId and goodsId
            if($location.search()['groupId']){
                var conf = configFactory(['getGoods']
                    , {params: {goodsId: $location.search()['goodsId']}});

                requestProxy(conf)
                    .success(function(data){
                        storeData.modalItem = data;
                        storeData.modalBanner = {'background-image': 'url(' + data.image_big + ')'};
                        storeData.modalToggle = true;
                    });
            }


            $scope.loadMore = function(gid){
                var conf = null;
                if(storeData.storeId)
                    conf = configFactory(['getCarryout']
                        , {params: {storeId: storeData.storeId}});
                else
                    conf = {
                            keyName: 'getMarket',
                            params: {}
                        }

                conf.params['gid'] = storeData.currentGroup;
                conf.params['page'] = storeData.currentPage + 1 == 1
                    ?null:storeData.currentPage + 1;
                requestProxy(conf)
                    .success(function(data){
                        if(storeData.first){
                            storeData.currentGroup = storeData.currentGroup || data.groups[0].id;
                            storeData.data = {
                                id: data.id,
                                name: data.name,
                                favorited: data.favorited,
                                groups: data.groups,
                                send_price: data.send_price,
                                short_desc: data.short_desc,
                                start_at: data.start_at,
                                end_at: data.end_at,
                                extra_start_at: data.extra_start_at,
                                extra_end_at: data.extra_end_at
                            };
                            storeData.first = false;
                            storeData.shop = {
                                id: data.id,
                                name: data.name,
                                send_price: data.send_price || 0
                            }
                            storeData.banner = data.image_big || 'images/market_pic.png';
                        }
                        if(data.next === null || data.items&&data.items.next === null)
                            storeData.hasMore = false;

                        // sync quantity from localstorage
                        var syncItems = cartOperation.syncData(data.results || data.items.results, storeData.shop.id);
                        storeData.items = storeData.items.concat(syncItems);
                        storeData.currentPage++;

                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            }
            $scope.loadMore();

            $scope.changeGroup = function(id){
                if(id == storeData.currentGroup)
                    return;
                // if the scroll top is overflow the header, scroll to the top
                if($ionicScrollDelegate.getScrollPosition().top > 163)
                    $ionicScrollDelegate.scrollTo(0, 163, false);
                storeData.currentGroup = id;
                storeData.currentPage = 0;
                storeData.hasMore = true;
                storeData.items = [];
                $scope.loadMore();
            }

            $scope.addQuantity = function(item){
                if(item.quantity == 99)
                    return;
                if(!item.quantity)
                    item.quantity = 1;
                else
                    item.quantity++;
                cartOperation.set(item, storeData.shop);
            }

            $scope.subQuantity = function(item){
                if(item.quantity == 0 || !item.quantity)
                    return;
                item.quantity--;
                cartOperation.set(item, storeData.shop);
            }

            $scope.calcTotal = function(){
                if(storeData.shop){
                    var t = cartOperation.get(null, storeData.shop.id),
                        r = {
                            count: 0,
                            totalPrice: 0
                        };

                    for(var i in t){
                        r.count += t[i].quantity*1;
                        r.totalPrice += t[i].quantity * t[i].price;
                    }

                    return r;
                }
                return null;
            }

            //set a function to open the detail modal
            $scope.openDetail = function(item){
                storeData.modalBanner = {'background-image': 'url(' + item.image_big + ')'};
                storeData.modalItem = item;
                storeData.modalToggle = true;
            }

            $scope.likeStore = function(){
                var conf = null;
                if(storeData.data.favorited){
                    conf = configFactory(['removeFavorite']
                        , {params: {id: storeData.data.favorited}});
                    storeData.data.favorited = null;
                }
                else{
                    conf = configFactory(['setFavorite']
                        , {data: {store_id: storeData.data.id}});
                    storeData.data.favorited = true;
                }

                requestProxy(conf)
                    .success(function(data){
                        if(data && data.id){
                            storeData.data.favorited = data.id;
                            warningForm(null, '添加收藏成功!');
                        }else{
                            warningForm(null, '删除收藏成功!');   
                        }
                    });
            }
    }]);

    /*Name: notice detail controller
     *Author: Peach
     *Time: 2014-08-26
    */
    ctrl.controller('noticeDetailCtrl', ['requestProxy', 'configFactory', '$scope'
        , '$stateParams', '$sce'
        , function(requestProxy, configFactory, $scope, $stateParams
        , $sce){
        var noticeData = {
            conf: configFactory(['getNotice']
                , {params: {noticeId: $stateParams['noticeId']}})
        }

        $scope.noticeData = noticeData;

        // get notice from server
        requestProxy(noticeData.conf)
            .success(function(data){
                data.content = $sce.trustAsHtml(data.content);
                noticeData.data = data;
            });
    }]);

    /*Name: login controller
     *Author: Peach
     *Time: 2014-08-28
    */
    ctrl.controller('loginCtrl', ['warningForm', 'localStorageService', '$state'
        , '$scope'
        , function(warningForm, localStorageService, $state, $scope){
        var formControls = {
            conf: {
                keyName: 'login'
            },
            phone: {
                label: '手机号码',
                name: 'phone',
                pattern: '/^[1][1-9][\\d]{9}$/',
                require: true
            },
            password: {
                label: '密码',
                name: 'password',
                require: true
            },
            models: {
                phone: localStorageService.get('username'),
                password: null
            }
        }
        $scope.formControls = formControls;

        formControls.conf['success'] = function(data){
            if(data.code >= 400){
                formControls.models.password = null;
                return warningForm(null, data.message || '登录失败, 请稍后重试!');
            }

            localStorageService.remove('cache');
            localStorageService.set('username', formControls.models.phone);
            // save token in localstorage
            localStorageService.set('bearer_token', data['bearer_token']);
            $state.transitionTo('tab.home');
        }
        
    }]);

    /**
     * @name: register controller
     * @author: lagel, Peach
     * @time: 2014-10-31
     */
    ctrl.controller('registerCtrl', ['configFactory', 'requestProxy'
        , 'warningForm', 'localStorageService', '$state', '$scope'
        , '$ionicModal', '$timeout'
        , function(configFactory, requestProxy, warningForm, localStorageService
        ,$state, $scope, $ionicModal, $timeout){
        var formControls = {
            conf: {
                keyName: 'register'
            },
            phone: {
                label: '手机号码',
                name: 'phone',
                pattern: '/^[1][1-9][\\d]{9}$/',
                require: true
            },
            code: {
                label: '验证码',
                name: 'sms_code',
                require: true
            },
            password: {
                label: '密码',
                name: 'password',
                pattern: '/^[a-zA-Z0-9]{6,31}$/i',
                warning: '密码格式错误, 长度不能小于6位数!',
                require: true
            },
            models: {
                phone: null,
                code: null,
                password: null
            },
            SMSConf: {
                timeout: 0,
                maxTime: 60,
                timer: null
            },
            step: 1,
            stepTitle: ['', '注册', '提交验证码', '设置密码']
        };

        $scope.formControls = formControls;

        formControls.conf['success'] = function(data) {
            if(data.code >= 400){
                if(data.message == '错误的验证码')
                    formControls.step = 2;
                return;
            }
            warningForm(null, data.message);
            localStorageService.remove('cache');
            localStorageService.set('username', formControls.models.phone);
            localStorageService.set('bearer_token', data['bearer_token']);
            $state.transitionTo('tab.home');
        };

        formControls.conf['error'] = function(data){
            if(data.message == '错误的验证码')
                formControls.step = 2;
        }

        $ionicModal.fromTemplateUrl('templates/register_agreement.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.showAgreement = function(){
            $scope.modal.show();
        }

        $scope.$on('$destroy', function(){
            $scope.modal.remove();
        });

        $scope.close = function(){
            $scope.modal.hide();
        }

        //set a function to toggle step
        $scope.goStep = function(index){
            if(!index)
                return $state.transitionTo('login');
            if(formControls.step ==1 && index == 2)
                $scope.sendSMS();
            formControls.step = index;
        }

        //set a function to send sms
        $scope.sendSMS = function(){
            if(formControls.SMSConf.timeout != 0)
                return;

            keepTime();

            var conf = configFactory(['registerCode']
                , {data: {phone: formControls.models.phone}});

            requestProxy(conf).success(function(data){
                    if(data.code >= 400){
                        $timeout.cancel(formControls.SMSConf.timer);
                        formControls.SMSConf.timeout = 0;
                        if(data.message == '用户已注册')
                            $state.transitionTo('login');
                        return;
                    }
                    warningForm(null, data.message);
                })
                .error(function(data){
                    $timeout.cancel(formControls.SMSConf.timer);
                    formControls.SMSConf.timeout = 0;
                    if(data.message == '用户已注册')
                        $state.transitionTo('login');
                });
        }

        //set a function to keep time
        function keepTime(time){
            if(time <= 0)
                return formControls.SMSConf.timeout = 0;

            if(!time && formControls.SMSConf.timer)
                $timeout.cancel(formControls.SMSConf.timer);

            time = time || formControls.SMSConf.maxTime;

            formControls.SMSConf.timer = $timeout(function(){
                formControls.SMSConf.timeout = time - 1;
                keepTime(formControls.SMSConf.timeout);
            }, 1000);

        }
    }]);

    /**
     * @name: forgot controller
     * @author: peach
     * @time: 2014-10-31
     */
    ctrl.controller('forgotCtrl', ['localStorageService', 'configFactory'
        , 'requestProxy', 'warningForm', '$state', '$scope'
        , function(localStorageService, configFactory, requestProxy
        , warningForm, $state, $scope){
        var formControls = {
            conf: {
                keyName: 'forgot'
            },
            phone: {
                label: '手机号码',
                name: 'phone',
                pattern: '/^[1][1-9][\\d]{9}$/',
                keyName: 'forgotCode',
                require: true
            },
            code: {
                label: '验证码',
                name: 'sms_code',
                require: true
            },
            password: {
                label: '密码',
                name: 'password',
                pattern: '/^[a-zA-Z0-9]{6,31}$/i',
                warning: '密码格式错误, 长度不能小于6位数!',
                require: true
            },
            models: {
                phone: null,
                code: null,
                password: null
            },
            SMSConf: {
                timeout: 0,
                maxTime: 60,
                timer: null
            },
            step: 1,
            stepTitle: ['', '找回密码', '设置密码']
        };

        $scope.formControls = formControls;

        formControls.conf['success'] = function(data) {
            if(data.code >= 400){
                if(data.message == '错误的验证码')
                    formControls.step = 1;
                return;
            }
            warningForm(null, data.message);
            $state.transitionTo('login');
        };

        formControls.conf['error'] = function(data){
            if(data.message == '错误的验证码')
                formControls.step = 1;
        }

        //set a function to toggle step
        $scope.goStep = function(index){
            if(index == 0)
                $state.transitionTo('login');
            formControls.step = index;
            if(index == 2)
                $scope.$apply();
        }
    }]);

    /*Name: order controller
     *Author: Peach
     *Time: 2014-08-29
    */
    ctrl.controller('ordersCtrl', ['configFactory', 'requestProxy'
        , '$scope', '$ionicPopup'
        , function(configFactory, requestProxy, $scope, $ionicPopup){
        var ordersData = {
            items: [],
            currentPage: 0,
            hasMore: true
        };

        $scope.ordersData = ordersData;

        $scope.loadMore = function(){
            var conf = configFactory(['getOrders']
                , {params: {page: ordersData.currentPage + 1}});

            requestProxy(conf)
                .success(function(data){
                    if(!data.next)
                        ordersData.hasMore = false;
                    ordersData.currentPage++;
                    ordersData.items = ordersData.items.concat(data.results);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        // set a function to concat goods
        $scope.getGoodsList = function(items){
            var array = [];
            for(var i in items)
                array.push(items[i].name);
            return array.join(', ');
        }

        //set a function to remove a order
        $scope.removeOrder = function(order, index){
           $ionicPopup.confirm({
                title: '删除订单确认',
                template: '您确定删除此订单吗?',
                buttons: [
                    {text: '取消'},
                    {
                        text: '删除',
                        type: 'button-assertive',
                        onTap: function(){return true;}
                    }
                ]
           })
           .then(function(res) {
                if(res) {
                    var conf = configFactory(['removeOrder']
                        , {params: {orderId: order.id}});
                    requestProxy(conf)
                        .success(function(){
                            ordersData.items.splice(index, 1);
                        });
                }
           });
        }
    }]);

    /*Name: address controller
     *Author: Peach
     *Time: 2014-08-30
    */
    ctrl.controller('addressCtrl', ['configFactory', 'requestProxy'
        , '$scope', '$ionicPopup'
        , function(configFactory, requestProxy, $scope, $ionicPopup){
        var addressData = {
            data: [],
            addModal: null
        };

        $scope.addressData = addressData;

        function getData(){
            requestProxy({keyName: 'getAddress'})
                .success(function(data){
                    addressData.data = data;
                });
        }
        getData();

        $scope.removeAddr = function(addr, index){
           $ionicPopup.confirm({
                title: '删除地址确认',
                template: '您确定删除此收货地址吗?',
                buttons: [
                    {text: '取消'},
                    {
                        text: '删除',
                        type: 'button-assertive',
                        onTap: function(){return true;}
                    }
                ]
           })
           .then(function(res) {
                if(res) {
                    var conf = configFactory(['removeAddress']
                        , {params: {addrId: addr.id}});
                    requestProxy(conf)
                        .success(function(){
                            addressData.data.splice(index, 1);
                        });
                }
           });
        }
    }]);

    /*Name: address add controller
     *Author: Peach
     *Time: 2014-09-01
    */
    ctrl.controller('addressAddCtrl', ['configFactory', 'requestProxy'
        , 'warningForm', '$state', '$scope', '$location'
        , function(configFactory, requestProxy, warningForm, $state
        , $scope, $location){
        var formControls = {
            conf: {
                keyName: 'addAddress'
            },
            addressee: {
                label: '收件人',
                name: 'username',
                pattern: '/[\\u4E00-\\u9FA5]/gm',
                warning: '收件人名字必须为中文名!',
                require: true
            },
            phone: {
                label: '联系电话',
                name: 'phone',
                pattern: '/(^(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?$)|(^((\\(\\d{3}\\))|(\\d{3}\\-))?(1[0-9]\\d{9})$)/',
                require: true
            },
            address: {
                label: '详细地址',
                name: 'name',
                require: true
            },
            models: {
                addressee: null,
                phone: null,
                address: null
            }
        };

        $scope.formControls = formControls;
        
        formControls.conf['success'] = function(data) {
                warningForm(null, '添加收货地址成功! ');
                if($location.search()['cart'])
                    $location.url('/tab/cart?address=' + data.id);
                else
                    $state.transitionTo('tab.address');
        };
    }]);

    /**
     * @name: change password add controller
     * @author: Lagel
     * @time: 2014-09-01
     */
    ctrl.controller('passwordCtrl', ['configFactory', 'requestProxy'
        , 'warningForm', '$state', '$scope'
        , function(configFactory, requestProxy, warningForm, $state, $scope){
        var formControls = {
            conf: {
                keyName: 'setPassword'
            },
            password: {
                label: '当前密码',
                name: 'password',
                require: true
            },
            newPassword: {
                label: '新密码',
                name: 'new_password',
                pattern: '/^[a-zA-Z0-9]{6,31}$/i',
                warning: '密码格式错误, 长度不能小于6位数!',
                require: true
            },
            newPasswordAgain: {
                label: '重复密码',
                name: 'new_password_again',
                seemAs: 'new_password',
                require: true
            },
            models: {
                password: null,
                newPassword: null,
                newPasswordAgain: null
            }
        };

        $scope.formControls = formControls;

        formControls.conf['success'] = function(data){
            warningForm(null, data.message);
            $state.transitionTo('tab.account');
        }
    }]);

    /**
     * @name: profile update controller
     * @author: lagel
     * @time: 2014-09-04
     */
    ctrl.controller('profileCtrl', ['localStorageService', 'avatarService', 'configFactory', 'requestProxy'
        , 'warningForm', '$state', '$scope', '$ionicActionSheet', '$ionicLoading'
        , function(localStorageService, avatarService, configFactory, requestProxy, warningForm, $state
        , $scope, $ionicActionSheet, $ionicLoading){
        var formControls = {
                conf: {
                    keyName: 'setProfile'
                },
                nickName: {
                    label: '昵称',
                    name: 'nickname',
                    require: true
                },
                sex: {
                    label: '性别',
                    name: 'sex'
                },
                models: {
                    nickName: null,
                    sex: 1,
                    phone: null,
                    avatar: null
                }
            },
            actionSheet = null;

        $scope.formControls = formControls;

        requestProxy({keyName: 'getAccount'})
            .success(function(data){
                formControls.models.nickName = data.nickname;
                formControls.models.phone = data.phone;
                formControls.models.sex = data.sex*1;
                formControls.models.avatar = data.avatar;
            });

        formControls.conf['success'] = function(data) {
            warningForm(null, '修改成功');
            $state.transitionTo('tab.account');
        };

        $scope.changeAvatar = function(){
            actionSheet = $ionicActionSheet.show({
                buttons: [
                    { text: '<span class="assertive">拍照</span>' },
                    { text: '从相册选择' }
                ],
                titleText: '修改头像',
                cancelText: '取消',
                buttonClicked: function(index) {
                    avatarService.modifyAvatar(index, localStorageService.get('bearer_token'), function(data){
                        data = JSON.parse(data.response)
                        $ionicLoading.hide();
                        warningForm(null, '头像修改成功');
                        formControls.models.avatar = data.avatar;
                    }, function(){
                        $ionicLoading.hide();
                        warningForm(null, '头像上传失败');
                    });

                    $ionicLoading.show({
                        template: '上传中...',
                        noBackdrop: true
                    });

                    actionSheet();
                }
            });
        }
    }]);

    /**
     * @name: complain add controller
     * @author: lagel
     * @time: 2014-09-01
     */
    ctrl.controller('complainCtrl', ['configFactory', 'requestProxy'
        , 'warningForm', '$state', '$scope'
        , function(configFactory, requestProxy, warningForm, $state, $scope){
        var formControls = {
            conf: {
                keyName: 'setComplain'
            },
            content: {
                label: '投诉意见',
                name: 'content',
                require: true
            },
            models: {
                content: null
            }
        };

        $scope.formControls = formControls;

        formControls.conf['success'] = function(data) {
            warningForm(null, '感谢您提供宝贵意见!');
            $state.transitionTo('tab.account');
        };
    }]);

    /*Name: app detail controller
     *Author: Peach
     *Time: 2014-09-01
    */
    ctrl.controller('appDetailCtrl', ['config', '$scope'
        , '$stateParams', '$sce', '$timeout'
        , function(config, $scope, $stateParams, $sce, $timeout){
        var app = config['apps'][$stateParams['index']-1],
            appData = {
                title: app.name,
                src: $sce.trustAsResourceUrl(app.url)
            };

        //wait the page animation be end
        $timeout(function(){
            $scope.appData = appData;
        }, 500);
    }]);

    /*Name: order detail controller
     *Author: Peach
     *Time: 2014-09-02
    */
    ctrl.controller('orderDetailCtrl', ['warningForm', 'configFactory', 'requestProxy'
        , 'alipayService', '$scope', '$stateParams', '$ionicLoading', '$ionicPopup'
        , function(warningForm, configFactory, requestProxy, alipayService
        , $scope, $stateParams, $ionicLoading, $ionicPopup){
        
        var orderData = {
            data: null,
            conf: configFactory(['getOrder']
                , {params: {orderId: $stateParams['orderId']}
                    , timeout: 20000}),
            paymentConf: configFactory(['getOrder']
                , {params: {orderId: $stateParams['orderId'], repayment: true}})
        }

        $scope.orderData = orderData;

        $ionicLoading.show({
            template: '加载中...',
            noBackdrop: true
        });

        $scope.rePayment = function() {
            $ionicPopup.confirm({
                title: '支付信息提示',
                template: '点击确定将跳转到支付宝进行付款',
                buttons: [
                    {text: '取消'},
                    {
                        text: '确定',
                        type: 'button-balanced',
                        onTap: function(){return true;}
                    }
                ]
            })
            .then(function(res) {
                if (res) {
                    requestProxy(orderData.paymentConf)
                        .success(function(data) {
                            if (data.partner) {
                                alipayService.pay(data.partner, function(res) {
                                    warningForm(null, res);
                                    orderData.data.status = 150;
                                    orderData.data.status_name = '已支付';
                                },
                                function(err) {
                                    warningForm(null, err);
                                });
                            } else {
                                warningForm(null, '此订单已失效');
                            }
                        })
                }
            });
            
        };

        requestProxy(orderData.conf)
            .success(function(data){
                if(data.code >= 400){
                    warningForm(null, '加载失败, 请稍后重试!');
                    return;
                }
                orderData.data = data;
                $ionicLoading.hide();
            })
            .error(function(){
                warningForm(null, '加载失败, 请稍后重试!');
            });

    }]);

    /*Name: about controller
     *Author: Peach
     *Time: 2014-09-02
    */
    ctrl.controller('aboutCtrl', ['warningForm', 'localStorageService', 'phoneService'
        , 'config', 'fileService', '$scope', '$ionicPopup'
        , function(warningForm, localStorageService, phoneService, config
        , fileService, $scope, $ionicPopup){
        var conf = config['platformConfig'];
        $scope.version = conf.version;

        $scope.call = function(){
            phoneService.call(conf.serviceTel);
        }

        $scope.clearCache = function(){
           $ionicPopup.confirm({
                title: '清空缓存确认',
                template: '您确定清空所有数据缓存吗?',
                buttons: [
                    {text: '取消'},
                    {
                        text: '清空',
                        type: 'button-assertive',
                        onTap: function(){return true;}
                    }
                ]
           })
           .then(function(res) {
                if(res) {
                    localStorageService.remove('cache');
                    fileService.clear();
                    warningForm(null, '清空缓存成功!');
                }
           });
        }
    }]);

    /*Name: carryout list controller
     *Author: Peach
     *Time: 2014-09-02
    */
    ctrl.controller('carryoutCtrl', ['localStorageService', 'warningForm', 'configFactory', 'requestProxy'
        , 'config', '$scope', '$ionicLoading', '$ionicScrollDelegate'
        , '$ionicNavBarDelegate', '$location'
        , function(localStorageService, warningForm, configFactory, requestProxy, config, $scope
        , $ionicLoading, $ionicScrollDelegate, $ionicNavBarDelegate, $location){
        var carryoutData = {
                typeList: null,
                list: null,
                type: localStorageService.get('carryoutType') || $location.search()['type'],
                category: $location.search()['category']
            },
            categoryRequest = {
                fruits: 'getFruits',
                freshs: 'getFreshs',
                conveniences: 'getConveniences',
                errands: 'getErrands'
            }
        $scope.carryoutData = carryoutData;

        function getData(){
            $ionicLoading.show({
                template: '加载中...',
                noBackdrop: true
            });
            var conf = configFactory([categoryRequest[carryoutData.category] || 'getCarryouts']
                , {params: {tid: carryoutData.type}, timeout: 20000});
            requestProxy(conf)
                .success(function(data){
                    if(data.code >= 400){
                        warningForm(null, '请求失败, 请稍后重试');
                        $ionicNavBarDelegate.back();
                        return;
                    }
                    if(!carryoutData.typeList){
                        carryoutData.typeList = data.store_type;
                        carryoutData.type = localStorageService.get('carryoutType') || $location.search()['type'] || data.store_type[0]['id'];
                    }
                    $ionicLoading.hide();
                    carryoutData.list = data.stores;
                })
                .error(function(){
                    warningForm(null, '请求失败, 请稍后重试');
                    $ionicNavBarDelegate.back();
                });
        }
        getData();

        $scope.changeType = function(type){
            carryoutData.type = type;
            localStorageService.set('carryoutType', type);
            getData();
            $ionicScrollDelegate.scrollTo(0, 0, false);
        }
    }]);

    /*Name: favorites controller
     *Author: Peach
     *Time: 2014-09-04
    */
    ctrl.controller('favoritesCtrl', ['configFactory', 'requestProxy'
        , 'config', '$scope', '$ionicPopup', '$state'
        , function(configFactory, requestProxy, config, $scope
        , $ionicPopup, $state){
        var favoritesData = {
                stores: [],
                hasMore: true,
                currentPage: 0
            }
        $scope.favoritesData = favoritesData;

        $scope.loadMore = function(){
            var conf = configFactory(['getFavorites']
                , {params: {page: favoritesData.currentPage + 1}});
            requestProxy(conf)
                .success(function(data){
                    if(!data.next)
                        favoritesData.hasMore = false;

                    favoritesData.currentPage++;
                    favoritesData.stores = favoritesData.stores.concat(data.results);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        $scope.removeFavorite = function(id, index){
           $ionicPopup.confirm({
                title: '删除收藏确认',
                template: '您确定将此店铺从收藏中删除吗?',
                buttons: [
                    {text: '取消'},
                    {
                        text: '删除',
                        type: 'button-assertive',
                        onTap: function(){return true;}
                    }
                ]
           })
           .then(function(res) {
                if(res) {
                    var conf = configFactory(['removeFavorite']
                        , {params: {id: id}});
                    requestProxy(conf)
                        .success(function(){
                            favoritesData.stores.splice(index, 1);
                        });
                }
           });
        };

        //set a function to redirect to the store
        //the feature that remove the favorite will invalid
        //when I use link tag to redirect to the store
        $scope.goToStore = function(id){
            $state.transitionTo('tab.store', {storeId: id});
        };
    }]);

    /*Name: integral controller
     *Author: Peach
     *Time: 2014-09-04
    */
    ctrl.controller('integralCtrl', ['warningForm', 'configFactory', 'requestProxy'
        , 'config', '$scope', '$ionicPopup', '$state'
        , function(warningForm, configFactory, requestProxy, config, $scope
        , $ionicPopup, $state){
        var intergralData = {
                goods: [],
                hasMore: true,
                currentPage: 0
            }
        $scope.intergralData = intergralData;

        $scope.loadMore = function(){
            var conf = configFactory(['getIntegralGoods']
                , {params: {page: intergralData.currentPage + 1}});
            requestProxy(conf)
                .success(function(data){
                    if(!data.next)
                        intergralData.hasMore = false;

                    intergralData.currentPage++;
                    intergralData.goods = intergralData.goods.concat(data.results);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        $scope.exchangeGoods = function(goods){
           $ionicPopup.confirm({
                title: '兑换商品确认',
                template: '您确定花费 ' + goods.cost + ' 积分兑换此商品吗?',
                buttons: [
                    {text: '取消'},
                    {
                        text: '兑换',
                        type: 'button-balanced',
                        onTap: function(){return true;}
                    }
                ]
           })
           .then(function(res) {
                if(res) {
                    var conf = configFactory(['exchangeIntegralGoods']
                        , {params: {id: goods.id}});
                    requestProxy(conf).success(function (data) {
                        warningForm(null, data.message);
                    });
                }
           });
        };
    }]);
})