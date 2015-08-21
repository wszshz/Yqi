angular.module('starter.controllers', [])
//引导页
.controller('IntroCtrl',function($scope,$location){
	//立即体验
	$scope.gotoHome=function(){
		tools.storage.set('firstLaunch',true);
		$location.path('/tab/list').replace();	//不能再后退回引导页
	};
	
	$scope.slideHasChanged = function(index) {
  	};
})
.controller('tabsCtrl',function($scope,$state){
	$scope.goToState = function(state){
    	if($state.current.name != state)
        	$state.transitionTo(state, {}, {reload: state=='tab.list'?false: true});
   	};
})
/***************	activities model	*************************/
.controller('listCtrl',function($scope,$timeout,$ionicNavBarDelegate){
	// 从向导页面跳转过来的话，不显示返回按钮
	$timeout( function() {
		$ionicNavBarDelegate.showBackButton(false);
	}, 0);
})
/***************	chat model	*************************/
.controller('chatCtrl',function($scope){
})
/***************	user model	*************************/
.controller('userCtrl',function($scope,$location){
	$scope.userData={
		data:{
			avatar:'',	//头像
			nickname:'Howie',	//昵称
			phone:'',	//手机号码
			sign:'人生一场虚空大梦，韶发白首，不过转瞬'	//个性签名
		}
	};
	
	$scope.logout=function(){
		//注销登陆
		$location.path('/user/login').replace();
		//$state.go('tab.login');
	};
})
.controller('loginCtrl',function($scope){
	$scope.userData={
		phone:'',
		password:''
	};
	
	$scope.login=function(){
		
	};
});
