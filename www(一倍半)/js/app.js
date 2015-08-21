angular.module('yibeiban', ['ionic','ionic.contrib.frostedGlass','ngAnimate','ui.router'])
.directive('focusMe', function($timeout){return {link: function(scope, element, attrs){$timeout(function(){element[0].focus();}, 1000);}};})
.directive('textarea', function(){
  return {
    restrict: 'E',
    link: function(scope, element, attr){
      var update = function(){element.css("height", (element[0].scrollHeight+20) + "px");};
      scope.$watch(attr.ngModel, function(){update();});
    }
  };
})
.directive('compile', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
   )};
}])
.factory('Camera', ['$q', function($q){
  return {
    getPicture: function(n){
      var q = $q.defer();
      var options = new Object();
      if(n==2){options.sourceType = "Camera.PictureSourceType.PHOTOLIBRARY";}
      navigator.camera.getPicture(function(result){
        q.resolve(result);
      }, function(err){
        q.reject(err);
      }, options);
      return q.promise;
    }
  };
}])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    //abstract
    .state('menus', {url:'/menus', templateUrl:'html/menus.html', controller:'ctrl-menus', abstract:true})
    .state('start', {url:'/start', templateUrl:'html/start.html', controller:'ctrl-start'})
    //register
    .state('reg-1', {url:'/reg-1', templateUrl:'html/reg/1.html', controller:'ctrl-reg-1'})
    .state('reg-2', {url:'/reg-2', templateUrl:'html/reg/2.html', controller:'ctrl-reg-2'})
    .state('reg-3', {url:'/reg-3', templateUrl:'html/reg/3.html', controller:'ctrl-reg-3'})
    //job
    .state('menus.job-main' ,{views:{'tab-job':{templateUrl:'html/job/main.html',controller:'ctrl-job-main' }},url:'/job/main?time'             })
    .state('menus.job-list' ,{views:{'tab-job':{templateUrl:'html/job/list.html',controller:'ctrl-job-list' }},url:'/job/list?time'             })
    .state('menus.job-view' ,{views:{'tab-job':{templateUrl:'html/job/view.html',controller:'ctrl-job-view' }},url:'/job/view?time&id_job'      })
    .state('menus.job-find' ,{views:{'tab-job':{templateUrl:'html/job/find.html',controller:'ctrl-job-find' }},url:'/job/find?time&keywords&location&industry&salary_min&salary_max'})
    //say
    .state('menus.say-list' ,{views:{'tab-say':{templateUrl:'html/say/list.html',controller:'ctrl-say-list' }},url:'/say/list?time&keywords&top'})
    .state('menus.say-view' ,{views:{'tab-say':{templateUrl:'html/say/view.html',controller:'ctrl-say-view' }},url:'/say/view?time&id_gossip'   })
    .state('menus.say-post' ,{views:{'tab-say':{templateUrl:'html/say/post.html',controller:'ctrl-say-post' }},url:'/say/post?time'             })
    //msg
    .state('menus.msg-list' ,{views:{'tab-msg':{templateUrl:'html/msg/list.html',controller:'ctrl-msg-list' }},url:'/msg/list?time'             })
    .state('menus.msg-view' ,{views:{'tab-msg':{templateUrl:'html/msg/view.html',controller:'ctrl-msg-view' }},url:'/msg/view?time&id_box'      })
    .state('menus.msg-info' ,{views:{'tab-msg':{templateUrl:'html/msg/info.html',controller:'ctrl-msg-info' }},url:'/msg/info?time&id_box'      })
    .state('menus.msg-jobs' ,{views:{'tab-msg':{templateUrl:'html/job/view.html',controller:'ctrl-job-view' }},url:'/msg/jobs?time&id_job'      })
    //usr
    .state('menus.usr-main'     , {url:'/usr/main'      , views:{'tab-usr':{templateUrl:'html/usr/main.html'      , controller:'ctrl-usr-main'      }}})
    .state('menus.usr-career'   , {url:'/usr/career'    , views:{'tab-usr':{templateUrl:'html/usr/career.html'    , controller:'ctrl-usr-career'    }}})
    .state('menus.usr-contact'  , {url:'/usr/contact'   , views:{'tab-usr':{templateUrl:'html/usr/contact.html'   , controller:'ctrl-usr-contact'   }}})
    .state('menus.usr-privacy'  , {url:'/usr/privacy'   , views:{'tab-usr':{templateUrl:'html/usr/privacy.html'   , controller:'ctrl-usr-privacy'   }}})
    .state('menus.usr-settings' , {url:'/usr/settings'  , views:{'tab-usr':{templateUrl:'html/usr/settings.html'  , controller:'ctrl-usr-settings'  }}})
    .state('menus.usr-education', {url:'/usr/education' , views:{'tab-usr':{templateUrl:'html/usr/education.html' , controller:'ctrl-usr-education' }}})
    .state('menus.usr-intention', {url:'/usr/intention' , views:{'tab-usr':{templateUrl:'html/usr/intention.html' , controller:'ctrl-usr-intention' }}});
  $urlRouterProvider.otherwise('/start');
})
.run(function(){
})
.controller('ctrl-start', function($scope, $state, $http, $timeout, $interval, $ionicPopup, $ionicActionSheet, $ionicNavBarDelegate, $ionicPlatform, $ionicLoading, $ionicViewService, $rootScope){
  Yibeiban.intoMyController($scope, $state);
  var guideByUser = function(user){
    if(user.profile && user.profile.step == 1){
      $state.go('menus.job-main');
    }else{
      $state.go('reg-1');
    }
  };

  if(ybb_user){return guideByUser(ybb_user);}

  $ionicViewService.nextViewOptions({disableBack:true});

  $ionicPlatform.ready(function(){
    window.cordova && window.cordova.plugins.Keyboard && window.cordova.plugins.Keyboard.disableScroll(true);
    window.StatusBar && window.StatusBar.overlaysWebView(true);//for ios
  });
  $ionicPlatform.registerBackButtonAction(function(){Yibeiban.backward();}, 100);

  Yibeiban.setMyIonicLoading($ionicLoading);
  Yibeiban.setMyHttp($http);
  Yibeiban.setMyTimeout($timeout);
  Yibeiban.setMyIonicNavBarDelegate($ionicNavBarDelegate);

  Yibeiban.LocCache.save('&register.time', Yibeiban.LocCache.load('&register.time') || Date.now());

  Yibeiban.sendGossip = function(gossip, callback){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    $ionicActionSheet.show({
      titleText : '分享',
      cancelText: '取消',
      buttons   : [{text: '分享到微信朋友圈'},{text: '分享给微信好友'}],
      cancel    : function(){Yibeiban.myLogger('CANCELLED');},
      buttonClicked : function(index){
        Yibeiban.myNotice('加载中...', 20000);
        Wechat.share({
          message: {
            description: index==0 ? '匿名信息，请点击查看详情...' : '',
            title:gossip.content,thumb:'',media: {type: Wechat.Type.WEBPAGE, webpageUrl: "http://yibeiban.com/gossip.php?id="+gossip.id_gossip}
          }, scene: index==0 ? 1:0
        }, function(){
          var params = {'id_gossip' : gossip.id_gossip};
          Yibeiban.ajaxPost('/gossip/share', params, function(data){
            gossip.share += 1;
            callback();
          });
          $ionicLoading.hide();
        }, function(reason) {
          $ionicLoading.hide();
        });
        return true;
      }
    });
  };
  Yibeiban.likeGossip = function(gossip, callback){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {'id_gossip' : gossip.id_gossip, 'ding_status' : gossip.ding_status ? 0 : 1};
    Yibeiban.ajaxPost('/gossip/ding', params, function(data){
      gossip.ding_status = gossip.ding_status ? 0 :  1;
      gossip.ding       +=(gossip.ding_status ? 1 : -1);
      callback();
    });
  };

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady(){
    var MySQLite = getSQLiteClass(window.sqlitePlugin.openDatabase("database.sqlite3"));
    Yibeiban.setMySQLite(MySQLite);
    MySQLite.findRecords('user_profile', '', function(res){
      var profile = res.rows.length && res.rows.item(0);
      if(!profile || !profile.id_ybb){
        return $ionicPopup.alert({title:'授权错误'});
      }

      ybb_user = Yibeiban.LocCache.load('User');
      if(ybb_user){return guideByUser(ybb_user);}

      var fields = ['id_ybb','secret','gender','work_year','edu_level','current_salary','expected_salary','step','id_member','first_name','company','current_position','school','avatar','fake_name','city','job_requirement','industry_1','industry_2','device_type','device_code', 'contacts'];
      var params = {'id_ybb':profile.id_ybb,'secret':profile.secret,'params':fields};
      Yibeiban.myRemote('/user/profile/view', params, function(data){
        ybb_user = {};
        ybb_user.profile = MySQLite.createRow('user_profile', data.result);
        ybb_user.contacts = [];
        data.result.contacts.sort(function(a,b){return a.contact_type > b.contact_type ? 1:-1;});
        for(i in data.result.contacts){ybb_user.contacts.push(MySQLite.createRow('user_contact', data.result.contacts[i]));}
        var params = {'id_ybb':profile.id_ybb,'secret':profile.secret};
        Yibeiban.myRemote('/user/privacy/view', params, function(data){
          ybb_user.privacy = MySQLite.createRow('user_privacy', data.result);
          Yibeiban.LocCache.save('User', ybb_user);
          if(ybb_user){return guideByUser(ybb_user);}
        });
      });
    });
  }
})
.controller('ctrl-menus', function($scope, $state){
  Yibeiban.intoMyController($scope, $state);
  Yibeiban.setMenusScope($scope);
  Yibeiban.updateUnread();
  $scope.job = function(){Yibeiban.MemCache.save('job-main', false);$state.go('menus.job-main');};
  $scope.say = function(){Yibeiban.MemCache.save('say-list', false);$state.go('menus.say-list');};
  $scope.msg = function(){Yibeiban.MemCache.save('msg-list', false);$state.go('menus.msg-list');};
  $scope.usr = function(){$state.go('menus.usr-main');};
})
.controller('ctrl-reg-1', function($scope, $state, $ionicLoading, $ionicViewService){
  Yibeiban.intoMyController($scope, $state);
  Yibeiban.setBackManner('back');
  
  $scope.ybb_user = ybb_user;
  $scope.contact  = ybb_user.contacts[0];

  $scope.types = {'contact':'text'};
  $scope.setContactType = function(){
    switch(1*$scope.contact.contact_type){
      case  1:
      case  3:$scope.types.contact = 'tel'  ;break;
      case  2:$scope.types.contact = 'text' ;break;
      case  6:
      default:$scope.types.contact = 'email';break;
    }
  };
  $scope.setContactType();

  $scope.next = function(){
    var required = ['first_name','gender','school','edu_level'];
    if(ybb_user.profile.work_year>0){
      required = required.concat(['company','current_position']);
      if(ybb_user.profile.company.toString().match(/^(无|没|没有)$/)         ){return Yibeiban.myNotice('有工作经验时，请正确填写公司和职位信息...');}
      if(ybb_user.profile.current_position.toString().match(/^(无|没|没有)$/)){return Yibeiban.myNotice('有工作经验时，请正确填写公司和职位信息...');}
    }
    for(i in required){if(ybb_user.profile[required[i]]==''){return Yibeiban.myNotice('尚有内容未填写...');}}

    if($scope.contact.contact==''){return Yibeiban.myNotice('尚有内容未填写...');}
    if($scope.contact.contact_type==1 && !Patterns[1].test($scope.contact.contact)){return Yibeiban.myNotice('您输入的手机号码不正确...');}
    if($scope.contact.contact_type==6 && !Patterns[6].test($scope.contact.contact)){return Yibeiban.myNotice('您输入的邮箱格式不正确...');}
    if($scope.contact.contact_type==3 && !Patterns[3].test($scope.contact.contact)){return Yibeiban.myNotice('您输入的QQ不正确...')     ;}

    ybb_user.contacts = [$scope.contact];

    Yibeiban.LocCache.save('User', ybb_user);
    Yibeiban.MemCache.save('User', ybb_user);

    $state.go('reg-2');
  };

  $scope.position_notice_check = function(){
    if(ybb_user.profile.current_position.toString().match(/ac|hr|researcher|猎头|人事|招聘|人力资源|寻访/i)){
      $scope.position_notice_style = 'background:#eeeeee;text-align:center;padding:10px 0px;color:#A00;';
      $scope.position_notice_words = '本APP仅面向求职者，如果您想招聘，<br/>请在PC上访问：望才招聘 matchcv.com';
      $scope.position_notice_click = function(){window.open('http://matchcv.com', '_system');}
      return;
    }
    if(ybb_user.profile.current_position.toString().match(/工程师|程序员|码农|开发|研发/i)){
      $scope.position_notice_style = 'background:#eeeeee;text-align:center;padding:10px 0px;color:#0A0;';
      $scope.position_notice_words = '如果您是IT工程师，建议注明开发语言或<br/>开发方向，如"php工程师"或"前端工程师"';
      $scope.position_notice_click = function(){return false;}
      return;
    }
    if(1){
      $scope.position_notice_style = 'height:15px;background:#eeeeee';
      $scope.position_notice_words = '&nbsp;';
      $scope.position_notice_click = function(){return false;}
      return;
    }
  }

  $scope.position_notice_check();
})
.controller('ctrl-reg-2', function($scope, $state, $ionicLoading, $ionicViewService){
  Yibeiban.intoMyController($scope, $state);
  Yibeiban.setBackManner('back');

  $scope.ybb_user = ybb_user;

  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    if(''==ybb_user.profile.city){return Yibeiban.myNotice('尚有内容未填写...');}
    if(''==ybb_user.profile.current_salary){return Yibeiban.myNotice('尚有内容未填写...');}
    if(!ybb_user.profile.current_salary.toString().match(/^[0-9]+$/) || ybb_user.profile.current_salary<2000 || ybb_user.profile.current_salary > 500000){return Yibeiban.myNotice('有效薪资范围：2000-500000');}

    $ionicLoading.show({template: '保存中...'});
    ybb_user.profile.job_requirement = JSON.stringify($scope.job_requirement);
    
    var params = {
      'gender'          : ybb_user.profile.gender          ,
      'work_year'       : ybb_user.profile.work_year       ,
      'first_name'      : ybb_user.profile.first_name      ,
      'company'         : ybb_user.profile.company         ,
      'current_position': ybb_user.profile.current_position,
      'school'          : ybb_user.profile.school          ,
      'edu_level'       : ybb_user.profile.edu_level       , 
      'city'            : ybb_user.profile.city            ,
      'current_salary'  : ybb_user.profile.current_salary  ,
      'expected_salary' : ybb_user.profile.expected_salary ,
      'job_requirement' : ybb_user.profile.job_requirement ,
      'contacts'        : ybb_user.contacts
    };
    Yibeiban.ajaxPost('/user/profile/save', params, function(data){
      ybb_user.profile.step = 1;
      Yibeiban.ajaxPost('/user/profile/view', ['fake_name','industry_1','industry_2'], function(data){
        ybb_user.profile.fake_name  = data.result.fake_name;
        ybb_user.profile.industry_1 = data.result.industry_1;
        ybb_user.profile.industry_2 = data.result.industry_2;
        ybb_user.privacy.shield_company = ybb_user.profile.company;
        Yibeiban.LocCache.save('User', ybb_user);
        Yibeiban.MemCache.save('User', ybb_user);
        $ionicLoading.hide();
        $state.go('reg-3');
      });
    });
  };
  
  ybb_user.profile.current_salary = ybb_user.profile.current_salary || '';

  try{$scope.job_requirement = JSON.parse(ybb_user.profile.job_requirement);}catch(e){}
  $scope.job_requirement = $scope.job_requirement || [0,0,0,0,0,0,0,0,0];
  $scope.display = {job_requirement:false};
  $scope.select = function(i){$scope.job_requirement[i] = $scope.job_requirement[i] ? 0 : 1;};
  $scope.toggle = function( ){$scope.display.job_requirement = !$scope.display.job_requirement;};
})
.controller('ctrl-reg-3', function($ionicViewService){
  $ionicViewService.nextViewOptions({disableBack:true});
})
.controller('ctrl-job-main' , function($scope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup){
  Yibeiban.intoMyController($scope, $state);
  Yibeiban.setBackManner('exit');
  $scope.$root.tabsHidden = "tabs-show";

  $scope.find = function(keywords, location, industry, salary_min, salary_max){
    var params = {'keywords' : keywords || '', 'location' : location || '', 'industry' : industry || ybb_user.profile.industry_1, 'salary_min' : salary_min || 0, 'salary_max' : salary_max || 0};
    Yibeiban.MemCache.save('job-find', false);
    $state.go('menus.job-find', params);
  };

  $scope.list = function(){
    Yibeiban.MemCache.save('job-list', false);
    $state.go('menus.job-list');
  };

  $scope.companys   = jobStart.company[  ybb_user.profile.industry_1];
  $scope.positions  = jobStart.position[ ybb_user.profile.industry_1]  || jobStart.position['others'];
  $scope.advice     = jobStart.advice[   ybb_user.profile.industry_1]  || jobStart.advice['others'];

  if(('ios'== myConfig.device)
  && (Yibeiban.LocCache.load('&register.time') < Date.now() - 60*60*24*1000)
  && (Yibeiban.LocCache.load('&remote:/job/advise')>0 || Yibeiban.LocCache.load('&remote:/job/search')>0)
  && !Yibeiban.LocCache.load('&notice.never')
  && (Yibeiban.LocCache.load('&box.number') > 1)
  ){
    Yibeiban.LocCache.save('&notice.never', 1);
    var myPopup = $ionicPopup.show({
      template: '<div style="width:100%;text-align:center;margin-bottom:30px;">大人，你觉得这个app怎么样？</div>',
      scope: $scope,
      buttons: [
        { text: '不再提示',
          onTap: function(e){}
        },
        {
          text: '<b>给个好评</b>',
          type: 'button-positive',
          onTap: function(e){window.open(myConfig.itunesUrl, '_system');}
        }
      ]
    });
  }
})
.controller('ctrl-job-find' , function($scope, $state, $ionicLoading, $timeout, $stateParams){
  Yibeiban.intoMyController($scope, $state);
  Yibeiban.setBackManner('back');
  $scope.$root.tabsHidden ="tabs-hide";

  var filter = {'keywords' : $stateParams.keywords, 'salary' : Math.floor($stateParams.salary_min/1000)+'-'+Math.floor($stateParams.salary_max/1000), 'industry' : $stateParams.industry || '', 'location' : $stateParams.location};
  $scope.config = Yibeiban.MemCache.load('job-find') || {errormsg:false,infinite:true,number:10,page:1,jobs:[],filter:filter};

  var load_page = function(callback){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {};
    var salary = $scope.config.filter.salary.split('-');
    params.keywords   = $scope.config.filter.keywords;
    params.industry   = $scope.config.filter.industry;
    params.location   = $scope.config.filter.location;
    params.salary_min = salary[0]*1000 || 0;
    params.salary_max = salary[1]*1000 || 0;
    params.number = $scope.config.number;
    params.page   = $scope.config.page  ;
    Yibeiban.ajaxPost('/job/search', params, function(data){
      $scope.config.page      = $scope.config.page + 1;
      $scope.config.jobs      = $scope.config.jobs.concat(data.result);
      $scope.config.errormsg  = !$scope.config.jobs.length;
      $scope.config.infinite  = data.result.length;
      $ionicLoading.hide();
      callback && callback();
      Yibeiban.MemCache.save('job-find', $scope.config);
    });
  };

  $scope.view = function(job){$state.go('menus.job-view', {'id_job' : job.id_job});};

  $scope.find = function(){
    $scope.config = {errormsg:false,infinite:true,number:10,page:1,jobs:[],filter:$scope.config.filter};
    $scope.infinite();
  };

  $scope.infinite = function(){
    load_page(function(){$scope.$broadcast('scroll.infiniteScrollComplete');});
  };
})
.controller('ctrl-job-list' , function($scope, $state, $ionicLoading, $timeout, $stateParams){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  $scope.config = Yibeiban.MemCache.load('job-list') || {errormsg:false,infinite:true,number:10,page:1,jobs:[]};

  var load_page = function(callback){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {};
    params.number = $scope.config.number;
    params.page   = $scope.config.page  ;
    Yibeiban.ajaxPost('/job/advise', params, function(data){
      $scope.config.page      = $scope.config.page + 1;
      $scope.config.jobs      = $scope.config.jobs.concat(data.result);
      $scope.config.errormsg  = !$scope.config.jobs.length;
      $scope.config.infinite  = data.result.length;
      $ionicLoading.hide();
      callback && callback();
      Yibeiban.MemCache.save('job-list', $scope.config);
      Yibeiban.LocCache.save('job-list', $scope.config);
    });
  };

  $scope.view = function(job){
    $state.go('menus.job-view', {'id_job' : job.id_job});
  };

  $scope.refresh = function(){
    $scope.config = {errormsg:false,infinite:true,number:10,page:1,jobs:[]};
    load_page(function(){
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.infinite = function(){
    load_page(function(){
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  
  if(!Yibeiban.isOnline()){
    $scope.config = Yibeiban.LocCache.load('job-list') || $scope.config;
    Yibeiban.MemCache.save('job-list', $scope.config);
  }
})
.controller('ctrl-job-view' , function($scope, $state, $ionicLoading, $timeout, $stateParams){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  var job = Yibeiban.MemCache.load('job'+'?'+$stateParams.id_job);

  $scope.config = {job:job};

  var load_item = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    $ionicLoading.show({template:'加载中...'});
    Yibeiban.ajaxPost('/job/detail', {'id_job' : $stateParams.id_job}, function(data){
      $scope.config.job = job = data.result;
      $ionicLoading.hide();
      Yibeiban.MemCache.save('job'+'?'+$stateParams.id_job, job);
      Yibeiban.LocCache.save('job'+'?'+$stateParams.id_job, job);
    });
  };

  $scope.apply  = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {'id_job' : job.id_job, 'apply_status' : job.apply_status ? 0 : 1};
    Yibeiban.ajaxPost('/job/apply', params, function(data){
      job.apply_status = job.apply_status ? 0 : 1;
      Yibeiban.MemCache.save('job'+'?'+$stateParams.id_job, job);
      Yibeiban.LocCache.save('job'+'?'+$stateParams.id_job, job);
      return Yibeiban.myNotice('操作成功...');
    });
  };

  if(!job){
    if(!Yibeiban.isOnline()){
      $scope.config.job = job = Yibeiban.LocCache.load('job'+'?'+$stateParams.id_job);
      Yibeiban.MemCache.save('job'+'?'+$stateParams.id_job, job);
    }else{
      load_item();
    }
  }
})
.controller('ctrl-say-list' , function($scope, $state, $ionicLoading, $timeout, $stateParams, $ionicScrollDelegate){
  Yibeiban.intoMyController($scope, $state);
  Yibeiban.setBackManner('wait');
  $scope.$root.tabsHidden = "tabs-show";

  $scope.opacity = 100;

  var filter = {'keywords' : $stateParams.keywords || ''};
  $scope.config = Yibeiban.MemCache.load('say-list') || {errormsg:false,infinite:true,number:10,page:1,filter:filter,gossips:[]};

  var saveCache = function(){
    Yibeiban.MemCache.save('say-list', $scope.config);
    if(!$scope.config.filter.keywords){Yibeiban.LocCache.save('say-list', $scope.config);}
  };

  var load_page = function(callback){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {'number':$scope.config.number,'page':$scope.config.page,'keywords':$scope.config.filter.keywords};
    Yibeiban.ajaxPost('/gossip/search', params, function(data){
      $scope.config.page      = $scope.config.page + 1;
      $scope.config.gossips   = $scope.config.gossips.concat(data.result);
      $scope.config.errormsg  = !$scope.config.gossips.length;
      $scope.config.infinite  = data.result.length;
      $ionicLoading.hide();
      callback && callback();
      saveCache();
    });
  };

  $scope.send = function(gossip){Yibeiban.sendGossip(gossip, function(){saveCache();});};
  $scope.like = function(gossip){Yibeiban.likeGossip(gossip, function(){saveCache();});};

  $scope.view = function(gossip){
    Yibeiban.MemCache.save('gossip'+'?'+gossip.id_gossip, gossip);
    $state.go('menus.say-view', {'id_gossip' : gossip.id_gossip});
  };

  $scope.post = function(){
    $state.go('menus.say-post');
  };

  $scope.find = function(){
    $scope.config = {errormsg:false,infinite:true,number:10,page:1,filter:$scope.config.filter,gossips:[]};
    $scope.infinite();
  };

  $scope.infinite = function(){
    load_page(function(){$scope.$broadcast('scroll.infiniteScrollComplete');});
  };

  if($stateParams.top){
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0);
  }
  
  //$timeout(function(){$scope.opacity = 100;}, 1000);

  if(!Yibeiban.isOnline()){
    $scope.config = Yibeiban.LocCache.load('say-list') || $scope.config;
    Yibeiban.MemCache.save('say-list', $scope.config);
  }
})
.controller('ctrl-say-view' , function($scope, $state, $ionicLoading, $timeout, $stateParams, $ionicScrollDelegate){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  var saveCacheGossip = function(){
    Yibeiban.MemCache.save('gossip'+'?'+$stateParams.id_gossip, gossip);
    Yibeiban.LocCache.save('gossip'+'?'+$stateParams.id_gossip, gossip);
  };

  $scope.send = function(gossip){Yibeiban.sendGossip(gossip, function(){saveCacheGossip();});};
  $scope.like = function(gossip){Yibeiban.likeGossip(gossip, function(){saveCacheGossip();});};

  var gossip    = Yibeiban.MemCache.load('gossip'+'?'+$stateParams.id_gossip);
  if(!gossip){
    Yibeiban.myNotice('参数错误');
    return $state.go('menus.job-main');
  }

  $scope.config = {infinite:true,gossip:gossip,comments:Yibeiban.MemCache.load('comments'+'?'+$stateParams.id_gossip) || []};

  var load_comment = function(direction, callback){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {'number' : 20, 'id_gossip' : gossip.id_gossip};
    if($scope.config.comments.length>0){
      if('<'==direction){
        params.id_lt = 1*$scope.config.comments[0].id_comment;
      }else{
        params.id_gt = 1*$scope.config.comments[$scope.config.comments.length-1].id_comment;
      }
    }
    Yibeiban.ajaxPost('/gossip/comment/list', params, function(data){
      if('<'==direction){
        $scope.config.refresh   = data.result.length;
      }else{
        $scope.config.infinite  = data.result.length;
      }
      $scope.config.comments = $scope.config.comments.concat(data.result);
      $scope.config.comments.sort(function(a,b){return a.id_comment*1 > b.id_comment*1 ? 1 : -1;});
      gossip.comment = gossip.comment > $scope.config.comments.length ? gossip.comment : $scope.config.comments.length;
      callback && callback();
      Yibeiban.MemCache.save('comments'+'?'+$stateParams.id_gossip, $scope.config.comments);
      Yibeiban.LocCache.save('comments'+'?'+$stateParams.id_gossip, $scope.config.comments);
    });
  };

  $scope.infinite = function(){
    load_comment('>', function(){$scope.$broadcast('scroll.infiniteScrollComplete');});
  };

  $scope.focus = function(){$timeout(function(){document.getElementById('input_comment').focus();}, 100);return false;};

  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    if(!$scope.input.comment){
      return Yibeiban.myNotice('您还没有写任何评论...');
    }
    var params = {'id_gossip' : gossip.id_gossip, 'comment' : $scope.input.comment};
    Yibeiban.ajaxPost('/gossip/comment/save', params, function(data){
      $scope.input.comment = '';
      load_comment('>', function(){$scope.$broadcast('scroll.infiniteScrollComplete');});
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(false);
      gossip.comment = gossip.comment*1 + 1;
      saveCacheGossip();
    });
  };

  if(!Yibeiban.isOnline()){
    $scope.config.comments = Yibeiban.LocCache.load('comments'+'?'+$stateParams.id_gossip) || $scope.config.comments;
    Yibeiban.MemCache.save('comments'+'?'+$stateParams.id_gossip, $scope.config.comments);
  }
})
.controller('ctrl-say-post' , function($scope, $state, $ionicLoading, $timeout, $stateParams, $ionicScrollDelegate){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  $scope.input = {'gossip':''};
  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var gossip = $scope.input.gossip;
    if(!gossip){
      return Yibeiban.myNotice('您还没有写任何八卦...');
    }
    if(gossip.length>300){
      return Yibeiban.myNotice('您输入的八卦超过了300字，请精简...');
    }
    Yibeiban.ajaxPost('/gossip/save', {'content' : gossip}, function(data){
      var config = Yibeiban.MemCache.load('say-list');
      if(config && config.gossips){
        config.gossips.unshift(data.result);
        Yibeiban.MemCache.save('say-list', config);
      }
      $state.go('menus.say-list', {'top':1});
    });
  };
})
.controller('ctrl-msg-list' , function($scope, $state, $ionicLoading, $timeout, $stateParams, $ionicScrollDelegate){
  Yibeiban.intoMyController($scope, $state);
  Yibeiban.setBackManner('wait');
  Yibeiban.updateUnread();
  $scope.$root.tabsHidden = "tabs-show";

  $scope.config = Yibeiban.MemCache.load('msg-list') || {errormsg:false,infinite:true,boxes:[]};

  var load_boxes = function(direction, callback){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {'number' : 20};
    if($scope.config.boxes.length>0){
      if('<'==direction){
        params.time_lt = $scope.config.boxes[$scope.config.boxes.length-1].update_time;
      }else{
        params.time_gt = $scope.config.boxes[0].update_time;
      }
    }
    Yibeiban.ajaxPost('/message/list', params, function(data){
      if('>'==direction){
        $scope.config.refresh   = data.result.length;
      }else{
        $scope.config.infinite  = data.result.length;
      }

      var boxes = $scope.config.boxes;
      for(i=0;i<data.result.length;i++){
        var box = data.result[i];
        box.latest_msg = box.latest_msg.replace(/<[^>]+>/g,'').replace(/</g,'&lt;').replace(/>/g,'&gt;').substr(0,12)+'...';
        box.updatetime = box.update_time.substr(5,11).split(' ');
        boxes.push(box);
      }
      boxes.sort(function(a,b){return a.update_time < b.update_time ? 1 : -1;});
      var box_pool = {};
      $scope.config.boxes = [];
      for(i in boxes){
        if(box_pool[boxes[i].id_box]){continue;}
        box_pool[boxes[i].id_box] = 1;
        $scope.config.boxes.push(boxes[i]);
      }
      $scope.config.errormsg = !$scope.config.boxes.length;
      Yibeiban.LocCache.save('&box.number', $scope.config.boxes.length);
      callback && callback();
      Yibeiban.MemCache.save('msg-list', $scope.config);
      Yibeiban.LocCache.save('msg-list', $scope.config);
    });
  };

  $scope.view = function(box){
    box.unread_number = 0;
    Yibeiban.MemCache.save('msg-list', $scope.config);
    Yibeiban.LocCache.save('msg-list', $scope.config);
    Yibeiban.MemCache.save('box'+'?'+box.id_box     , box);
    Yibeiban.MemCache.save('messages'+'?'+box.id_box, false);
    Yibeiban.MemCache.save('msg-view-scrollTop'     , false);
    $state.go('menus.msg-view', {'id_box' : box.id_box});
  };

  $scope.refresh  = function(){load_boxes('>', function(){$scope.$broadcast('scroll.resize');$scope.$broadcast('scroll.refreshComplete');});};
  $scope.infinite = function(){load_boxes('<', function(){$scope.$broadcast('scroll.infiniteScrollComplete');});};
  $scope.onmessage = function(json){
    if(1==json.type){
      Yibeiban.insertUnread();
      $scope.refresh();
    }
  }

  if(!Yibeiban.isOnline()){
    $scope.config = Yibeiban.LocCache.load('msg-list') || $scope.config;
    Yibeiban.MemCache.save('msg-list', $scope.config);
    return Yibeiban.myNotice('暂无网络连接...');
  }
})
.controller('ctrl-msg-view' , function($scope, $state, $ionicLoading, $timeout, $stateParams, $ionicScrollDelegate){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  var box = Yibeiban.MemCache.load('box'+'?'+$stateParams.id_box);
  if(!box){
    Yibeiban.myNotice('参数错误');
    return $state.go('menus.job-main');
  }

  $scope.config = {refresh:true,infinite:false,box:box,avatar:ybb_user.profile.avatar,title:'和'+box.participant_name.replace(/\(.+\)/,'')+'的对话',messages:Yibeiban.MemCache.load('messages'+'?'+$stateParams.id_box) || []};

  var load_message = function(direction, callback){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {'number' : 10, 'id_box' : box.id_box};
    if($scope.config.messages.length>0){
      if('<'==direction){
        params.id_lt = $scope.config.messages[0].id;
      }else{
        params.id_gt = $scope.config.messages[$scope.config.messages.length-1].id;
      }
    }
    Yibeiban.ajaxPost('/message/view', params, function(data){
      $scope.config.messages = $scope.config.messages.concat(data.result);
      $scope.config.messages.sort(function(a,b){return a.id*1 > b.id*1 ? 1 : -1;});

      var len_title   = 5;
      var len_company = 12;
      var regexp = new RegExp(/([a-z]+:\/\/)?((([a-z0-9_\-]+\.)+[a-z]{2,6})|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[^ ]*)?/gi);

      for(i in $scope.config.messages){
        var message = $scope.config.messages[i];
        if(!message.html&&message.msg){
          message.html = message.msg.replace(/<[^>]+>/g,'').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(regexp, '<span class="link" ng-click="jump_url(\'$&\')">$&</span>')
            .replace(/jump_url\(\'(?![a-z]+:\/\/)/gi, "jump_url('http://");
        }
        if(message.data){
          if(1==message.data.type){
            if(!message.data.job.title_abbr){
              message.data.job.title_abbr = message.data.job.title.substring(0,len_title) + (message.data.job.title.length > len_title ? '...' : '');
            }
            if(!message.data.job.company_abbr){
              message.data.job.company_abbr = message.data.job.company.substring(0,len_company) + (message.data.job.company.length > len_company ? '...' : '');
            }
          }
        }
      }
      callback && callback();
      Yibeiban.MemCache.save('messages'+'?'+$stateParams.id_box, $scope.config.messages);
      Yibeiban.LocCache.save('messages'+'?'+$stateParams.id_box, $scope.config.messages);
    });
  };

  var init_scroll = function(){
    var scrollTop = Yibeiban.MemCache.load('msg-view-scrollTop');
    if(scrollTop){
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, scrollTop);
    }else{
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(false);
    }
  }

  if(!$scope.config.messages.length){
    load_message('>', function(){init_scroll();});
  }else{
    $timeout(function(){init_scroll();}, 100);
  }

  $scope.jumpto   = function(href){window.open(href, '_system');return false;};
  $scope.refresh  = function(){load_message('<', function(){$scope.$broadcast('scroll.resize');$scope.$broadcast('scroll.refreshComplete');});};
  $scope.infinite = function(){load_message('>', function(){$scope.$broadcast('scroll.infiniteScrollComplete');});};
  $scope.onmessage = function(json){
    if(1==json.type){
      if(box.id_participant == json.id_hunter){
        load_message('>', function(){init_scroll();});
      }else{
        Yibeiban.insertUnread();
      }
    }
  }

  $scope.input = {};
  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    if(!$scope.input.message){
      return false;
    }
    var params = {'id_participant' : box.id_participant, 'participant_type': box.participant_type, 'msg' : $scope.input.message};
    Yibeiban.ajaxPost('/message/send', params, function(data){
      $scope.input.message = '';
      load_message('>', function(){$ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(false);});
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(false);
    });
  };

  $scope.view = function(){
    Yibeiban.MemCache.save('msg-view-scrollTop', $ionicScrollDelegate.getScrollPosition().top);
    $state.go('menus.msg-info', {'id_box' : box.id_box});
  };

  $scope.jump_url = function(url){
    window.open(url, '_system');
    return false;
  }

  $scope.view_job = function(id_job){
    Yibeiban.MemCache.save('msg-view-scrollTop', $ionicScrollDelegate.getScrollPosition().top);
    $state.go('menus.msg-jobs', {'id_job' : id_job});
    return false;
  };

  if(!Yibeiban.isOnline()){
    $scope.config.messages = Yibeiban.LocCache.load('messages'+'?'+$stateParams.id_box) || $scope.config.messages;
    Yibeiban.MemCache.save('messages'+'?'+$stateParams.id_box, $scope.config.messages);
  }
})
.controller('ctrl-msg-info' , function($scope, $state, $ionicLoading, $timeout, $stateParams, $ionicScrollDelegate){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  var box = Yibeiban.MemCache.load('box'+'?'+$stateParams.id_box);
  if(!box){
    Yibeiban.myNotice('参数错误');
    return $state.go('menus.job-main');
  }
  $scope.config = Yibeiban.MemCache.load('msg-info'+'?'+box.id_box) || {hunter:null,jobs:[]};

  $scope.view = function(job){$state.go('menus.job-view', {'id_job' : job.id_job});};
  $scope.chat = function(   ){$state.go('menus.msg-view', {'id_box' : box.id_box});};

  if(!Yibeiban.isOnline()){
    $scope.config = Yibeiban.LocCache.load('msg-info'+'?'+box.id_box) || $scope.config;
    Yibeiban.MemCache.save('msg-info'+'?'+box.id_box, $scope.config);
  }else{
    Yibeiban.ajaxPost('/hunter/profile/view', {'id_hunter' : box.id_participant}, function(data){
      $scope.config.hunter  = data.result;
      Yibeiban.MemCache.save('msg-info'+'?'+box.id_box, $scope.config);
      Yibeiban.LocCache.save('msg-info'+'?'+box.id_box, $scope.config);
    });
    Yibeiban.ajaxPost('/hunter/job/list', {'id_hunter' : box.id_participant, 'number' : 20, 'page' : 1}, function(data){
      $scope.config.jobs = data.result;
      Yibeiban.MemCache.save('msg-info'+'?'+box.id_box, $scope.config);
      Yibeiban.LocCache.save('msg-info'+'?'+box.id_box, $scope.config);
    });
  }
})
.controller('ctrl-usr-main' , function($scope, $state, $ionicActionSheet, Camera){
  Yibeiban.intoMyController($scope, $state);
  Yibeiban.setBackManner('wait');
  $scope.$root.tabsHidden = "tabs-show";

  $scope.ybb_user = ybb_user;

  try{var job_requirement = JSON.parse(ybb_user.profile.job_requirement);}catch(e){}
  if(job_requirement){
    var tags = [];
    for(i in job_requirement){job_requirement[i] && tags.push(myConfig.job_requirement[i]);}
    $scope.job_requirement = tags.join(' ');
  }
  $scope.job_requirement = $scope.job_requirement || '无';

  /*Photo*/
  function onPhotoDone(imageURI){uploadPhoto(imageURI);}
  function onPhotoFail(message){Yibeiban.myLogger('Photo Failed: ' + message);}
  function makePhoto(){
    navigator.camera.getPicture(onPhotoDone, onPhotoFail, { quality: 100, targetWidth: 150, targetHeight: 150, destinationType: navigator.camera.DestinationType.FILE_URI
    });
  }
  function takePhoto(){
    navigator.camera.getPicture(onPhotoDone, onPhotoFail, { quality: 100, targetWidth: 150, targetHeight: 150, destinationType: navigator.camera.DestinationType.FILE_URI
    ,sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM });
  }
  function uploadPhoto(imageURI){
    var done = function(r){
      try{var json = JSON.parse(r.response);}catch(e){}
      ybb_user.profile.avatar = json.avatar_src;
      Yibeiban.LocCache.save('User', ybb_user);
      $scope.$apply(function(){$scope.ybb_user.profile.avatar = ybb_user.profile.avatar + '?v=' + Math.random();});
    };

    var fail = function(e){
    };

    var options = new FileUploadOptions();
    options.params  = {'id_ybb' : ybb_user.profile.id_ybb, 'secret' : ybb_user.profile.secret};
    options.fileKey ="avatar";
    options.fileName="avatar.jpg";
    options.mimeType="image/jpeg";

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://api.yibeiban.com:8888/user/avatar/upload"), done, fail, options);
  }

  $scope.showActionsheet = function(){
    $ionicActionSheet.show({
      titleText : '更换头像',
      cancelText: '取消',
      buttons   : [{text:'拍照'},{text:'从相册中选取'}],
      cancel    : function(){Yibeiban.myLogger('CANCELLED');},
      buttonClicked : function(index){
        switch(index){
          case  1:takePhoto();break;
          case  0:
          default:makePhoto();break;
        }
        return true;
      }
    });
  };
  /*Photo*/

  $scope.menu = function(){$state.go('menus.usr-settings');}
})
.controller('ctrl-usr-contact'  , function($scope, $state){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  $scope.contacts = [];
  for(i in ybb_user.contacts){
    if(ybb_user.contacts[i].contact){
      $scope.contacts[ybb_user.contacts[i].contact_type] = ybb_user.contacts[i].contact;
    }
  }

  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    if($scope.contacts[1] && !Patterns[1].test($scope.contacts[1])){return Yibeiban.myNotice('您输入的手机号码不正确...');}
    if($scope.contacts[3] && !Patterns[3].test($scope.contacts[3])){return Yibeiban.myNotice('您输入的QQ不正确...'      );}
    if($scope.contacts[6] && !Patterns[6].test($scope.contacts[6])){return Yibeiban.myNotice('您输入的邮箱格式不正确...');}
    var contacts = [];
    for(i in $scope.contacts){
      var contact = $scope.contacts[i];
      if(contact){contacts.push(Yibeiban.getMySQLite().createRow('user_contact', {'contact_type': i, 'contact' : contact}));}
    }
    if(!contacts.length){
      return Yibeiban.myNotice('请至少保留一个联系方式');
    }
    var params = {'contacts' : contacts};
    Yibeiban.ajaxPost('/user/profile/save', params, function(data){
      ybb_user.contacts = contacts;
      Yibeiban.LocCache.save('User', ybb_user);
      $scope.back();
    });
  };
})
.controller('ctrl-usr-career'   , function($scope, $state){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  $scope.ybb_user = JSON.parse(JSON.stringify(ybb_user));
  $scope.update_shield_company = true;

  $scope.resetIndustry2 = function(){$scope.ybb_user.profile.industry_2='';};

  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var required = ['first_name','gender'];
    if($scope.ybb_user.profile.work_year>0){
      required = required.concat(['company','current_position']);
      if($scope.ybb_user.profile.company.toString().match(/^(无|没|没有)$/)         ){return Yibeiban.myNotice('有工作经验时，请正确填写公司和职位信息...');}
      if($scope.ybb_user.profile.current_position.toString().match(/^(无|没|没有)$/)){return Yibeiban.myNotice('有工作经验时，请正确填写公司和职位信息...');}
    }
    for(i in required){if($scope.ybb_user.profile[required[i]]==''){return Yibeiban.myNotice('尚有内容未填写...');}}

    var params = {
      'work_year'             : $scope.ybb_user.profile.work_year       ,
      'company'               : $scope.ybb_user.profile.company         ,
      'gender'                : $scope.ybb_user.profile.gender          ,
      'industry_1'            : $scope.ybb_user.profile.industry_1      ,
      'industry_2'            : $scope.ybb_user.profile.industry_2      ,
      'first_name'            : $scope.ybb_user.profile.first_name      ,
      'current_position'      : $scope.ybb_user.profile.current_position,
      'update_shield_company' : $scope.update_shield_company ? 1:0
    };
    Yibeiban.ajaxPost('/user/profile/save', params, function(data){
      ybb_user = JSON.parse(JSON.stringify($scope.ybb_user));
      if($scope.update_shield_company){ybb_user.privacy.shield_company = ybb_user.profile.company;}
      Yibeiban.LocCache.save('User', ybb_user);
      $scope.back();
    });
  };
})
.controller('ctrl-usr-education', function($scope, $state){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  $scope.ybb_user = JSON.parse(JSON.stringify(ybb_user));
  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var params = {
      'edu_level' : $scope.ybb_user.profile.edu_level ,
      'school'    : $scope.ybb_user.profile.school         
    };
    Yibeiban.ajaxPost('/user/profile/save', params, function(data){
      ybb_user = JSON.parse(JSON.stringify($scope.ybb_user));
      Yibeiban.LocCache.save('User', ybb_user);
      $scope.back();
    });
  };
})
.controller('ctrl-usr-intention', function($scope, $state){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  $scope.ybb_user = JSON.parse(JSON.stringify(ybb_user));
  $scope.ybb_user.profile.current_salary = $scope.ybb_user.profile.current_salary || '';

  try{$scope.job_requirement = JSON.parse($scope.ybb_user.profile.job_requirement);}catch(e){}
  $scope.job_requirement = $scope.job_requirement || [0,0,0,0,0,0,0,0,0];
  $scope.display = {job_requirement:true};
  $scope.select = function(i){$scope.job_requirement[i] = $scope.job_requirement[i] ? 0 : 1;};
  $scope.toggle = function( ){$scope.display.job_requirement = !$scope.display.job_requirement;};

  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    if(''==$scope.ybb_user.profile.city){return Yibeiban.myNotice('尚有内容未填写...');}
    if(''==$scope.ybb_user.profile.current_salary){return Yibeiban.myNotice('尚有内容未填写...');}
    if(!$scope.ybb_user.profile.current_salary.toString().match(/^[0-9]+$/) || $scope.ybb_user.profile.current_salary<2000 || $scope.ybb_user.profile.current_salary > 500000){return Yibeiban.myNotice('有效薪资范围：2000-500000');}

    $scope.ybb_user.profile.job_requirement = JSON.stringify($scope.job_requirement);

    var params = {
      'city'            : $scope.ybb_user.profile.city           ,
      'current_salary'  : $scope.ybb_user.profile.current_salary ,
      'expected_salary' : $scope.ybb_user.profile.expected_salary,
      'job_requirement' : $scope.ybb_user.profile.job_requirement
    };
    Yibeiban.ajaxPost('/user/profile/save', params, function(data){
      ybb_user = JSON.parse(JSON.stringify($scope.ybb_user));
      Yibeiban.LocCache.save('User', ybb_user);
      $scope.back();
    });
  };
})
.controller('ctrl-usr-privacy'  , function($scope, $state){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";
  
  $scope.ybb_user = JSON.parse(JSON.stringify(ybb_user));

  $scope.setall = function(){
    var fields =['phone', 'weixin', 'qq', 'email'];
    for(i in fields){$scope.ybb_user.privacy['shield_'+fields[i]] = $scope.ybb_user.privacy.shield_profile;}
  };

  $scope.save = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    var fields =['profile', 'phone', 'weixin', 'qq', 'email'];
    for(i in fields){$scope.ybb_user.privacy['shield_'+fields[i]] = $scope.ybb_user.privacy['shield_'+fields[i]] ? 1 : 0;}

    var params = $scope.ybb_user.privacy;
    Yibeiban.ajaxPost('/user/privacy/save', params, function(data){
      ybb_user = JSON.parse(JSON.stringify($scope.ybb_user));
      Yibeiban.LocCache.save('User', ybb_user);
      $scope.back();
    });
  };
})
.controller('ctrl-usr-settings' , function($scope, $state, $ionicPopup){
  Yibeiban.setBackManner('back');
  Yibeiban.intoMyController($scope, $state);
  $scope.$root.tabsHidden ="tabs-hide";

  $scope.ybb_user = ybb_user;

  $scope.changeName = function(){
    if(!Yibeiban.isOnline()){
      return Yibeiban.myNotice('暂无网络连接...');
    }
    Yibeiban.ajaxPost('/user/change/fakename', {'gender' : ybb_user.profile.gender}, function(data){
      ybb_user.profile.fake_name = data.result.fake_name;
      Yibeiban.LocCache.save('User', ybb_user);
    });
  };

  $scope.itunes = function(){window.open(myConfig.itunesUrl, '_system');return false;}

  $scope.logout = function(){
    Yibeiban.MemCache.clear();
    Yibeiban.LocCache.clear();
    myJSInterface.logout();
  };

  $scope.ios_logout = function(){
    var MySQLite = Yibeiban.getMySQLite();
    MySQLite.dropRecords('badge', '', function(){
      MySQLite.dropRecords('cache', '', function(){
        MySQLite.dropRecords('user_token'   , '', function(){
          MySQLite.dropRecords('user_profile' , '', function(){
            MySQLite.dropRecords('user_privacy' , '', function(){
              MySQLite.dropRecords('user_contact' , '', function(){
                var myPopup = $ionicPopup.show({template: '<div class="col" style="text-align:right;font-size:18px;color:#777;"> 退出当前账号 <i class="ion-ios-arrow-right"></i></div>', buttons: []});
              });
            });
          });
        });
      });
    });
  };

  $scope.clear  = function(){
    Yibeiban.MemCache.clear();
    Yibeiban.LocCache.clear();
    Yibeiban.MemCache.save('User', ybb_user);
    Yibeiban.LocCache.save('User', ybb_user);
    Yibeiban.myNotice('清除成功');
    //Yibeiban.getMySQLite().dropRecords('cache', '', function(){});
  };
});