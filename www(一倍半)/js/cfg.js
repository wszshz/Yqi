var myConfig = {
  'itunesUrl'       : 'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=956458683&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8',
  'device'          : 'android',
  'gender'          : {1:'先生',2:'女士'},
  'expected_salary' : {0:'10%以下',10:'10%',20:'20%',30:'30%',40:'40%',50:'50%',51:'50%以上'},
  'contact_type'    : {1:'手机',2:'微信',3:'QQ',4:'微博',5:'LinkedIn',6:'Email'},
  'contact_icon'    : {1:'ion-android-call',2:'ion-chatbubbles',3:'ion-social-tux',4:'ion-social-vimeo',5:'ion-social-linkedin-outline',6:'ion-email'},
  'work_year'       : {0:'无工作经验',1:'1年',2:'2年',3:'3年',4:'4年',5:'5年',6:'6年',7:'7年',8:'8年',9:'9年',99:'10年及以上'},
  'edu_level'       : {1:'博士及以上',2:'硕士',3:'MBA/EMBA',4:'本科',5:'高中',6:'大专',7:'高中及以下',99:'其它'},
  'job_requirements': {'知名公司':'#button1','准上市公司':'#button2','创业公司':'#button3','福利好':'#button4','老板靠谱':'#button5','与牛人共事':'#button6','离家近':'#button7','加班少':'#button8','出差少':'#button9'},
  'job_requirement' : ['知名公司','准上市公司','创业公司','福利好','老板靠谱','与牛人共事','离家近','加班少','出差少'],
  'call_freq'       : {99:'不限',5:'5次每天',3:'3次每天',2:'2次每天',1:'1次每天',0:'不允许'},
  'search' : {
    'location'  : ['北京','上海','广州','深圳','天津','杭州','苏州','南京','成都','重庆','武汉','大连','厦门','无锡','宁波','珠海','佛山','东莞',
      '常州','温州','济南','青岛','福州','合肥','石家庄','南宁','哈尔滨','长春','沈阳','长沙','太原','西安','郑州','海口','三亚','昆明','贵阳',
      '兰州','银川','呼和浩特','西宁','南昌','乌鲁木齐','拉萨 ','香港','澳门'],
    'industry'  : ['IT行业','金融行业','医疗/卫生','建筑/房地产行业','消费品行业','专业服务','制造工业','教育培训行业','文化传媒行业','服务业','能源行业','贸易物流行业','其他'],
    'salary'    : {'0-0':'不限', '0-5':'5K以下', '5-10':'5 - 10K', '10-15':'10 - 15K', '15-20':'15 - 20K', '20-30':'20 - 30K', '30-50':'30 - 50K', '50-0':'50K 以上'}
  },
  'industry' : {
    'IT行业'          :['互联网','计算机软件','计算机硬件','电子商务','通信','游戏','IT服务','电子/半导体'],
    '金融行业'        :['投资','银行','证券/基金/期货','保险','金融行业'],
    '医疗/卫生'       :['医药','医疗/护理','医疗器械','生物技术','动物医疗','医疗/健康'],
    '建筑/房地产行业' :['房地产','建材','建筑设计/规划','土木工程','装修装潢','物业管理','商业地产','民用地产','工业地产','旅游地产'],
    '消费品行业'      :['日用品/化妆品','家电/数码产品','食品/饮料','办公用品','服装/纺织','奢侈品/珠宝','家具/家居','酒品','烟草业'],
    '专业服务'        :['管理咨询','会计/审计','翻译','法律','人力资源','检测/认证','公关'],
    '制造工业'        :['机械/自动化','原材料/加工','采矿/金属','汽车','化工','印刷/包装','造纸','航天/造船','新材料','军工/国防'],
    '教育培训行业'    :['培训','高等教育','初中等教育','成人教育'],
    '文化传媒行业'    :['影视','出版','广告/公关/会展','艺术/工艺','报纸/杂志','动漫','广播','体育','广告/会展','影视/媒体','出版/发行'],
    '服务业'          :['酒店','旅游','休闲/娱乐/健身','餐饮','私人/家政服务','图书馆/展览馆','服务业','美容/休闲/娱乐/健身','猎头/人才中介','百货/连锁'],
    '能源行业'        :['能源/原油'],
    '贸易物流行业'    :['批发/零售','进出口','物流/仓储','运输/铁路/航空','商店/超市'],
    '其他'            :['公共事业','其他','政府部门','非营利组织','环境','农/林/牧/渔','研究所/研究院','公共交通']
  }
}
var Patterns = {
  1 : /^1\d{10}$/,                            //mobile
  6 : /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,//email
  3 : /^\d{5,11}$/
}
var jobStart = {
  'company' : {
    'IT行业' : [
      [ {'src':'img/company/it/youku.png'   ,'name':'优酷'  ,'search_name':'优酷土豆'       }, {'src':'img/company/it/baidu.png'  ,'name':'百度'    ,'search_name':'百度在线' },
        {'src':'img/company/it/tencent.png' ,'name':'腾讯'                                  }, {'src':'img/company/it/xiaomi.png' ,'name':'小米'    ,'search_name':'小米通讯' }],
      [ {'src':'img/company/it/jd.png'      ,'name':'京东'  ,'search_name':'JD京东商城'     }, {'src':'img/company/it/360.png'    ,'name':'360'     ,'search_name':'奇虎360'  },
        {'src':'img/company/it/vipshop.png' ,'name':'唯品会','search_name':'广州唯品会信息' }, {'src':'img/company/it/matchcv.png','name':'望才招聘','search_name':'上海睿聘网络科技'}]
    ],
    '金融行业' : [
      [{'src':'img/company/jr/guangfa.png','name':'广发'    }, {'src':'img/company/jr/dahua.png' ,'name':'大华'}, {'src':'img/company/jr/pingan.png','name':'平安'   }, {'src':'img/company/jr/zhaohang.jpg'  ,'name':'招商银行'    }],
      [{'src':'img/company/jr/minsheng.png','name':'民生银行'}, {'src':'img/company/jr/guotaijunan.png'   ,'name':'国泰君安' }, {'src':'img/company/jr/zhongxin.jpg','name':'中信' }, {'src':'img/company/jr/shenwan.png' ,'name':'申银万国'}]
    ],
    '建筑/房地产行业' : [
      [{'src':'img/company/fdc/wanke.png','name':'万科'}, {'src':'img/company/fdc/hengda.png','name':'恒大地产'}, {'src':'img/company/fdc/baoli.png','name':'保利'}, {'src':'img/company/fdc/wanda.png','name':'万达'}],
      [{'src':'img/company/fdc/lvdi.png','name':'绿地'}, {'src':'img/company/fdc/longhu.png','name':'龙湖' }, {'src':'img/company/fdc/fuli.png','name':'富力' }, {'src':'img/company/fdc/shimao.png' ,'name':'世茂'}]
    ]
  },
  'advice' : {
    'IT行业'          : ['工程师','产品','设计'],
    '金融行业'        : ['银行','证券','保险'],
    '制造工业'        : ['销售','市场','工程师'],
    '建筑/房地产行业' : ['销售','市场','设计'],
    '医疗/卫生'       : ['销售','市场','研发'],
    'others'          : ['销售','市场','财务']
  },
  'position': {
    'IT行业'          : [
      [{'style':'color:#fd590d;', 'text':'O2O'    },{'style':'color:#fd590d;', 'text':'电商'},{'style':'color:#fd590d;', 'text':'iOS'}],
      [{'style':'color:#fd590d;', 'text':'android'},{'style':'color:#888888;', 'text':'php' },{'style':'color:#888888;', 'text':'java'}],
      [{'style':'color:#888888;', 'text':'C++'},{'style':'color:#888888;', 'text':'C#'},{'style':'color:#888888;', 'text':'python'}],
      [{'style':'color:#888888;', 'text':'ruby'},{'style':'color:#888888;', 'text':'js'},{'style':'color:#888888;', 'text':'前端'}],
      [{'style':'color:#888888;', 'text':'html5'},{'style':'color:#888888;', 'text':'前端'},{'style':'color:#888888;', 'text':'DBA'}],
      [{'style':'color:#fd590d;', 'text':'大数据'},{'style':'color:#888888;', 'text':'算法'},{'style':'color:#888888;', 'text':'测试'}],
      [{'style':'color:#888888;', 'text':'技术经理'},{'style':'color:#888888;', 'text':'技术总监'},{'style':'color:#fd590d;', 'text':'架构师'}],
      [{'style':'color:#fd590d;', 'text':'CTO'},{'style':'color:#888888;', 'text':'产品总监'},{'style':'color:#888888;', 'text':'产品经理'}],
      [{'style':'color:#888888;', 'text':'游戏策划'},{'style':'color:#888888;', 'text':'设计总监'},{'style':'color:#888888;', 'text':'UI'}],
      [{'style':'color:#888888;', 'text':'UE'},{'style':'color:#888888;', 'text':'交互设计'},{'style':'color:#888888;', 'text':'数据分析'}],
      [{'style':'color:#888888;', 'text':'运营'},{'style':'color:#888888;', 'text':'运营总监'},{'style':'color:#888888;', 'text':'COO'}],
      [{'style':'color:#888888;', 'text':'市场推广'},{'style':'color:#888888;', 'text':'市场总监'},{'style':'color:#888888;', 'text':'市场策划'}],
      [{'style':'color:#888888;', 'text':'BD'},{'style':'color:#888888;', 'text':'销售总监'}]
    ],
    '金融行业'        : [
      [{'style':'color:#fd590d;', 'text':'VC'    },{'style':'color:#888888;', 'text':'PE'},{'style':'color:#fd590d;', 'text':'投资'}],
      [{'style':'color:#888888;', 'text':'分析师'},{'style':'color:#fd590d;', 'text':'投行' },{'style':'color:#888888;', 'text':'咨询'}],
      [{'style':'color:#888888;', 'text':'审计'},{'style':'color:#888888;', 'text':'税务'},{'style':'color:#888888;', 'text':'银行'}],
      [{'style':'color:#888888;', 'text':'保险'},{'style':'color:#888888;', 'text':'基金'},{'style':'color:#888888;', 'text':'券商'}],
      [{'style':'color:#888888;', 'text':'财务'},{'style':'color:#888888;', 'text':'风控'},{'style':'color:#888888;', 'text':'理财顾问'}],
      [{'style':'color:#888888;', 'text':'客户经理'},{'style':'color:#888888;', 'text':'行长'},{'style':'color:#888888;', 'text':'风险控制'}],
      [{'style':'color:#888888;', 'text':'外汇'},{'style':'color:#888888;', 'text':'操盘手'},{'style':'color:#888888;', 'text':'项目'}],
      [{'style':'color:#888888;', 'text':'采购'},{'style':'color:#888888;', 'text':'商务'},{'style':'color:#888888;', 'text':'售前'}],
      [{'style':'color:#888888;', 'text':'售后'},{'style':'color:#888888;', 'text':'法务'},{'style':'color:#888888;', 'text':'技术'}],
      [{'style':'color:#888888;', 'text':'大客户'},{'style':'color:#888888;', 'text':'设计'},{'style':'color:#888888;', 'text':'质量'}],
      [{'style':'color:#888888;', 'text':'人力资源'},{'style':'color:#888888;', 'text':'行政'},{'style':'color:#888888;', 'text':'产品'}]
    ],
    '制造工业'        : [
      [{'style':'color:#888888;', 'text':'市场'    },{'style':'color:#888888;', 'text':'销售'},{'style':'color:#888888;', 'text':'QC'}],
      [{'style':'color:#888888;', 'text':'质量控制'},{'style':'color:#888888;', 'text':'机械' },{'style':'color:#888888;', 'text':'传动'}],
      [{'style':'color:#888888;', 'text':'车身'},{'style':'color:#888888;', 'text':'客服'},{'style':'color:#888888;', 'text':'整车'}],
      [{'style':'color:#fd590d;', 'text':'项目管理'},{'style':'color:#888888;', 'text':'工程师'},{'style':'color:#888888;', 'text':'保养'}],
      [{'style':'color:#888888;', 'text':'采购'},{'style':'color:#888888;', 'text':'商务'},{'style':'color:#888888;', 'text':'售前'}],
      [{'style':'color:#888888;', 'text':'售后'},{'style':'color:#888888;', 'text':'法务'},{'style':'color:#888888;', 'text':'财务'}],
      [{'style':'color:#888888;', 'text':'技术'},{'style':'color:#fd590d;', 'text':'研发'},{'style':'color:#888888;', 'text':'客户经理'}],
      [{'style':'color:#888888;', 'text':'大客户'},{'style':'color:#888888;', 'text':'设计'},{'style':'color:#888888;', 'text':'质量'}],
      [{'style':'color:#888888;', 'text':'人力资源'},{'style':'color:#888888;', 'text':'行政'},{'style':'color:#888888;', 'text':'产品'}]
    ],
    '建筑/房地产行业' : [
      [{'style':'color:#fd590d;', 'text':'建筑设计'},{'style':'color:#888888;', 'text':'造价'},{'style':'color:#888888;', 'text':'强电'}],
      [{'style':'color:#888888;', 'text':'弱电'},{'style':'color:#888888;', 'text':'市场' },{'style':'color:#888888;', 'text':'策划'}],
      [{'style':'color:#888888;', 'text':'工程师'},{'style':'color:#fd590d;', 'text':'销售'},{'style':'color:#888888;', 'text':'规划'}],
      [{'style':'color:#888888;', 'text':'预算'},{'style':'color:#888888;', 'text':'监理'},{'style':'color:#888888;', 'text':'项目'}],
      [{'style':'color:#888888;', 'text':'采购'},{'style':'color:#888888;', 'text':'商务'},{'style':'color:#888888;', 'text':'售前'}],
      [{'style':'color:#888888;', 'text':'售后'},{'style':'color:#888888;', 'text':'法务'},{'style':'color:#888888;', 'text':'财务'}],
      [{'style':'color:#888888;', 'text':'技术'},{'style':'color:#888888;', 'text':'客服'},{'style':'color:#888888;', 'text':'客户经理'}],
      [{'style':'color:#888888;', 'text':'大客户'},{'style':'color:#888888;', 'text':'设计'},{'style':'color:#888888;', 'text':'质量'}],
      [{'style':'color:#888888;', 'text':'人力资源'},{'style':'color:#888888;', 'text':'行政'},{'style':'color:#888888;', 'text':'产品'}]
    ],
    '医疗/卫生'       : [
      [{'style':'color:#fd590d;', 'text':'销售'    },{'style':'color:#888888;', 'text':'市场'},{'style':'color:#fd590d;', 'text':'研发'}],
      [{'style':'color:#888888;', 'text':'注册'},{'style':'color:#888888;', 'text':'招商' },{'style':'color:#888888;', 'text':'项目'}],
      [{'style':'color:#fd590d;', 'text':'采购'},{'style':'color:#888888;', 'text':'商务'},{'style':'color:#888888;', 'text':'售前'}],
      [{'style':'color:#888888;', 'text':'售后'},{'style':'color:#fd590d;', 'text':'法务'},{'style':'color:#888888;', 'text':'财务'}],
      [{'style':'color:#888888;', 'text':'技术'},{'style':'color:#888888;', 'text':'客服'},{'style':'color:#888888;', 'text':'客户经理'}],
      [{'style':'color:#888888;', 'text':'大客户'},{'style':'color:#888888;', 'text':'设计'},{'style':'color:#888888;', 'text':'质量'}],
      [{'style':'color:#888888;', 'text':'人力资源'},{'style':'color:#888888;', 'text':'行政'},{'style':'color:#888888;', 'text':'产品'}]
    ],
    'others'          : [
      [{'style':'color:#888888;', 'text':'销售'    },{'style':'color:#888888;', 'text':'市场'},{'style':'color:#888888;', 'text':'研发'}],
      [{'style':'color:#888888;', 'text':'采购'},{'style':'color:#888888;', 'text':'商务'},{'style':'color:#888888;', 'text':'售前'}],
      [{'style':'color:#888888;', 'text':'售后'},{'style':'color:#888888;', 'text':'法务'},{'style':'color:#888888;', 'text':'财务'}],
      [{'style':'color:#888888;', 'text':'技术'},{'style':'color:#888888;', 'text':'项目'},{'style':'color:#888888;', 'text':'客户经理'}],
      [{'style':'color:#888888;', 'text':'大客户'},{'style':'color:#888888;', 'text':'设计'},{'style':'color:#888888;', 'text':'质量'}],
      [{'style':'color:#888888;', 'text':'人力资源'},{'style':'color:#888888;', 'text':'行政'},{'style':'color:#888888;', 'text':'产品'}]
    ]
  }
}

var Yibeiban = function(){
  var API_Host = 'http://api.yibeiban.com:8888';
  var API_Lock = false;

  /* To be inited or changed in ctrl */
  var BackManner    = null;
  var MySQLite      = null;

  var $ionicNavBarDelegate = null;
  var $ionicLoading = null;
  var $http         = null;
  var $state        = null;
  var $scope        = null;
  var $menusScope   = null;
  var $timeout      = null;
  /* End */

  var backward = function(){
    switch(BackManner){
      case 'exit' :navigator.app.exitApp();break;
      case 'xxxx' :navigator.app.backHistory();break;
      case 'back' :$ionicNavBarDelegate.back();break;
      case 'wait' :$state.go('menus.job-main');break;
      default     :break;
    }
  }

  var isOnline = function(){return navigator && navigator.connection && navigator.connection.type!=Connection.NONE;};
  //var myLogger = function(i){return console.log(JSON.stringify(i));};
  var myLogger = function(){for(var i=0;i<arguments.length;i++){console.log(JSON.stringify(arguments[i]));}};

  var MemCache = function(){
    var data = {};
    var conn = {};
    conn.save = function(key, val){
      data[key] = {'ttl' : Date.now(), 'val' : val};
      return data[key];
    }
    conn.load = function(key, ttl){
      return (data[key] && (data[key].ttl > Date.now() - (ttl || 60*60*24*365)*1000)) ? data[key].val : false;
    }
    conn.clear = function(){
      return data = {};
    }
    return conn;
  }();

  var LocCache = function(){
    var data = {};
    var conn = {};
    conn.save = function(key, val){
      try{
        key = ('&'==key.substring(0,1)) ? key : '~'+key;
        data[key] = {'ttl' : Date.now(), 'val' : val};
        localStorage[key] = JSON.stringify(data[key]);
        return data[key];
      }catch(e){
        return false;
      }
    }
    conn.load = function(key, ttl){
      try{
        key = ('&'==key.substring(0,1)) ? key : '~'+key;
        data[key] = JSON.parse(localStorage[key]);
        return (data[key] && (data[key].ttl > Date.now() - (ttl || 60*60*24*365)*1000)) ? data[key].val : false;
      }catch(e){
        return false;
      }
    }
    conn.clear = function(prefix){
      prefix = prefix || '~';
      Object.keys(localStorage).forEach(function(key){if(key.substring(0,1)==prefix){localStorage.removeItem(key);}});
    }
    return conn;
  }();

  var SqlCache = function(){
    var conn = {};
    conn.save = function(key, val, callback){MySQLite && MySQLite.saveRecords('cache', [{'key':key, 'val':JSON.stringify(val), 'ttl':Date.now()}], callback);}
    conn.load = function(key, ttl, callback){
      var wrapper = function(res){
        if(!res.rows || !res.rows.item(0) || !res.rows.item(0).val){
          return callback(false);
        }
        var json = JSON.parse(res.rows.item(0).val);
        if(!json){
          return callback(false);
        }
        return callback(json);
      }
      MySQLite && MySQLite.findRecords('cache', "WHERE `key` = '#key#' AND `ttl` > #ttl#".replace('#key#', key).replace('#ttl#', Date.now() - (ttl*1000 || 0)), wrapper);
    }
    return conn;
  }();

  var myNotice = function(msg, timeout, prev, post){
    $ionicLoading.show({template:msg});
    $timeout(function(){prev && prev();$ionicLoading.hide();post && post();}, timeout || 1000);
    return false;
  }

  var myRemote = function(target, params, done, fail){
    if(!isOnline()){
      return myLogger('Connection.NONE');
    }
    var lock = target;//var lock = API_Host+target + ":" + JSON.stringify(params);
    if(API_Lock==lock){
      return myLogger('Http Locked:'+API_Lock);
    }
    API_Lock = lock;
    
    LocCache.save('&remote:'+target, LocCache.load('&remote:'+target)+1);

    $http.post(API_Host+target, JSON.stringify(params), {'timeout' : 10000
    }).success(function(data){
      API_Lock = false;
      if(data.status){
        done && done(data);
      }else{
        $ionicLoading.hide();
        fail ? fail(data) : myNotice(data ? data.errmsg : '发生错误');
      }
    }).error(function(data, status){
      API_Lock = false;
      if(true){
        $ionicLoading.hide();
        fail ? fail(data) : myNotice(data ? data.errmsg : '网络错误');
      }
    });
  }

  var ajaxPost = function(target, params, done, fail){
    myRemote(target, {'id_ybb' : ybb_user.profile.id_ybb, 'secret' : ybb_user.profile.secret, 'params' : params}, done, fail);
  }

  var getMySQLite = function(){return MySQLite;}
  var setMySQLite = function(conn){MySQLite = conn;}

  var setBackManner     = function(type){BackManner = type;}

  var setMyIonicNavBarDelegate = function(obj){$ionicNavBarDelegate = obj;}
  var setMyIonicLoading = function(obj){$ionicLoading = obj;}
  var setMyHttp         = function(obj){$http         = obj;}
  var setMyTimeout      = function(obj){$timeout      = obj;}
  var setMenusScope     = function(obj){$menusScope   = obj;}

  var intoMyController  = function(scope, state){
    $scope = scope;
    $state = state;
    $scope.myConfig = myConfig;
    $scope.back = function(){backward();};
    $scope.$on("$destroy", function(){exitMyController();});
  }
  var exitMyController  = function(){
    $scope = null;
    $state = null;
  }

  var updateUnread = function(){
    if(ybb_user && ybb_user.profile && ybb_user.profile.id_ybb && ybb_user.profile.secret){
      var params = {'id_ybb' : ybb_user.profile.id_ybb, 'secret' : ybb_user.profile.secret, 'params': {}}
      myRemote('/message/unread-number', params, function(data){
        if($menusScope){
          $menusScope.badge_number = data.result.unread_number || '';
          window.plugins && window.plugins.jPushPlugin && window.plugins.jPushPlugin.setBadge($menusScope.badge_number);
        }
      });
    }
  }

  var insertUnread = function(){
    if($menusScope){$menusScope.badge_number = ($menusScope.badge_number*1 || 0) + 1;}    
  }

  var ws_interval = 0;
  var ws_valid    = 0;

  var initWebSocket = function(){
    setTimeout(function(){makeWebSocket();}, 3000+Math.random()*ws_interval*1000);
  }
  var makeWebSocket = function(){
    var time = Date.now();
    if(!isOnline() || !ybb_user || !ybb_user.profile){
      initWebSocket();
      return false;
    }

    var address = 'ws://api.yibeiban.com:8888/websocket/message/app/connect?id_ybb=#id_ybb#&secret=#secret#';
    var address = address.replace('#id_ybb#', ybb_user.profile.id_ybb).replace('#secret#', ybb_user.profile.secret);

    var ws = new WebSocket(address);

    ws.onopen = function(e){
    };
    ws.onclose = function(e){
      initWebSocket();
    };
    ws.onerror = function(e){
    };
    ws.onmessage = function(e){
      var json = JSON.parse(e.data);
      if($scope.onmessage){return $scope.onmessage(json);}
      if(1==json.type){
        if($menusScope){$menusScope.$apply(function(){insertUnread();});}
      }
    };
  }

  initWebSocket();

  var yibeiban = {}

  yibeiban.backward = backward;
  yibeiban.isOnline = isOnline;
  yibeiban.myLogger = myLogger;
  yibeiban.MemCache = MemCache;
  yibeiban.LocCache = LocCache;
  yibeiban.SqlCache = SqlCache;
  yibeiban.myNotice = myNotice;
  yibeiban.myRemote = myRemote;
  yibeiban.ajaxPost = ajaxPost;

  yibeiban.getMySQLite = getMySQLite;
  yibeiban.setMySQLite = setMySQLite;
  
  yibeiban.updateUnread = updateUnread;
  yibeiban.insertUnread = insertUnread;

  yibeiban.setBackManner  = setBackManner;
  
  yibeiban.setMyIonicNavBarDelegate = setMyIonicNavBarDelegate;
  yibeiban.setMyIonicLoading        = setMyIonicLoading;

  yibeiban.setMyHttp        = setMyHttp;
  yibeiban.setMyTimeout     = setMyTimeout;
  yibeiban.setMenusScope    = setMenusScope;

  yibeiban.intoMyController = intoMyController;
  yibeiban.exitMyController = exitMyController;

  return yibeiban;
}();

var ybb_user = null;