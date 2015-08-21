/*starry*/
angular.module('starter.controllers', [])

.constant('ApiEndpoint', {
  url: 'http://m2.cosjii.com'
})

.constant('HelpData', {
  arr: []
})

.controller('IndexCtrl', function($scope, $http, ApiEndpoint) {
  $scope.banner = [];
  $scope.count = '';
  $scope.tenUrl = '';
  $http.get(ApiEndpoint.url + '/Index/GetIndexSlides?_ajax_=1').success(function(data) {
    if (data.error == 0) {
      $scope.banner = data.list;
      $scope.iswebchat = window.localStorage['iswebchat'] = data.webchat;
      $scope.tenUrl = data.ten_yuan_url;
    }
  });
  $http.get('http://m.zhemai.com/?g=mobile&m=index&a=ajax_get_products&p=1').success(function(data) {
    if (data.error == 0) {
      $scope.count = data.new_arrived;
    }
  });

  $scope.bannerClick = function(url, title) {
    window.open(url, '_blank', 'location=yes', title);
  };
})

.controller('Article', function($scope, $ionicHistory, $stateParams, HelpData) {
  $scope.param = {};
  $scope.backGo = function() {
    $ionicHistory.goBack();
  }

  for (var i = 0; i < HelpData.arr.length; i++) {
    if (HelpData.arr[i].title === $stateParams.title) {
      $scope.param.title = $stateParams.title;
      $scope.param.content = HelpData.arr[i].content;
    }
    // return null;
  }
})

.controller('Help', function($scope, $ionicHistory, $location, $http, HelpData) {
  $scope.helpinfo_left = [];
  $scope.helpinfo_right = [];
  $http.get('http://m2.cosjii.com/Article/QAForBeginner?_ajax_=1&p=1').success(function(data) {
    if (data.error == 0) {
      for (var i = 0; i < data.rows.length; i++) {
        (data.rows)[i].index = i + 1;
        HelpData.arr.push((data.rows)[i]);
      }
      $scope.helpinfo_left = data.rows;
    }
  });

  $http.get('http://m2.cosjii.com/Article/QAForAccount?_ajax_=1&p=1').success(function(data) {
    if (data.error == 0) {
      for (var i = 0; i < data.rows.length; i++) {
        (data.rows)[i].index = i + 1;
        HelpData.arr.push((data.rows)[i]);
      }
      $scope.helpinfo_right = data.rows;
    }
  });

  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.helpDetail = function(title) {
    $location.path('public/article/' + title);
  }
})

.controller('Help-left', function($scope) {})

.controller('Help-right', function($scope) {
  $scope.helpinfo_right = [];
  $scope.$on('help.right', function(event, data) {
    $scope.helpinfo_right = data;
  });

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('UserCtrl', function($scope, $state, $ionicModal, $timeout, $ionicPopup, $ionicPopover, $http, ApiEndpoint, Userinfo, $ionicLoading, $cordovaActionSheet, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, $cordovaAppVersion, $stateParams) {
  $scope.flag = Userinfo.l.flag;
  $scope.params = Userinfo.l;
  $scope.sign = Userinfo.l.today_signed;
  $scope.avaImg = Userinfo.l.avatar_url ? Userinfo.l.avatar_url : 'img/default-ava.png';
  $scope.searchData = {};
  $scope.goodsPage = 1;
  $scope.goods_load_over = true;
  $scope.goodsItemsL = [];
  $scope.goodsItemsR = [];
  $scope.app_version = Userinfo.l.version;
  $scope.doRefresh = function() {
    if (Userinfo.l.flag == 1) {
      $http.get(ApiEndpoint.url + '/User/GetUserInfo?_ajax_=1').success(function(data) {
        // alert(JSON.stringify(data));
        if (data.error != 0) {
          if (data.error == 9999) {
            $scope.flag = '';
            Userinfo.l.id = '';
            Userinfo.remove('flag');
            $scope.$broadcast("scroll.refreshComplete");
            return;
          }
          $scope.showMsg(data.info);
          return;
        }
        Userinfo.save(data.user_info);
        $scope.flag = 1;
        $scope.sign = Userinfo.l.today_signed;
        $scope.avaImg = Userinfo.l.avatar_url ? Userinfo.l.avatar_url : 'img/default-ava.png';
        $scope.unreadMsg = Userinfo.l.unread_msg_count == '0' ? '0' : Userinfo.l.unread_msg_count;
        $scope.$broadcast("scroll.refreshComplete");
      })
    }else{
      $scope.$broadcast("scroll.refreshComplete");
    }
  };

  $scope.doRefresh();

  $scope.loadGoods = function() {
    $timeout(function() {
      $http.get('http://m.zhemai.com/?g=mobile&m=index&a=ajax_get_products&p=' + $scope.goodsPage).success(function(data) {
        if (data.error == 0) {
          for (var i = 0; i < data.product_list.length; i++) {
            if (i % 2 == 0) {
              $scope.goodsItemsL.push((data.product_list)[i]);
            } else {
              $scope.goodsItemsR.push((data.product_list)[i]);
            }
          }

          if (data.product_list.length < 20) {
            $scope.goods_load_over = false;
            return;
          }
          $scope.goodsPage++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      });
    }, 200);
  };


  $scope.search = function() {
    var searchTitle = $scope.searchData.keyword;
    if (!searchTitle) {
      return
    }
    if (!Userinfo.l.id) {
      $scope.login();
      return;
    }
    if (searchTitle.length > 7) {
      searchTitle = searchTitle.substr(0, 7) + '...';
    }
    window.open('http://m2.cosjii.com//Taobao/Search?k=' + $scope.searchData.keyword + '&p=1&uid=' + Userinfo.l.id, '_blank', 'location=yes', '返利模式购物中...');
  };

  $scope.clearSearch = function(){

    alert(123);

    $scope.searchData.keyword = '';
    
  };

  $scope.clickDetail = function(id, title) {
    if (!id) {
      return;
    }
    if (title.length > 5) {
      title = title.substr(0, 6) + '...'
    }
    window.open('http://m.zhemai.com/?g=mobile&m=item&a=index&id=' + id, '_blank', 'location=yes', title)
  };

  $scope.goToWeb = function(url, title) {
    window.open(url, '_blank', 'location=yes', title);
  };

  $scope.signAlert = function() {
    // if (Userinfo.l.today_signed == 1) {
    //   return;
    // };
    $http.get(ApiEndpoint.url + '/Account/SignIn?_ajax_=1').success(function(data) {

      if (data.error == 9999) {
        alert('登录超时，请重新登录');
        $scope.login();
        $scope.flag = '';
        Userinfo.l.id = '';
        Userinfo.remove('flag');
        return;
      } else if (data.error != 0) {
        $scope.popTitle = '签到失败';
        $scope.popInfo = data.info;
        $scope.isSign = 0;
      } else {
        $scope.popTitle = '签到成功';
        $scope.popInfo = '恭喜您获取15积分';
        $scope.isSign = 1;
      }

      $ionicPopup.alert({
        title: $scope.popTitle,
        template: $scope.popInfo,
        buttons: [{
          text: '确定',
          type: 'button-assertive'
        }]
      }).then(function(res) {
        if ($scope.isSign == 1) {
          $scope.sign = Userinfo.l.today_signed = 1;
          Userinfo.l.jifen = parseInt(Userinfo.l.jifen) + 15;
        }
      });
    });
  };

  var options = {
    title: '上传头像',
    buttonLabels: ['相册', '相机'],
    addCancelButtonWithLabel: '取消',
    androidEnableCancelButton: true,
    winphoneEnableCancelButton: true
  };
  $scope.upLoadImg = function() {
    $cordovaActionSheet.show(options)
      .then(function(btnIndex) {
        switch (btnIndex) {
          case 1:
            $scope.pickImg();
            break;
          case 2:
            $scope.cameraImg();
            break;
          default:
            break;
        }
      });
  };

  $scope.pickImg = function() {
    var options = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 80
    };
    var server = ApiEndpoint.url + '/Account/ModifyAvatar?_ajax_=1&ue=' + Userinfo.l.ue;
    var trustHosts = true
    var option = {};

    $cordovaImagePicker.getPictures(options)
      .then(function(results) {
        $cordovaFileTransfer.upload(server, results[0], option, true)
          .then(function(result) {
            alert('上传成功');
            $scope.avaImg = results[0];
          }, function(err) {
            alert('上传失败，请重试');
          }, function(progress) {
            $ionicLoading.show({
              template: "正在上传..." + Math.round((progress.loaded / progress.total) * 100) + '%'
            });
            if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
              $ionicLoading.hide();
            }
          });
      }, function(error) {
        // alert('出错');
      });
  };

  $scope.cameraImg = function() {
    var server = ApiEndpoint.url + '/Account/ModifyAvatar?_ajax_=1&ue=' + Userinfo.l.ue;
    var trustHosts = true
    var option = {};
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $cordovaFileTransfer.upload(server, "data:image/jpeg;base64," + imageData, option, true)
        .then(function(result) {
          alert('上传成功');
          $scope.doRefresh();
        }, function(err) {
          alert('上传失败，请重试');
        }, function(progress) {
          $ionicLoading.show({
            template: "正在上传..." + Math.round((progress.loaded / progress.total) * 100) + '%'
          });
          if (Math.round((progress.loaded / progress.total) * 100) >= 99) {
            $ionicLoading.hide();
          };
        });
    }, function(err) {
      // alert('出错');
    });
  };

  $scope.goAbout = function() {
    $state.go('tab.about');
  };

  $ionicModal.fromTemplateUrl('templates/about.html ', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.about = function() {
    $scope.modal.show();
  };
  $scope.closeAbout = function() {
    $scope.modal.hide();
  };
  $scope.exit = function() {
    $scope.flag = '';
    Userinfo.l.id = '';
    Userinfo.remove('flag');
    $scope.modal.hide();
  };
  $scope.$on("$destroy", function() {
    $scope.modal.remove();
  });
  $scope.balance = function() {
    if (Userinfo.l.flag != 1) {
      $scope.login();
    } else {
      $state.go('public.withdraw-balance');
    }
  };
  // 登陆

  $ionicModal.fromTemplateUrl('templates/user/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalLogin = modal;
    $scope.loginData = {};
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
    $scope.loginData = {};
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modalLogin.show();
  };

  $scope.showMsg = function(txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function() {
      $scope.popover.hide();
    }, 1400);
  };

  $scope.doLogin = function() {
    if (!$scope.loginData.username) {
      $scope.showMsg('用户名不能为空');
      return false;
    };
    if (!$scope.loginData.password) {
      $scope.showMsg('密码不能为空');
      return false;
    };
    $ionicLoading.show({
      template: "正在登录..."
    });
    $http.post(ApiEndpoint.url + '/User/Login?_ajax_=1', {
      user: $scope.loginData.username,
      password: $scope.loginData.password
    }).success(function(data) {
      $ionicLoading.hide();
      if (data.error != 0) {
        $scope.showMsg(data.info);
      } else {
        Userinfo.save(data.user_info);
        Userinfo.add('flag', 1);
        $scope.sign = Userinfo.l.today_signed;
        $scope.avaImg = Userinfo.l.avatar_url ? Userinfo.l.avatar_url : 'img/default-ava.png';
        $scope.flag = 1;
        $scope.closeLogin();
      }
    });

  };

  $scope.goToHelp = function() {
    $state.go('help.helpleft');
  }

  $scope.checkUpdata = function() {
    $cordovaAppVersion.getAppVersion().then(function(version) {
      $ionicLoading.show({
        template: '检测版本中...'
      });
      Userinfo.add('version', version);
      $http.get('http://m2.cosjii.com/System/GetLastestVersion?_ajax_=1&t=a&v=' + version).success(function(data) {
        $ionicLoading.hide();
        if (data.error == 0) {
          if (version != data.version) {
            $scope.showUpdateConfirm(data.desc, data.apk);
          } else {
            alert('目前是最新版本');
          }
        } else {
          alert('服务器连接错误，请稍微再试');
        }
      })
    });
  }

  $scope.showUpdateConfirm = function(desc, url) {
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

  $scope.aboutGoTo = function(listid) {
    switch (listid) {
      case 1:
        $state.go('help.helpleft');
        $scope.modal.hide();
        break;
      case 2:
        $state.go('public.tutorial');
        $scope.modal.hide();
        break;
      case 3:
        $state.go('public.feedback');
        $scope.modal.hide();
        break;
      case 4:
        $scope.checkUpdata();
        break;
      case 5:
        alert('缓存已清除');
        break;
      default:
        break;
    };
  }

  $scope.goToEx = function() {
    $state.go('public.active-back');
  }

  $scope.goTo = function(listid) {
    if (Userinfo.l.flag != 1) {
      $scope.login();
    } else {
      switch (listid) {
        case 1:
          $state.go('public.orderlist');
          break;
        case 2:
          $state.go('public.incomedetail');
          break;
        case 3:
          window.open('http://h5.m.taobao.com/awp/mtb/mtb.htm?#!/awp/mtb/mtb.htm', '_blank', 'location=yes', '我的淘宝');
          break;
        case 6:
          $state.go('public.acount');
          break;
        case 9:
          $scope.unreadMsg = window.localStorage['unread_msg_count'] = '0';
          $state.go('public.message');
          break;
        case 8:
          $state.go('public.feedback');
          break;
        case 7:
          $state.go('public.invitation');
          break;
        case 5:
          $state.go('public.active-back');
          break;
        case 11:
          $scope.signAlert();
          break;
        case 12:
          $state.go('public.jifen-exchange-cash');
          break;
        case 13:
          $state.go('public.store-rebate');
          break;
        case 14:
          $state.go('missorder.form');
          break;
        default:
          break;
      }
    }
  };

  $scope.kf = function(url, title) {
    if (window.localStorage['iswebchat'] == 1) {
      window.open(url, '_blank', 'location=yes', title);
    } else {
      window.open(url, '_system', 'location=yes', title);
    }
  };

  $scope.goZhemai = function() {
    window.open('http://m.zhemai.com', '_blank', 'location=yes', '折买好货');
  };

  // 注册
  $ionicModal.fromTemplateUrl('templates/user/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_register = modal;
    $scope.registerData = {};
  });

  $scope.register = function() {
    $scope.modal_register.show();
  };
  $scope.closeRegister = function() {
    $scope.modal_register.hide();
    $scope.registerData = {};
  };
  $scope.doRegister = function() {
    var reg = /^1\d{10}$/;
    if (!$scope.registerData.username) {
      $scope.showMsg('用户名不能为空');
      return false;
    };
    if (!$scope.registerData.phone) {
      $scope.showMsg('手机号不能为空');
      return false;
    } else if (!reg.test($scope.registerData.phone)) {
      $scope.showMsg('手机号格式错误');
      return false;
    };
    if (!$scope.registerData.password || !$scope.registerData.repassword) {
      $scope.showMsg('密码不能为空');
      return false;
    } else if ($scope.registerData.password != $scope.registerData.repassword) {
      $scope.showMsg('两次密码不一致');
      return false;
    }
    $ionicLoading.show({
      template: '注册中...'
    });
    $http.post(ApiEndpoint.url + '/User/Register?_ajax_=1', {
      user: $scope.registerData.username,
      mobile: $scope.registerData.phone,
      password: $scope.registerData.password
    }).success(function(data) {
      $ionicLoading.hide();
      $scope.showMsg(data.info);
      if (data.error == 0) {
        $http.post(ApiEndpoint.url + '/User/Login?_ajax_=1', {
          user: $scope.registerData.username,
          password: $scope.registerData.password
        }).success(function(data) {
          if (data.error != 0) {
            $scope.showMsg(data.info);
          } else {
            Userinfo.save(data.user_info);
            Userinfo.add('flag', 1);
            $scope.flag = 1;
            $scope.sign = Userinfo.l.today_signed;
            $scope.avaImg = Userinfo.l.avatar_url ? Userinfo.l.avatar_url : 'img/default-ava.png';
            $scope.closeRegister();
            $scope.closeLogin();
          }
        });
      }
    });
  }


})

.controller('MissOrder', function($scope, $ionicHistory, $http, ApiEndpoint, $timeout, $ionicLoading, $state, Userinfo) {
  $scope.missData = {};
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.goToList = function() {
    $state.go('public.misslist');
  };
  $scope.submitMissOrder = function() {
    $ionicLoading.show({
      template: '提交中...'
    })
    var myDate = new Date();
    if($scope.missData.order.length >= 20){
      alert('订单号过长');
      $ionicLoading.hide();
      return;
    }
    var params = {
      item_title: $scope.missData.title,
      shop_name: $scope.missData.shop,
      order_id: $scope.missData.order,
      real_price: $scope.missData.price,
      commission_rate: $scope.missData.rate ? $scope.missData.rate : 0
    };
    $http.post(ApiEndpoint.url + '/Account/CreateClaimReqForLostOrder?_ajax_=1', params).success(function(data) {
      $ionicLoading.hide();
      if (data.error != 0) {
        if (data.error == 9999) {
          alert('登录超时，请重新登录');
          $scope.flag = '';
          Userinfo.l.id = '';
          Userinfo.remove('flag');
          $state.reload();
          $state.go('tab.user');
        } else {
          alert(data.info);
          return;
        }
      } else {
        alert('提交成功');
        $scope.missData = {}; //清空
        var arrParams = [];
        params.time = myDate.getFullYear() + '-' + (parseInt(myDate.getMonth()) + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
        params.status_label = '处理中';
        arrParams.push(params);
        $scope.items = $scope.items.concat(arrParams);
      }
    })
  };

})

.controller('MissList', function($scope, $ionicHistory, $http, ApiEndpoint, $timeout) {
  $scope.items = [];
  $scope.page = 1;
  $scope.load_over = true;
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.loadMore = function() {
    $timeout(function() {
      $http.get(ApiEndpoint.url + '/Account/GetClaimReqForLostOrder?_ajax_=1&p=' + $scope.page).success(function(data) {
        if (data.error == 0) {
          if ($scope.page > data.pageCount) {
            $scope.load_over = false;
            return;
          }
          $scope.items = $scope.items.concat(data.rows);
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      });
    }, 200);
  };
  $scope.cancelMiss = function(k, id){
    $timeout(function(){
      $http.post(ApiEndpoint.url + '/Account/CancelClaimReqForLostOrder?_ajax_=1',{
        request_id: id
      }).success(function(data){
        if(data.error == 0){
          alert(data.info);
          k.status = '4';
          k.status_label = '已取消';
        }else{
          alert(data.info);
          return;
        }
      })
    }, 200)
  };
})

.controller('MissForm', function($scope) {})

.controller('Taobao', function($scope, $ionicHistory, $state, Userinfo) {

  $scope.searchData = {};

  $scope.iswebchat = window.localStorage['iswebchat'];

  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.tips = function(url) {
    $state.go(url);
  }
  $scope.search = function() {
    var searchTitle = $scope.searchData.keyword;
    if (!searchTitle) {
      return
    }
    if (!Userinfo.l.id) {
      $scope.login();
      return;
    }
    if (searchTitle.length > 7) {
      searchTitle = searchTitle.substr(0, 7) + '...';
    }
    window.open('http://m2.cosjii.com//Taobao/Search?k=' + $scope.searchData.keyword + '&p=1&uid=' + Userinfo.l.id, '_blank', 'location=yes', '返利模式购物中...');
  };
})

.controller('Backpwd', function($scope, $state, $ionicHistory, $http, ApiEndpoint, $ionicPopover, $timeout, $ionicLoading, Userinfo) {
  $scope.backpwdData = {};
  $scope.showMsg = function(txt) {
    var template = '<ion-popover-view style="background-color:#ef473a !important" class="light padding">' + txt + '</ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function() {
      $scope.popover.hide();
    }, 1400);
  };
  $scope.backGo = function() {
    $state.go('tab.user');
  };
  $scope.stepNext = function(evt) {
    var elem = evt.currentTarget;
    elem.setAttribute('disabled', "disabled");
    if (!$scope.backpwdData.ep) {
      $scope.showMsg('手机号或者邮箱不能为空');
      elem.removeAttribute('disabled');
    } else {
      elem.innerHTML = '验证中...';
      $http.post(ApiEndpoint.url + '/User/IForgotSendValicode?_ajax_=1', {
        contact: $scope.backpwdData.ep
      }).success(function(data) {
        if (data.error != 0) {
          $scope.showMsg(data.info);
        } else {
          Userinfo.add('uid', data.uid);
          $state.go('backstep.step2');
        };
        elem.innerHTML = '下一步';
        elem.removeAttribute('disabled');
      });
    }
  };
  $scope.stepOK = function() {
    if (!$scope.backpwdData.vail) {
      $scope.showMsg('请输入验证码');
    } else {
      $ionicLoading.show({
        template: '提交中...'
      })
      $http.post(ApiEndpoint.url + '/User/IForgotValidate?_ajax_=1', {
        uid: Userinfo.l.uid,
        valicode: $scope.backpwdData.vail
      }).success(function(data) {
        $ionicLoading.hide();
        if (data.error != 0) {
          $scope.showMsg(data.info);
        } else {
          Userinfo.add('token', data.access_token);
          $state.go('backstep.step3');
        }
      })
    }
  };

  $scope.stepLast = function() {
    if (!$scope.backpwdData.pwd || !$scope.backpwdData.repwd) {
      $scope.showMsg('请输入密码');
      return;
    } else if ($scope.backpwdData.pwd != $scope.backpwdData.repwd) {
      $scope.showMsg('两次密码不一致');
      return;
    };
    $ionicLoading.show({
      template: '提交中...'
    });
    $http.post(ApiEndpoint.url + '/User/IForgotChangePw?_ajax_=1', {
      uid: Userinfo.l.uid,
      access_token: Userinfo.l.token,
      password: $scope.backpwdData.pwd,
      password_repeat: $scope.backpwdData.repwd
    }).success(function(data) {
      $ionicLoading.hide();
      if (data.error != 0) {
        $scope.showMsg(data.info);
      } else {
        alert(data.info);
        Userinfo.remove(['uid', 'token']);
        $state.go('tab.user');
      }
    })
  }
})

.controller('Public', function($scope, $ionicPopover, $timeout, $ionicModal, $ionicLoading, $http, Userinfo, ApiEndpoint, $state) {
  $scope.showMsg = function(txt) {
    var template = '<ion-popover-view style = "background-color:#ef473a !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function() {
      $scope.popover.hide();
    }, 1400);
  };

  //login
  $ionicModal.fromTemplateUrl('templates/user/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalLogin = modal;
    $scope.loginData = {};
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
    $state.go('tab.user');
    $scope.loginData = {};
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modalLogin.show();
  };

  $scope.doLogin = function() {
    if (!$scope.loginData.username) {
      $scope.showMsg('用户名不能为空');
      return false;
    };
    if (!$scope.loginData.password) {
      $scope.showMsg('密码不能为空');
      return false;
    };
    $ionicLoading.show({
      template: "正在登录..."
    });
    $http.post(ApiEndpoint.url + '/User/Login?_ajax_=1', {
      user: $scope.loginData.username,
      password: $scope.loginData.password
    }).success(function(data) {
      $ionicLoading.hide();
      if (data.error != 0) {
        $scope.showMsg(data.info);
      } else {
        Userinfo.save(data.user_info);
        Userinfo.add('flag', 1);
        $scope.sign = Userinfo.l.today_signed;
        $scope.avaImg = Userinfo.l.avatar_url ? Userinfo.l.avatar_url : 'img/default-ava.png';
        $scope.flag = 1;
        $scope.closeLogin();
      }
    });

  };

  // 注册
  $ionicModal.fromTemplateUrl('templates/user/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_register = modal;
    $scope.registerData = {};
  });

  $scope.register = function() {
    $scope.modal_register.show();
  };
  $scope.closeRegister = function() {
    $scope.modal_register.hide();
    $scope.registerData = {};
  };
  $scope.doRegister = function() {
    var reg = /^1\d{10}$/;
    if (!$scope.registerData.username) {
      $scope.showMsg('用户名不能为空');
      return false;
    };
    if (!$scope.registerData.phone) {
      $scope.showMsg('手机号不能为空');
      return false;
    } else if (!reg.test($scope.registerData.phone)) {
      $scope.showMsg('手机号格式错误');
      return false;
    };
    if (!$scope.registerData.password || !$scope.registerData.repassword) {
      $scope.showMsg('密码不能为空');
      return false;
    } else if ($scope.registerData.password != $scope.registerData.repassword) {
      $scope.showMsg('两次密码不一致');
      return false;
    }
    $ionicLoading.show({
      template: '注册中...'
    });
    $http.post(ApiEndpoint.url + '/User/Register?_ajax_=1', {
      user: $scope.registerData.username,
      mobile: $scope.registerData.phone,
      password: $scope.registerData.password
    }).success(function(data) {
      $ionicLoading.hide();
      $scope.showMsg(data.info);
      if (data.error == 0) {
        $http.post(ApiEndpoint.url + '/User/Login?_ajax_=1', {
          user: $scope.registerData.username,
          password: $scope.registerData.password
        }).success(function(data) {
          if (data.error != 0) {
            $scope.showMsg(data.info);
          } else {
            Userinfo.save(data.user_info);
            Userinfo.add('flag', 1);
            $scope.flag = 1;
            $scope.sign = Userinfo.l.today_signed;
            $scope.avaImg = Userinfo.l.avatar_url ? Userinfo.l.avatar_url : 'img/default-ava.png';
            $scope.closeRegister();
            $scope.closeLogin();
          }
        });
      }
    });
  };

})

.controller('Orderlist', function($scope, $state, $http, $timeout, ApiEndpoint, $ionicScrollDelegate, $stateParams, $ionicLoading) {
  $scope.isActive = 'a', $scope.isb = true, $scope.isTab = false;
  $scope.items_a = [], $scope.items_b = [];
  $scope.page_a = 1, $scope.page_b = 1;
  $scope.load_over_a = true, $scope.load_over_b = true;
  $scope.backGo = function() {
    $scope.isb = true;
    $state.go('tab.user');
  };
  $scope.changeTab = function(evt) {
    if ($scope.isTab) {
      return;
    }
    var elem = evt.currentTarget;
    $scope.isActive = elem.getAttributeNode('data-active').value;
    $ionicScrollDelegate.scrollTop(false);
    if ($scope.isActive == 'b' && $scope.isb) {
      // $scope.loadMore_b();
      $scope.isb = false;
    }
  };

  $scope.loadMore_a = function() {
    $timeout(function() {
      $http.get(ApiEndpoint.url + '/Account/GetTaobaoOrders?_ajax_=1&p=' + $scope.page_a).success(function(data) {
        if (data.error == 0) {
          if ($scope.page_a > data.page_count) {
            $scope.load_over_a = false;
            return;
          }
          $scope.items_a = $scope.items_a.concat(data.rows);
          $scope.page_a++;
          for (var i = 0; i < $scope.items_a.length; i++) {
            $scope.items_a[i].index = i;
          };
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else if (data.error == 9999) {
          alert('登录超时，请重新登录');
          $scope.login();
          $scope.flag = '';
          Userinfo.l.id = '';
          Userinfo.remove('flag');
          return;
        } else {
          alert(data.info);
        };
        $scope.isTab = false;
      });
    }, 300);
  };
  $scope.loadMore_b = function() {
    $timeout(function() {
      $http.get(ApiEndpoint.url + '/Account/GetMallOrders?_ajax_=1&p=' + $scope.page_b).success(function(data) {
        if (data.error == 0) {
          if ($scope.page_b > data.page_count) {
            $scope.load_over_b = false;
            return;
          }
          $scope.items_b = $scope.items_b.concat(data.rows);
          $scope.page_b++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else if (data.error == 9999) {
          alert('登录超时，请重新登录');
          $scope.login();
          $scope.flag = '';
          Userinfo.l.id = '';
          Userinfo.remove('flag');
          return;
        } else {
          alert(data.info);
        }
      });
    }, 300);
  };

  $scope.shareOrder = function(e, desc, p, index) {
    var url = 'http://m2.cosjii.com/WeChat/Order?e=' + e;
    var short_title = desc.substr(0, 3) + '...';
    var price = null;
    if (parseFloat(p) < 1) {
      price = 1;
    } else {
      price = p;
    }
    var title = '神奇！我从可及返利APP到淘宝买“' + short_title + '”赚到' + price + '元';
    Wechat.isInstalled(function(installed) {
      if (!installed) {
        alert("手机尚未安装微信应用");
      } else {
        $ionicLoading.show({
          template: '正在打开微信,请稍等...'
        });
        $timeout(function() {
          $ionicLoading.hide();
        }, 3000);
      }
    });

    Wechat.share({
      message: {
        title: title,
        description: '可及返利',
        thumb: "http://m2.cosjii.com/img/logo_28.png",
        media: {
          type: Wechat.Type.LINK,
          webpageUrl: url
        }
      },
      scene: Wechat.Scene.TIMELINE // share to Timeline
    }, function() {
      $http.post(ApiEndpoint.url + '/WeChat/SharedOrder?_ajax_=1', {
        'e': e
      }).success(function(data) {
        if (data.error == 0) {
          $state.reload();
          alert("分享成功");
        } else {
          alert('数据匹配错误，请重新分享');
        }
      });
    }, function(reason) {
      if (reason == 'ERR_USER_CANCEL') {} else {
        alert("分享失败: " + reason);
      }
    });
  }

})

.controller('Acount', function($scope, $ionicHistory, $state, $http, ApiEndpoint, Userinfo) {
  $http.get(ApiEndpoint.url + '/User/GetUserInfo?_ajax_=1').success(function(data) {
    if (data.error == 0) {
      Userinfo.save(data.user_info);
      $scope.userinfo = Userinfo.l;
      $scope.userinfo.qq = Userinfo.l.qq != 'null' ? Userinfo.l.qq : '';
      $scope.userinfo.email = Userinfo.l.email != 'null' ? Userinfo.l.email : '';
      $scope.userinfo.mobile = Userinfo.l.mobile != 'null' ? Userinfo.l.mobile : '';
      $scope.userinfo.realname = Userinfo.l.realname != 'null' ? Userinfo.l.realname : '';
      $scope.userinfo.alipay = Userinfo.l.alipay != 'null' ? Userinfo.l.alipay : '';
    } else if (data.error == 9999) {
      alert('登录超时，请重新登录');
      $scope.login();
      $scope.flag = '';
      Userinfo.l.id = '';
      Userinfo.remove('flag');
      return;
    } else {
      alert(data.info)
    }
  })

  $scope.isActive = 'a';
  $scope.changeTab = function(evt) {
    var elem = evt.currentTarget;
    $scope.isActive = elem.getAttributeNode('data-active').value;
  };
  $scope.changeBasic = function() {
    $http.post(ApiEndpoint.url + '/UserInfo/ModifyContact?_ajax_=1', {
      'password': $scope.userinfo.password_person,
      'qq': $scope.userinfo.qq,
      'email': $scope.userinfo.email,
      'mobile': $scope.userinfo.mobile
    }).success(function(data) {
      $scope.showMsg(data.info);
      if (data.error == 0) {
        $scope.userinfo.password_person = '';
        $state.reload();
      }
    })
  };
  $scope.changePwd = function() {
    $http.post(ApiEndpoint.url + '/UserInfo/ModifyPassword?_ajax_=1', {
      'password': $scope.userinfo.password_change,
      'new_pass': $scope.userinfo.password,
      'repeat_pass': $scope.userinfo.password_repeat
    }).success(function(data) {
      $scope.showMsg(data.info);
      if (data.error == 0) {
        $scope.userinfo.password_change = '';
        $scope.userinfo.password = '';
        $scope.userinfo.password_repeat = '';
        $state.reload();
      }
    })
  };
  $scope.changeAcount = function() {
    $http.post(ApiEndpoint.url + '/UserInfo/ModifyFinancial?_ajax_=1', {
      'password': $scope.userinfo.password_acount,
      'realname': $scope.userinfo.realname,
      'alipay': $scope.userinfo.alipay
    }).success(function(data) {
      $scope.showMsg(data.info);
      if (data.error == 0) {
        $scope.userinfo.password_acount = '';
        $state.reload();
      }
    })
  };
  $scope.backGo = function() {
    $scope.userinfo.password_change = '';
    $scope.userinfo.password = '';
    $scope.userinfo.password_repeat = '';
    $scope.userinfo.password_acount = '';
    $scope.userinfo.password_person = '';
    $state.go('tab.user');
  }
})

.controller('Message', function($scope, $state, $timeout, ApiEndpoint, $http, Userinfo, $ionicHistory) {

  $scope.items = [];
  $scope.page = 1;
  $scope.load_over = true;

  $scope.flag = {
    showDelete: false
  };
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.deleteItem = function(k, id) {
    $scope.arrId = [];
    $scope.arrId.push(id);
    $scope.items.splice(k, 1);
    $http.post(ApiEndpoint.url + '/UserInfo/DeleteMessage?_ajax_=1', {
      msg_ids: $scope.arrId
    }).success(function(data) {
      if (data.error != 0) {
        alert(data.info);
      }
    });
  };
  $scope.loadMore = function() {
    $timeout(function() {
      $http.get(ApiEndpoint.url + '/UserInfo/GetMessages?_ajax_=1&p=' + $scope.page).success(function(data) {
        if (data.error == 0) {
          Userinfo.remove('unread_msg_count');
          if ($scope.page > data.page_count) {
            $scope.load_over = false;
            return;
          }
          $scope.items = $scope.items.concat(data.rows);
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else if (data.error == 9999) {
          alert('登录超时，请重新登录');
          $scope.login();
          $scope.flag = '';
          Userinfo.l.id = '';
          Userinfo.remove('flag');
          return;
        }
      });
    }, 200);
  };
})

.controller('Income', function($scope, $http, $state, ApiEndpoint, $timeout) {
  $scope.backGo = function() {
    $state.go('tab.user');
  };

  $scope.items = [];
  $scope.page = 1;
  $scope.load_over = true;

  $scope.load_more = function() {
    $timeout(function() {
      $http.get(ApiEndpoint.url + '/Account/GetIncomeJournalBook?_ajax_=1&p=' + $scope.page).success(function(data) {
        if (data.error == 0) {
          if ($scope.page > data.page_count) {
            $scope.load_over = false;
            return;
          }
          $scope.items = $scope.items.concat(data.rows);
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else if (data.error == 9999) {
          alert('登录超时，请重新登录');
          $scope.login();
          $scope.flag = '';
          Userinfo.l.id = '';
          Userinfo.remove('flag');
          return;
        }
      });
    }, 800);
  };
})

.controller('Welcome', function($scope, $ionicModal, $state) {
  $scope.guideFlag = 'a';
  $scope.guideSure = function() {
    $state.go('tab.index');
    window.localStorage['first'] = '1';
  };

  $scope.onSwipeLeft = function() {
    switch ($scope.guideFlag) {
      case 'a':
        $scope.guideFlag = 'b';
        break;
      case 'b':
        $scope.guideFlag = 'c';
        break;
      case 'c':
        $scope.guideFlag = 'd';
        break;
      case 'd':
        $scope.guideFlag = 'e';
        break;
      default:
        break;
    }
  };

})

.controller('Feedback', function($scope, $http, $timeout, ApiEndpoint, $ionicScrollDelegate, $ionicHistory) {
  $scope.feedbackData = {};
  $scope.send_arr = [];
  var myDate = new Date();
  $scope.items = [];
  $scope.page = 1;
  $scope.load_over = true;

  $scope.backGo = function() {
    $ionicHistory.goBack();
  };

  $scope.loadMore = function() {
    $timeout(function() {
      $http.get(ApiEndpoint.url + '/UserInfo/GetFeedbacks?_ajax_=1&p=' + $scope.page).success(function(data) {
        if (data.error == 0) {
          if ($scope.page > data.page_count) {
            $scope.load_over = false;
            return;
          }
          $scope.items = $scope.items.concat(data.rows);
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      });
    }, 200);
  };

  $scope.feedbackSend = function() {
    if (!$scope.feedbackData.send) {
      return
    } else {
      $http.post(ApiEndpoint.url + '/UserInfo/CreateFeedback?_ajax_=1', {
        message: $scope.feedbackData.send
      }).success(function(data) {
        if (data.error != 0) {
          alert(data.info);
        } else {
          $scope.send_arr[0] = {
            title: '',
            content: $scope.feedbackData.send,
            addtime: myDate.getFullYear() + '-' + (parseInt(myDate.getMonth()) + 1) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds()
          };
          $ionicScrollDelegate.scrollBottom(false);
          $scope.items = $scope.items.concat($scope.send_arr);
        }
      })
    }
  }

})

.controller('Exchange', function($scope, $state, $ionicHistory, $http, ApiEndpoint, $ionicLoading) {
  $scope.exchangeData = {};
  $scope.exchangeData.block = true;
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $http.get(ApiEndpoint.url + '/Account/Score2Money?_ajax_=1').success(function(data) {
    if (data.error == 0) {
      $scope.exchangeData.money = data.money,
      $scope.exchangeData.score = data.score;
      $scope.exchangeData.block = false;
    } else if (data.error == 9999) {
      alert('登录超时，请重新登录');
      $scope.login();
      $scope.flag = '';
      Userinfo.l.id = '';
      Userinfo.remove('flag');
      return;
    } else {
      $scope.exchangeData.msg = data.info;
      // if (data.diff) {
      //   $scope.exchangeData.msg = '亲，您还差' + data.diff + '个订单就可以兑换现金了，继续加油噢！'
      // }
    }
  });
  $scope.doExchange = function() {
    $ionicLoading.show({
      template: '数据提交中,请稍微...'
    });
    $http.get(ApiEndpoint.url + '/Account/Score2Money?_ajax_=1&t=1').success(function(data) {
      $ionicLoading.hide();
      if (data.error != 0) {
        alert(data.info);
        return;
      }
      alert('兑换成功');
      $ionicHistory.goBack();
    })
  }
})

.controller('WithdrawBalance', function($scope, $state, $ionicHistory, $http, ApiEndpoint, $ionicPopover, $timeout, $ionicLoading) {
  $scope.balanceDate = {};
  $scope.balanceDate.allin = false;
  $scope.backGo = function() {
    $ionicHistory.goBack();
  }
  $scope.showMsg = function(txt) {
    var template = '<ion-popover-view style="background-color:#ef473a !important" class="light padding">' + txt + '</ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function() {
      $scope.popover.hide();
    }, 1400);
  };
  $http.get(ApiEndpoint.url + '/Account/PrepareDrawJfb?_ajax_=1').success(function(data) {
    if (data.error == 9999) {
      alert('登录超时，请重新登录');
      $scope.login();
      $scope.flag = '';
      Userinfo.l.id = '';
      Userinfo.remove('flag');
      return;
    } else if (data.error != 0) {
      alert(data.info);
      $state.go('public.acount');
    }
    $scope.balanceDate.allmoney = data.jfb,
    $scope.balanceDate.allmoney100 = data.jfb ? parseFloat(data.jfb) / 100 : 0,
    $scope.balanceDate.money = data.money,
    $scope.balanceDate.alipay = data.alipay,
    $scope.balanceDate.time = data.time,
    $scope.balanceDate.token = data.token;

  });
  $scope.balanceSubmit = function() {
    if (!$scope.balanceDate.jfb && !$scope.balanceDate.allin) {
      $scope.showMsg('请输入金额');
      return;
    }
    if (!$scope.balanceDate.alipay) {
      $scope.showMsg('请输入支付宝');
      return;
    }
    if (!$scope.balanceDate.password) {
      $scope.showMsg('请输入可及登录密码');
      return;
    }
    $ionicLoading.show({
      template: '数据提交中,请稍后...'
    })
    $http.post(ApiEndpoint.url + '/Account/DrawJfb?_ajax_=1', {
      money: $scope.balanceDate.allin ? parseFloat($scope.balanceDate.allmoney / 100) : $scope.balanceDate.jfb,
      alipay: $scope.balanceDate.alipay,
      password: $scope.balanceDate.password,
      time: $scope.balanceDate.time,
      token: $scope.balanceDate.token
    }).success(function(data) {
      $ionicLoading.hide();
      if (data.error != 0) {
        $scope.showMsg(data.info)
      } else {
        alert('提现成功');
        $ionicHistory.goBack();
      }
    })
  }
})

.controller('WithdrawCash', function($scope, $ionicHistory, $http, ApiEndpoint, $state, $ionicPopover, $timeout, $ionicLoading) {
  $scope.cashDate = {};
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.showMsg = function(txt) {
    var template = '<ion-popover-view style="background-color:#ef473a !important" class="light padding">' + txt + '</ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });
    $scope.popover.show();
    $timeout(function() {
      $scope.popover.hide();
    }, 1400);
  };
  $http.get(ApiEndpoint.url + '/Account/PrepareDrawMoney?_ajax_=1').success(function(data) {
    if (data.error == 0) {
      $scope.cashDate.money = data.money,
      $scope.cashDate.alipay = data.alipay,
      $scope.cashDate.time = data.time,
      $scope.cashDate.token = data.token;
    };
    if (data.error == 10) {
      alert(data.info);
    };
    if (data.error == 20) {
      alert(data.info);
      $state.go('public.acount');
    };
    if (data.error == 21) {
      alert(data.info);
      $state.go('public.acount');
    };
    if (data.error == 9999) {
      alert('登录超时，请重新登录');
      $scope.login();
      $scope.flag = '';
      Userinfo.l.id = '';
      Userinfo.remove('flag');
      return;
    }
  }).error(function() {
    alert('网络超时，稍后再试');
  });
  $scope.cashSubmit = function() {
    if (!$scope.cashDate.withdrawmoney) {
      $scope.showMsg('请输入金额');
      return;
    };
    if (!$scope.cashDate.alipay) {
      $scope.showMsg('请输入支付宝账号');
      return;
    }
    if (!$scope.cashDate.password) {
      $scope.showMsg('请输入可及登录密码');
      return;
    }
    $ionicLoading.show({
      template: '数据提交中,请稍后...'
    })
    $http.post(ApiEndpoint.url + '/Account/DrawMoney?_ajax_=1', {
      money: $scope.cashDate.withdrawmoney,
      alipay: $scope.cashDate.alipay,
      password: $scope.cashDate.password,
      time: $scope.cashDate.time,
      token: $scope.cashDate.token
    }).success(function(data) {
      $ionicLoading.hide();
      if (data.error != 0) {
        $scope.showMsg(data.info);
      } else {
        alert('提现成功');
        $ionicHistory.goBack();
      }
    })
  }
})

.controller('Zhemai', function($scope, $sce, $ionicHistory) {
  $scope.targetUrl = $sce.trustAsResourceUrl('http://m.zhemai.com');
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
})

.controller('Invitation', function($scope, $ionicHistory, $state, $http, $timeout, ApiEndpoint, $cordovaClipboard, Userinfo) {
  $scope.items = [];
  $scope.page = 1;
  $scope.load_over = true;
  $scope.invData = {
    url: 'http://m2.cosjii.com/Index/Register?rec=' + Userinfo.l.id
  };
  $scope.friend = {
    total: Userinfo.l.friend_count,
    sum: Userinfo.l.friend_earn_sum
  };
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.goList = function() {
    $state.go('public.friend-list');
  };
  $scope.loadMore = function() {
    $timeout(function() {
      $http.get(ApiEndpoint.url + '/Account/GetMyFriends?_ajax_=1&p=' + $scope.page).success(function(data) {
        if (data.error == 0) {
          if ($scope.page > data.pageCount) {
            $scope.load_over = false;
            return;
          }
          $scope.items = $scope.items.concat(data.rows);
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else if (data.error == 9999) {
          alert('登录超时，请重新登录');
          $scope.login();
          $scope.flag = '';
          Userinfo.l.id = '';
          Userinfo.remove('flag');
          return;
        }
      });
    }, 200);
  };
  $scope.copyUrl = function() {
    $cordovaClipboard.copy($scope.invData.url)
      .then(function() {
        alert('成功复制到剪贴板');
      }, function() {
        alert('复制失败');
      });
  };

  $scope.webChatFriend = function() {
    Wechat.isInstalled(function(installed) {
      if (!installed) {
        alert("手机尚未安装微信应用");
      }
    });
    Wechat.share({
      message: {
        title: '用这个APP去淘宝购物最高可省钱50%，你也试试吧~',
        description: '可及返利',
        thumb: "http://m2.cosjii.com/img/logo_28.png",
        media: {
          type: Wechat.Type.LINK,
          webpageUrl: $scope.invData.url
        }
      },
      scene: Wechat.Scene.TIMELINE // share to Timeline
    }, function() {
      alert("分享成功");
    }, function(reason) {
      if (reason == 'ERR_USER_CANCEL') {
        return;
      }
      alert("分享失败: " + reason);
    });
  };

  $scope.webChat = function() {
    Wechat.isInstalled(function(installed) {
      if (!installed) {
        alert("手机尚未安装微信应用");
      }
    });
    Wechat.share({
      message: {
        title: '用这个APP去淘宝购物最高可省钱50%，你也试试吧~',
        description: '可及返利',
        thumb: "http://m2.cosjii.com/img/logo_28.png",
        media: {
          type: Wechat.Type.LINK,
          webpageUrl: $scope.invData.url
        }
      },
      scene: Wechat.Scene.SESSION // share to Timeline
    }, function() {
      alert("分享成功");
    }, function(reason) {
      if (reason == 'ERR_USER_CANCEL') {
        return;
      }
      alert("分享失败: " + reason);
    });
  };
})

.controller('ActiveBack', function($scope, $ionicHistory, $state, Userinfo) {
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.goShare = function() {
    if (Userinfo.l.flag != 1) {
      alert('请先登录');
      $scope.login();
      $scope.flag = '';
      Userinfo.l.id = '';
      Userinfo.remove('flag');
    } else {
      $state.go('public.orderlist');
    }
  }
})

.controller('StoreRebate', function($scope, $state, $ionicHistory, $http, ApiEndpoint, $timeout, Userinfo) {
  $scope.load_over = true;
  $scope.page = 1;
  $scope.items = [];
  $scope.items_l = [], $scope.items_c = [];
  $scope.backGo = function() {
    $ionicHistory.goBack();
  };
  $scope.loadMore = function() {
    $timeout(function() {
      $http.get(ApiEndpoint.url + '/Mall/GetMallList?_ajax_=1&rows=15&p=' + $scope.page).success(function(data) {
        if (data.error == 0) {
          if ($scope.page > data.pageCount) {
            $scope.load_over = false;
            return;
          }
          for (var i = 0; i < data.rows.length; i++) {
            if (i % 2 == 0) {
              $scope.items_l.push(data.rows[i]);
            } else {
              $scope.items_c.push(data.rows[i]);
            }
          }
          $scope.page++;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        } else if (data.error == 9999) {
          alert('登录超时，请重新登录');
          $scope.login();
          $scope.flag = '';
          Userinfo.l.id = '';
          Userinfo.remove('flag');
          return;
        }
      });
    }, 200);
  };

  $scope.goWin = function(url, title) {
    window.open(url, '_blank', 'location=yes', title);
  }

})