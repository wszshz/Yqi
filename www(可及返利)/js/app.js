// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $http, $cordovaAppVersion, $ionicPopup, $ionicLoading, $cordovaFileTransfer, Userinfo) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    // 设备准备完后 隐藏启动动画
    
    navigator.splashscreen.hide();

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    //启动极光推送服务
    window.plugins.jPushPlugin.init();
    //调试模式
    // window.plugins.jPushPlugin.setDebugMode(true);

    //检查更新
    checkUpdate();

    function checkUpdate() {
      $cordovaAppVersion.getAppVersion().then(function(version) {
        Userinfo.add('version', version);
        $http.get('http://m2.cosjii.com/System/GetLastestVersion?_ajax_=1&t=a&v='+version).success(function(data) {
          if (data.error == 0) {
            if (version != data.version) {
              showUpdateConfirm(data.desc, data.apk);
            }
          }
        })
      });
    };

    function showUpdateConfirm(desc, url) {
      var confirmPopup = $ionicPopup.confirm({
        title: '有新版本了！是否要升级？',
        template: desc,
        cancelText: '下一次',
        okText: '确定'
      });
      var url = url;
      confirmPopup.then(function(res) {
        if (res) {
          window.open(url, '_system', 'location=yes');
        };

      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  //andoird 底部出现在了上部 解决方案
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: "UserCtrl"
  })

  .state('backstep', {
    url: "/step",
    abstract: true,
    templateUrl: "templates/user/getbackpwd.html",
    controller: "Backpwd"
  })

  .state('help', {
    url: '/help',
    abstract: true,
    templateUrl: 'templates/help/help.html',
    controller: 'Help'
  })

  .state('missorder', {
    url: '/missorder',
    abstract: true,
    templateUrl: 'templates/public/missorder.html',
    controller: 'MissOrder'
  })

  .state('public', {
    url: '/public',
    abstract: true,
    templateUrl: 'templates/public/public.html',
    controller: 'Public'
  })

  .state('missorder.form', {
    url: '/form',
    views: {
      'missorder': {
        templateUrl: 'templates/public/missform.html',
        controller: 'MissForm'
      }
    }
  })

  .state('backstep.step1', {
    url: '/step1',
    cache: 'false',
    views: {
      'getbackstep': {
        templateUrl: 'templates/user/getbackstep1.html',
        controller: 'Backpwd'
      }
    }
  })

  .state('backstep.step2', {
    url: '/step2',
    cache: 'false',
    views: {
      'getbackstep': {
        templateUrl: 'templates/user/getbackstep2.html',
        controller: 'Backpwd'
      }
    }
  })

  .state('backstep.step3', {
    url: '/step3',
    cache: 'false',
    views: {
      'getbackstep': {
        templateUrl: 'templates/user/getbackstep3.html',
        controller: 'Backpwd'
      }
    }
  })

  .state('help.helpleft', {
    url: '/helpleft',
    views: {
      'helpindex': {
        templateUrl: 'templates/help/helpleft.html',
        controller: 'Help-left'
      }
    }
  })

  .state('help.helpright', {
    url: '/helpright',
    views: {
      'helpindex': {
        templateUrl: 'templates/help/helpright.html',
        controller: 'Help-left'
      }
    }
  })

  .state('public.orderlist', {
    url: '/orderlist',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/orderlist.html',
        controller: 'Orderlist'
      }
    }
  })

  .state('public.acount', {
    url: '/acount',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/acount.html',
        controller: 'Acount'
      }
    }
  })

  .state('public.message', {
    url: '/message',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/message.html',
        controller: 'Message'
      }
    }
  })

  .state('public.incomedetail', {
    url: '/incomedetail',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/incomedetail.html',
        controller: 'Income'
      }
    }
  })

  .state('public.feedback', {
    url: '/feedback',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/feedback.html',
        controller: 'Feedback'
      }
    }
  })

  .state('public.jifen-exchange-cash', {
    url: '/jifen-exchange-cash',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/jifen-exchange-cash.html',
        controller: 'Exchange'
      }
    }
  })

  .state('public.withdraw-cash', {
    url: '/withdraw-cash',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/withdraw-cash.html',
        controller: 'WithdrawCash'
      }
    }
  })

  .state('public.withdraw-balance', {
    url: '/withdraw-balance',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/withdraw-balance.html',
        controller: 'WithdrawBalance'
      }
    }
  })

  .state('public.tutorial', {
    url: '/tutorial',
    views: {
      'public': {
        templateUrl: 'templates/public/tutorial.html',
        controller: 'Help'
      }
    }
  })

  .state('public.invitation', {
    url: '/invitation',
    views: {
      'public': {
        templateUrl: 'templates/public/invitation.html',
        controller: 'Invitation'
      }
    }
  })

  .state('public.friend-list', {
    url: '/friend-list',
    views: {
      'public': {
        templateUrl: 'templates/public/friend-list.html',
        controller: 'Invitation'
      }
    }
  })

  .state('public.active-back', {
    url: '/active-back',
    views: {
      'public': {
        templateUrl: 'templates/public/active-back.html',
        controller: 'ActiveBack'
      }
    }
  })

  .state('public.article', {
    url: '/article/:title',
    views: {
      'public': {
        templateUrl: 'templates/public/article.html',
        controller: 'Article'
      }
    }
  })

  .state('public.store-rebate', {
    url: '/store-rebate',
    views: {
      'public': {
        templateUrl: 'templates/public/store-rebate.html',
        controller: 'StoreRebate'
      }
    }
  })

  .state('public.misslist', {
    url: '/misslist',
    cache: 'false',
    views: {
      'public': {
        templateUrl: 'templates/public/misslist.html',
        controller: 'MissList'
      }
    }
  })
  // Each tab has its own nav history stack:

  .state('tab.index', {
    url: '/index',
    views: {
      'tab-index': {
        templateUrl: 'templates/tab-index.html',
        controller: 'IndexCtrl'
      }
    }
  })

  .state('tab.user', {
    url: '/user',
    cache: 'false',
    views: {
      'tab-user': {
        templateUrl: 'templates/tab-user.html',
        controller: 'UserCtrl'
      }
    }
  })

  .state('tab.taobao', {
    url: '/taobao',
    views: {
      'taobao': {
        templateUrl: 'templates/taobao.html',
        controller: 'Taobao'
      }
    }
  })

  .state('tab.zhemai', {
    url: '/zhemai',
    cache: 'false',
    views: {
      'zhemai': {
        templateUrl: 'templates/zhemai.html',
        controller: 'Zhemai'
      }
    }
  })

  .state('welcome', {
    url: '/welcome',
    abstract: true,
    templateUrl: 'templates/welcome/welcome.html',
    controller: 'Welcome'
  })

  .state('welcome.w_page', {
    url: '/w_page',
    views: {
      'welcome': {
        templateUrl: 'templates/welcome/w_page.html',
        controller: 'Welcome'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  // console.log(!window.localStorage['first']);
  if(!window.localStorage['first']){
  $urlRouterProvider.otherwise('/welcome/w_page');
  }else{
  $urlRouterProvider.otherwise('/tab/index');
  }
});