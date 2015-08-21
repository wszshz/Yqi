define(['app', 'ionic'], function(app){
    'use strict';

    app.constant('config', {
        /*time: 2014-08-21
        **author: Peach
        **content: banner config
        */
        banner: {
            width: 640,
            height: 220,
            changeTime: 5000, //unit: ms
            speed: 500 //the time of every changing
        },
        /*time: 2014-08-23
        **author: Peach
        **content: platform config
        */
        platformConfig: {
            host: 'http://www.fenghua100.com',
            version: '0.0.0.20',
            serviceTel: '057488591010'
        },
        /*time: 2014-08-23
        **author: Peach
        **content: api config
        */
        resConfig: {
            areas: {
                url: '/api/area',
                method: 'GET'
            },
            login: {
                url: '/api/user/auth',
                method: 'POST'
            },
            register: {
                url: '/api/user',
                method: 'POST'
            },
            forgot: {
                url: '/api/user/password/retrieve',
                method: 'PUT'
            },
            getAccount: {
                url: '/api/user',
                method: 'GET'
            },
            getFavorites: {
                url: '/api/user/favourites',
                method: 'GET'
            },
            setFavorite: {
                url: '/api/user/favourites',
                method: 'POST'
            },
            removeFavorite: {
                url: '/api/user/favourites/:id',
                method: 'DELETE'
            },
            getIntegralGoods: {
                url: '/api/webshop',
                method: 'GET'
            },
            exchangeIntegralGoods: {
                url: '/api/webshop/:id',
                method: 'PUT'
            },
            getOrders: {
                url: '/api/user/orders',
                method: 'GET'
            },
            getOrder: {
                url: '/api/user/orders/:orderId',
                method: 'GET'
            },
            removeOrder: {
                url: '/api/user/orders/:orderId',
                method: 'DELETE'
            },
            getAddress: {
                url: '/api/user/address',
                method: 'GET'
            },
            removeAddress: {
                url: '/api/user/address/:addrId',
                method: 'DELETE'
            },
            addAddress: {
                url: '/api/user/address',
                method: 'POST'
            },
            updateAddress: {
                url: '/api/user/address/:addrId',
                method: 'PUT'
            },
            setAddress: {
                url: '/api/user/address/:addrId',
                method: 'PUT'
            },
            setPassword: {
                url: '/api/user/password',
                method: 'PUT'
            },
            setComplain: {
                url: '/api/user/suggestions',
                method: 'POST'
            },
            setProfile: {
                url: '/api/user',
                method: 'PUT'
            },
            getBanners: {
                url: '/api/banner',
                method: 'GET'
            },
            getNotices: {
                url: '/api/news',
                method: 'GET'
            },
            getNotice: {
                url: '/api/news/:noticeId',
                method: 'GET'
            },
            getMarket: {
                url: '/api/store/market',
                method: 'GET'
            },
            getCarryouts: {
                url: '/api/store',
                method: 'GET'
            },
            getFreshs: {
                url: '/api/store/freshs',
                method: 'GET'
            },
            getConveniences: {
                url: '/api/store/conveniences',
                method: 'GET'
            },
            getErrands: {
                url: '/api/store/errands',
                method: 'GET'
            },
            getFruits: {
                url: '/api/store/fruits',
                method: 'GET'
            },
            getCarryout: {
                url: '/api/store/:storeId',
                method: 'GET'
            },
            getGoods: {
                url: '/api/items/:goodsId',
                method: 'GET'
            },
            getHotStore: {
                url: '/api/store/hot',
                method: 'GET'
            },
            search: {
                url: '/api/search',
                method: 'GET'
            },
            addOrder: {
                url: '/api/user/orders',
                method: 'POST'
            },
            // sms code api
            registerCode: {
                url: '/api/sms/register_code',
                method: 'POST'
            },
            forgotCode: {
                url: '/api/sms/retrieve_password',
                method: 'POST'
            },
            //upload api
            uploadAvatar: {
                url: '/api/user/avatar',
                method: 'PUT'
            },
            getLaunch: {
                url: '/api/splash_screen',
                method: 'GET'
            }
        },
        /*time: 2014-09-01
        **author: Peach
        **content: app config
        */
        apps: [
            {
                name: '天气预报',
                icon: 'ion-ios7-partlysunny',
                source: '新浪天气',
                className: 'app-weather',
                url: 'http://weather1.sina.cn/?code=fenghua&vt=4'
            },
            {
                name: '快递查询',
                icon: 'ion-filing',
                source: '快递100',
                className: 'app-express',
                url: 'http://m.kuaidi100.com/'
            },
        ]
    })
})
