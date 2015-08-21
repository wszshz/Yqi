define(['ionic', 'localStorage'], function() {
    'use strict';

    var service = angular.module('ebuy.services', ['ionic', 'LocalStorageModule']);

    /*Name: http request proxy
     *Author: Peach
     *Time: 2014-05-05
    */
    service.factory('requestProxy', ['warningForm', 'localStorageService', 'config', '$ionicPopup', '$http', '$location'
        , '$timeout', '$document'
        , function(warningForm, localStorageService, config, $ionicPopup, $http, $location, $timeout, $document){
        return function(arg){
            var k = arg['keyName'] || null,
                conf = {};
            //copy config to cancel relationship for original object
            jQuery.extend(true, conf, arg);

            if(k){
                var t = config['resConfig'][k];
                conf['url'] = t['url'];
                conf['method'] = t['method'];
                delete conf['keyName'];
            }
            if(!conf['headers'])
                conf['headers'] = {};

            function setParams(conf){
                var l = conf.url.split(':'),
                    d = conf.params;
                for(var i=1;i<l.length;i++){
                    var a = l[i].split('/');
                        k = a[0];
                    if(d[k]){
                        l[i] = d[k];
                        for(var j=1;j<a.length;j++){
                            l[i] += '/' + a[j];
                        }
                        delete(d[k]);
                    }
                    else
                        console.error('Missing parameter "' + k + '"!');
                }
                conf.url = l.join('');

                return conf;
            }

            if(conf.url.indexOf(':', conf.url.indexOf('http:')?-1: 5) != -1){
                conf = setParams(conf);
            }

            // if config has the server adress, add it
            if(config.platformConfig['host'])
                conf.url = config.platformConfig['host'] + conf.url;

            // if localstorage has the auth key, add it
            if(localStorageService.get('bearer_token')){
                angular.extend(conf.headers
                    , {'bearer_token': localStorageService.get('bearer_token')});
            }
            angular.extend(conf.headers
                , {'version': config['platformConfig']['version']});

            // if localstorage has the area code, add it
            if(localStorageService.get('area')){
                angular.extend(conf.headers
                    , {'zip_code': localStorageService.get('area').zip_code});
            }

            // add a second to prevent cache
            conf.url += '?s=' + new Date().getTime();

            var r = $http(conf);
            
            // check status and message in error
            r.success(function(d){
                if(d.code >= 400){
                    if(d.message)
                        $ionicPopup.alert({
                            title: '\u7CFB\u7EDF\u63D0\u793A', //系统提示
                            template: d.message
                        });
                    
                    if((d.code == 403)
                        && $location.url() != '/login'){
                        $location.url('/login');
                        localStorageService.remove('bearer_token')
                        warningForm(null, '身份认证已过期, 请重新登录!');
                    }
                    if((d.code == 401)
                        && $location.url() != '/login'){
                        $location.url('/login');
                        localStorageService.remove('bearer_token')
                        warningForm(null, '您的账号已在别处登录<br/>若非您本人操作, 请注意账户安全!');
                    }
                }
            });

            return r;
        }
    }]);
    /*Name: config factory service
     *Author: Peach
     *Time: 2014-05-17
    */
    service.factory('configFactory', ['config', function(config){
        return function (k, p){
            var t = getConf(config['resConfig'], 0),
                r = {};

            //find the config from 'config'
            function getConf(c, i){
                if(i >= k.length || !c[k[i]])
                    return null;
                if(i == k.length - 1)
                    return c[k[i]];
                c = c[k[i++]];
                return getConf(c, i);
            }
            //copy config
            for(var i in t)
                r[i] = t[i];
            //add new attribute
            for(var i in p){
                r[i] = p[i];
            }
            return r;
        };
    }]);
    /*Name: cart operation
     *Author: Peach
     *Time: 2014-08-25
    */
    service.factory('cartOperation', ['localStorageService'
        , function(localStorageService){
        var keyName = 'ebuyCart';
        return {
            get: function(itemId, shopId){
                var all = localStorageService.get(keyName);
                // if no have arguments, return all items
                if(!itemId&&!shopId)
                    return all;
                // if no have item id, return items of shop
                var shop = all?all[shopId]: null;
                if(!itemId){
                    return shop?shop.items: null;
                }
                for(var i in shop.items){
                    if(shop.items[i].id == itemId)
                        return shop.items[i];
                }
                return null;
            },
            set: function(item, shop){
                var all = localStorageService.get(keyName) || {},
                    goods = {
                        id: item.id,
                        name: item.name,
                        originalPrice: item.original_price || item.originalPrice,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    };
                if(!item || !shop)
                    return console.error('Missing params in set function!');
                // if the shop is already exists, just edit it
                if(this.get(null, shop.id)){
                    var shopItems = all[shop.id]['items'];
                    for(var i in shopItems){
                        // if the item is already exists
                        // add the quantity of it
                        if(shopItems[i].id == item.id){
                            if(item.quantity)
                                shopItems[i].quantity = item.quantity;
                            // if the quantity of item is invalid, remove it
                            else
                                return this.remove(item.id, shop.id);
                            return localStorageService.set(keyName, all);
                        }
                    }
                    // if the item is not exists
                    // push it to items
                    shopItems.push(goods);
                    return localStorageService.set(keyName, all);
                }
                // if the shop is not exists, create it
                else{
                    var shop = {
                        id: shop.id,
                        name: shop.name,
                        sendPrice: shop.send_price,
                        items: [goods]
                    }
                    all[shop.id] = shop;
                    return localStorageService.set(keyName, all);
                }
            },
            remove: function(itemId, shopId){
                if(!itemId&&!shopId)
                    return localStorageService.remove(keyName);

                var all = localStorageService.get(keyName),
                    shop = all[shopId];

                if(!itemId){
                    delete all[shopId];
                    return localStorageService.set(keyName, all);
                }
                // if the shop is exist, find the items of it
                if(shop){
                    for(var i in shop.items){
                        // if there has the item, edit it
                        if(shop.items[i].id == itemId){
                            // if the length of item is 1, delete it
                            if(shop.items.length == 1){
                                delete all[shopId];
                                return localStorageService.set(keyName, all);
                            }
                            else{
                                shop.items.splice(i, 1);
                                return localStorageService.set(keyName, all);
                            }
                        }
                    }
                    // is there has not the item, return null
                    return null;
                }
                // is the shop is not exist, return null
                return null;
            },
            syncData: function(data, shopId){
                if(!data || !shopId)
                    return console.error('Missing params in syncData function!');
                var shopItems = this.get(null, shopId);
                // if the shop has items, sync it
                if(shopItems){
                    for(var i in shopItems){
                        for(var j in data){
                            if(shopItems[i].id == data[j].id)
                                data[j]['quantity'] = shopItems[i].quantity;
                        }
                    }
                }
                return data;
            },
            produceOrder: function(){
                var r = {},
                    all = this.get();

                for(var i in all){
                    var items = all[i].items;
                    for(var j in items)
                        r[items[j].id] = items[j].quantity;
                }

                return r;
            }
        };
    }]);
    /*Name: check user's permission
     *Author: Peach
     *Time: 2014-08-28
     *See: This service is used to detect the user has no privileges, if params is true, if not have redirect
    */
    service.factory('checkPermission', ['localStorageService', 'requestProxy', '$location'
        , '$rootScope', '$q'
        , function(localStorageService, requestProxy, $location, $rootScope, $q){
        return function(f){
            var deferred = $q.defer();
            if(localStorageService.get('bearer_token')){
                deferred.resolve();
            }else{
                $location.path('/login');
            }
            return deferred.promise;
        }
    }]);
    /*Name: form control warning
     *Author: Peach
     *Time: 2014-08-28
     *Require: font-awesome
    */
    service.factory('warningForm', ['$timeout', '$ionicLoading', function($timeout, $ionicLoading){
        return function (iElm, txt){
            if(!txt)
                return;
            $ionicLoading.show({
                template: txt,
                noBackdrop: true
            });

            $timeout(function(){
                $ionicLoading.hide();
            }, txt.length*80 < 1500?1500: txt.length*80);
        }
    }]);
    /*Name: cache service
     *Author: Peach
     *Time: 2014-09-10
     *Require: requestProxy
     *See: not suport pagination!!
    */
    service.factory('cacheService', ['localStorageService', 'requestProxy', function(localStorageService, requestProxy){
        return function(conf, cacheKey){
            if(!cacheKey)
                return console.error('losing params in cache service!');
            var data = null,
                cache = localStorageService.get('cache') || {},
                hasCache = !!cache[cacheKey],
                request = null;

            if(!conf['headers'])
                conf['headers'] = {};

            if(hasCache){
                if(conf.params&&conf.params['page']){
                    data = cache[cacheKey]['data'][conf.params['page']];
                    data['cachePage'] = conf.params['page'];
                }
                else
                    data = cache[cacheKey].data;

                angular.extend(conf.headers
                    , {'IF_MODIFIED_SINCE': cache[cacheKey].modifyTime});
            }

            request = requestProxy(conf);
            request.success(function(d, s, h){
                if(s != 304){
                    cache[cacheKey] = {
                        'modifyTime': h('Last-Modified')
                    };
                    if(conf.params&&conf.params['page']){
                        if(!cache[cacheKey]['data'])
                            cache[cacheKey]['data'] = {};
                        cache[cacheKey]['data'][conf.params['page']] = d;
                    }
                    else
                        cache[cacheKey]['data'] = d;
                    localStorageService.set('cache', cache);
                }
            });


            // function
            return {
                success: function(fn){
                    if(hasCache)
                        fn(data);
                    request.success(function(d, s, h, c){
                        if(s != 304){
                            if(conf.params&&conf.params['page'])
                                d['cachePage'] = conf.params['page'];
                            fn(d, s, h, c);
                        }
                    });
                },
                error: function(fn){
                    request.error(fn);
                }
            }
        };
    }])
})