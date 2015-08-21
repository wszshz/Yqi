define(['ionic', 'ebuy.controllers', 'ebuy.services', 'ebuy.directives', 'ebuy.phoneGapPlugin', 'cordova'], function() {
    'use strict';

    return angular.module('ebuy', ['ionic', 'ebuy.controllers', 'ebuy.services', 'ebuy.directives', 'ebuy.phoneGapPlugin'])
    .run(['requestProxy', 'configFactory', 'fileService', 'toastService', 'config', 'appInfoService', '$document'
        , '$state', '$ionicNavBarDelegate'
        , function(requestProxy, configFactory, fileService, toastService, config, appInfoService, $document
        , $state, $ionicNavBarDelegate) {

        angular.element($document[0].body).show();
        
        var stateList = ['/home', '/notice', '/app/integral',
            '/account', '/cart', '/login',
            '/register', '/forgot'];

        document.addEventListener('deviceready', function() {
            document.addEventListener('backbutton', onBackKeyDown, false);
            function onBackKeyDown() {
                var now = $state.current.url;
                if (!now || stateList.indexOf(now)!=-1) {
                    toastService.exit();
                } else {
                    $ionicNavBarDelegate.back();
                }
            };
            setTimeout(function() {
                var conf = configFactory(['getLaunch']);
                requestProxy(conf)
                    .success(function(data){
                        if (!data) {
                            return;
                        }
                        var key;
                        for (key in data) {
                            if (key.indexOf('image') + 1 && data[key]) {
                                fileService.launch(data[key], key, function (res) {
                                    console.error(JSON.stringify(res));
                                });
                            }
                        }
                    });
                if (!ionic.Platform.isIOS()) {
                    navigator.splashscreen.hide();
                }
            }, 2000);
            appInfoService.info(function(data){
                data = JSON.parse(data);
                config.platformConfig.version = data.version; 
            });
        }, false);
    }])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html',
            controller: 'tabsCtrl',
            resolve: {
                check: ['checkPermission', function(checkPermission){
                    return checkPermission();
                }]
            }
        })
        .state('tab.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'templates/tab_home.html',
                    controller: 'homeCtrl'
                }
            }
        })
        .state('tab.market', {
            url: '/market',
            views: {
                'tab-market': {
                    templateUrl: 'templates/store_detail.html',
                    controller: 'storeCtrl'
                }
            }
        })
        .state('tab.store', {
            url: '/carryout/:storeId',
            views: {
                'tab-carryout': {
                    templateUrl: 'templates/store_detail.html',
                    controller: 'storeCtrl'
                }
            }
        })
        .state('tab.carryout', {
            url: '/carryout',
            views: {
                'tab-carryout': {
                    templateUrl: 'templates/carryout.html',
                    controller: 'carryoutCtrl'
                }
            }
        })
        .state('tab.notice', {
            url: '/notice',
            views: {
                'tab-notice': {
                    templateUrl: 'templates/tab_notice.html',
                    controller: 'noticeCtrl'
                }
            }
        })
        .state('tab.noticeDetail', {
            url: '/notice/{noticeId:[0-9]+}',
            views: {
                'tab-notice': {
                    templateUrl: 'templates/notice_detail.html',
                    controller: 'noticeDetailCtrl'
                }
            }
        })
        .state('tab.app', {
            url: '/app',
            views: {
                'tab-app': {
                    templateUrl: 'templates/tab_app.html',
                    controller: 'appCtrl'
                }
            }
        })
        .state('tab.appDetail', {
            url: '/app/{index:[0-9]+}',
            views: {
                'tab-app': {
                    templateUrl: 'templates/app_detail.html',
                    controller: 'appDetailCtrl'
                }
            }
        })
        .state('tab.cart', {
            url: '/cart',
            views: {
                'tab-cart': {
                    templateUrl: 'templates/tab_cart.html',
                    controller: 'cartCtrl'
                }
            }
        })
        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab_account.html',
                    controller: 'accountCtrl'
                }
            }
        })
        .state('tab.orders', {
            url: '/account/orders',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_orders.html',
                    controller: 'ordersCtrl'
                }
            }
        })
        .state('tab.order-detail', {
            url: '/account/orders/:orderId',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_order_detail.html',
                    controller: 'orderDetailCtrl'
                }
            }
        })
        .state('tab.address', {
            url: '/account/address',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_addr.html',
                    controller: 'addressCtrl'
                }
            }
        })
        .state('tab.address-add', {
            url: '/account/address/add',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_addr_add.html',
                    controller: 'addressAddCtrl'
                }
            }
        })
        .state('tab.profile', {
            url: '/account/profile',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_profile.html',
                    controller: 'profileCtrl'
                }
            }
        })
        .state('tab.password', {
            url: '/account/password',
            views: {
                'tab-account': {
                templateUrl: 'templates/account_password.html',
                    controller: 'passwordCtrl'
                }
            }
        })
        .state('tab.complain', {
            url: '/account/complain',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_complain.html',
                    controller: 'complainCtrl'
                }
            }
        })
        .state('tab.about', {
            url: '/account/about',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_about.html',
                    controller: 'aboutCtrl'
                }
            }
        })
        .state('tab.favorites', {
            url: '/account/favorites',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_favorites.html',
                    controller: 'favoritesCtrl'
                }
            }
        })
        .state('tab.integral', {
            url: '/app/integral',
            views: {
                'tab-app': {
                    templateUrl: 'templates/account_integral.html',
                    controller: 'integralCtrl'
                }
            }
        })
        .state('tab.agreement', {
            url: '/account/about/agreement',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_agreement.html'
                }
            }
        })
        .state('tab.introduction', {
            url: '/account/about/introduction',
            views: {
                'tab-account': {
                    templateUrl: 'templates/account_introduction.html'
                }
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'registerCtrl'
        })
        .state('forgot', {
            url: '/forgot',
            templateUrl: 'templates/forgot.html',
            controller: 'forgotCtrl'
        })
        .state('tab.errands', {
            url: '/errands',
            views: {
                'tab-home': {
                    templateUrl: 'templates/errands.html',
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/home');
    }]);
})