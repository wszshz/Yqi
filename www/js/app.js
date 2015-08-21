angular.module('starter', ['ionic','starter.controllers','starter.services','starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    // 设备准备完后 隐藏启动动画
    document.addEventListener("deviceready", function() {
    	navigator.splashscreen.hide();
		});
    
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider){
	//andoird 底部出现在了上部 解决方案 tabs-icon-top tabs-color-active-positive
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
  
	$stateProvider
		.state('intro',{
			url:'/intro',
			templateUrl:'templates/intro.html',
			controller:'IntroCtrl'
		})
		.state('tab', {
	    url: "/tab",
	    abstract: true,
	    templateUrl: "templates/tabs.html",
	    controller: "tabsCtrl"
  	})
		.state('tab.list',{
			url:'/list',
			views:{
				'tab-activities':{
					templateUrl:'templates/activities/list.html',
					controller:'listCtrl'
				}
			}
		})
		.state('tab.chat',{
			url:'/chat',
			views:{
				'tab-chat':{
					templateUrl:'templates/chat/chat.html',
					controller:'chatCtrl'
				}
			}
		})
		.state('tab.user',{
			url:'/user',
			views:{
				'tab-user':{
					templateUrl:'templates/user/user.html',
					controller:'userCtrl'
				}
			}
		})
		.state('tab.about',{
			url:'/user/about',
			views:{
				'tab-user':{
					templateUrl:'templates/user/about.html'
				}
			}
		})
		.state('tab.setting',{
			url:'/user/setting',
			views:{
				'tab-user':{
					templateUrl:'templates/user/setting.html',
					controller:'userCtrl'
				}
			}
		})
		.state('tab.login',{
			url:'/user/login',
			views:{
				'tab-user':{
					templateUrl:'templates/user/login.html',
					controller:'loginCtrl'
				}
			}
		});
	if(!tools.storage.get('firstLaunch')){
  	$urlRouterProvider.otherwise('/intro');
  }else{
  	$urlRouterProvider.otherwise('/tab/user');
  }
});
