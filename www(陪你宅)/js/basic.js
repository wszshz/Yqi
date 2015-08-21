            /* This function runs once the page is loaded, but intel.xdk is not yet active */
            //$.ui.animateHeaders=false;
             var search=document.location.search.toLowerCase().replace("?","");
             //if(!search)
            $.ui.useOSThemes=true;
      
            
            var webRoot = "./";
            // $.os.android=true;
            $.ui.autoLaunch = true;
            $.ui.openLinksNewTab = false;
            $.ui.splitview=false;
            $.ui.slideSideMenu = false;
            $.ui.animateHeaders = false;
            $.ui.loadDefaultHash=false;

            $(document).ready(function(){
                //默认开启 青年打折卡UI
                  $("#afui").get(0).className='qndzk';

            });
            
             //document.addEventListener("deviceready", onDeviceReady, false);
             function FL_s(name){
                setItem('fl',name);
                $.ui.slideSideMenu = false;
                
        $.ui.showMask('正在定位');
      var geolocation1 = new BMap.Geolocation();
geolocation1.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
      
       // alert('您的位置：'+r.point.lng+','+r.point.lat);
    
    
    var longitude=r.point.lng;//经度
    var latitude=r.point.lat; //纬度

     
         $.jsonP({                                       
                                url:'http://api.map.baidu.com/geosearch/v3/nearby?ak='+ ak +'&geotable_id='+ geotable_id +'&location='+longitude+','+latitude+'&radius=500&tags='+ getItem('fl') +'&sortby=distance:1|pm:1', 
                                timeout:"5000",
                                success:function(data){ 

                                //alert(data);                                
                                    if(data.status==0){

                                        //alert(data.message); 
                                        var jsondata=data;
                                        var str='';
                                        if(jsondata.total==0){
                                            str+='<li style="text-align: center;border:none;">周边没有合作商家,请通过意见反馈提交您需要打折的店铺,我们会为您努力！ฅ( ̳• ◡ • ̳)ฅ</li>';
                                        }else{
                                            str+='<li style="text-align: center;">主人！我搜到'+data.total+'家合作店铺哟~</li>';
                                        }
                                        
                                        for(var i=0;i<jsondata.total;i++){
                                          if(typeof(data.contents[i]['logo'])!="undefined"){
                                             str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+data.contents[i]['logo']+'"/></div><div style="margin-top: -50px;margin-left: 60px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size:13px;">'+data.contents[i]['ms']+'</text><br/><text style="color: rgb(255,163,0);">[距离主人：'+data.contents[i]['distance']+'米]</text></div></li>';
                                          }else{
                                            str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+serverURL+'/app/img/pic/blank_logo.png"/></div><div style="margin-top: -50px;margin-left: 60px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size:13px;">'+data.contents[i]['ms']+'</text><br/><text style="color: rgb(255,163,0);">[距离主人：'+data.contents[i]['distance']+'米]</text></div></li>';
                                          }
                                           
                                        }  
                                        
                                        $('#business_result').html(str);  
                                        $.ui.hideMask();                                
                                        //$('#vip').val(vip);
                                    }else{  
                                      $.ui.hideMask(); 
                                       showPopup('搜索失败'); 
                                       

                                       
                                    }
                                }
                            });
        
    }
    else {//失败的回调函数        
    //错误回调    
        
    //alert('failed'+this.getStatus());
    }        
},{enableHighAccuracy: true});
                 $("#myTestPopup").trigger("close");
             }
             function FL(){

                $.query("#afui").popup({
        message:'<div id="show">正在加载</div>',
        cancelText:"选好了摸？",
        cancelOnly:true,
        id:'myTestPopup',
        suppressTitle:true
  });
                
                $("#myTestPopup").css("top", "50.57142857142857px");
                $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=list_fl&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                  
                                        var jsondata=data;
                                       var str='<div style="margin-left: -20px;">';
                                       
                                       for(var i=0;i<jsondata.length;i++){
                                            str+='<span onclick="FL_s(\''+jsondata[i].name+'\');" style="margin-left: 20px;">'+jsondata[i].name+'</span>';
                                        } 
                                        str+='</div>'; 
                                         $('#show').html(str);
                                    
                                }
                            }); 
                

                

             }
    function load_schoollist(){
      $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=list_school&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                        var jsondata=data;
                                       var str="";
                                       
                                       for(var i=0;i<jsondata.length;i++){
                                            str+='<option value="'+jsondata[i].Id+'">'+jsondata[i].name+'</option>';
                                        }  
                                         $('#01_school_select').html(str);
                                         $('#02_school_select').html(str);
                                        $('#03_school_select').html(str);

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    
                                }
                            }); 
    }
    function get_school(){
       $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=list_school&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                      setItem('schoollist',JSON.stringify(data));
                                     
                                    
                                }
                            }); 
    }
    function gold_load(){
      $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=list_gold&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                        var jsondata=data;
                                       var str='<div class="scroll" style="width: 320px;">';
                                       str+='<div class="slide_01" id="slide_01" style="width: 320px; overflow: hidden;"><div style="overflow: hidden; zoom: 1; "><div style="float: left; overflow: hidden; zoom: 1;">';
                                       setItem('ad_length',jsondata.length);
                                       for(var i=0;i<jsondata.length;i++){
                                            str+='<div class="mod_01"><a href="JavaScript:yd('+jsondata[i].wz_id+');"><img src="'+serverURL+'/qndzkcx/Public/Uploads/'+jsondata[i].url+'" style="width: 320px; height:80px;"  class=""></a></div>';
                                        }  
                                        str+='</div></div></div><div class="dotModule_new"><div id="slide_01_dot">';
                                         for(var i=0;i<jsondata.length;i++){
                                            str+='<span class="dotItem" title="第'+ i +'页">';
                                        }  
                                        str+='</div></div></div>';
                                         $('#gold_ad').html(str);

                                        
            $(".scroll,.mod_01 img").css("width", $(window).width() + "px");
        
        var page = $("#slide_01").length;
        if (document.getElementById("slide_01")) {
            var slide_01 = new ScrollPic();
            slide_01.scrollContId = "slide_01"; //内容容器ID
            slide_01.dotListId = "slide_01_dot";//点列表ID
            slide_01.dotOnClassName = "selected";
            slide_01.arrLeftId = "sl_left"; //左箭头ID
            slide_01.arrRightId = "sl_right";//右箭头ID
            slide_01.frameWidth = $(window).width();
            slide_01.pageWidth = $(window).width();
            slide_01.upright = false;
            slide_01.speed = 10;
            slide_01.space = 30;
            slide_01.autoPlayTime = 5;//自动播放时间
            slide_01.pageNumber = jsondata.length;//页面统计
            slide_01.initialize(); //初始化
        }

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    
                                }
                            }); 
    }
   
                    function getPosition1(longitude,latitude){
        
    
        // 百度地图API功能
        var map = new BMap.Map("map1");
        var point = new BMap.Point(longitude,latitude);
        var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            var label = new BMap.Label("当前位置！",{offset:new BMap.Size(20,-10)});
            marker.setLabel(label); //添加百度label
            map.setCenter(point);
        map.centerAndZoom(point,18);

        map.enableScrollWheelZoom();
       
       
   
        var gc = new BMap.Geocoder();    
        
        gc.getLocation(point, function(rs){
                var addComp = rs.addressComponents;
                

                //showPopup(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
            });      
            
    }
     function xuanqu(){
        showPopup({message:'<div style="margin-left: -20px;"><span style="margin-left: 20px;">团结镇</span><span style="margin-left: 20px;">红光区</span><span style="margin-left: 20px;">金牛区</span></div>',suppressTitle:true,cancelOnly:true,cancelText:"选好了摸？"});
     }
    function search_dm(text){
        if(text==""){
            showPopup('_(:з」∠)_ ..');
        }else{
            $.jsonP({                                       
                                url:'http://api.map.baidu.com/geosearch/v3/local?ak='+ ak +'&geotable_id='+ geotable_id +'&q='+text+'&sortby=distance:1|pm:1', 
                                timeout:"5000",
            error:function(data){
                $.ui.showMask('加载失败');
                            window.setTimeout(function () {
                                $.ui.hideMask();
                            }, 2000);

            },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.status==0){
                                        //alert(data.message); 
                                        var jsondata=data;
                                        var str='';
                                        if(jsondata.total==0){
                                            str+='<li style="text-align: center;">哎哟！没找到喵~~</li>';
                                          }else{
                                            str+='<li style="text-align: center;">找到了喵~~</li>';
                                        
                                        }
                                        
                                        for(var i=0;i<jsondata.total;i++){
                                         
                                          if(typeof(data.contents[i]['logo'])!="undefined"){
                                             str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+data.contents[i]['logo']+'"/></div><div style="margin-top: -50px;margin-left:60px;margin-bottom: 5px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size: 13px;">'+data.contents[i]['ms']+'</text></div></li>';
                                          }else{
                                            str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+serverURL+'/app/img/pic/blank_logo.png"/></div><div style="margin-top: -50px;margin-left:60px;margin-bottom: 5px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size: 13px;">'+data.contents[i]['ms']+'</text></div></li>';
                                          }
                                           
                                        }  
                                        
                                        $('#search_dm').html(str);  
                                        $.ui.hideMask();                                
                                        //$('#vip').val(vip);
                                    }else{  
                                       showPopup('搜索失败'); 
                                       

                                       
                                    }
                                }
                            });
        }
      
    }
    function locat(){
      setItem('fl','');
        $.ui.slideSideMenu = false;
                
        $.ui.showMask('正在定位');
      var geolocation1 = new BMap.Geolocation();
geolocation1.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
      
       // alert('您的位置：'+r.point.lng+','+r.point.lat);
    
    
    var longitude=r.point.lng;//经度
    var latitude=r.point.lat; //纬度

     
         $.jsonP({                                       
                                url:'http://api.map.baidu.com/geosearch/v3/nearby?ak='+ ak +'&geotable_id='+ geotable_id +'&location='+longitude+','+latitude+'&radius=500&tags='+ getItem('fl') +'&sortby=distance:1|pm:1', 
                                timeout:"5000",
                                success:function(data){ 

                                //alert(data);                                
                                    if(data.status==0){

                                        //alert(data.message); 
                                        var jsondata=data;
                                        var str='';
                                        if(jsondata.total==0){
                                            str+='<li style="text-align: center;border:none;">周边没有合作商家,请通过意见反馈提交您需要打折的店铺,我们会为您努力！ฅ( ̳• ◡ • ̳)ฅ</li>';
                                        }else{
                                            str+='<li style="text-align: center;">主人！我搜到'+data.total+'家合作店铺哟~</li>';
                                        }
                                        
                                        for(var i=0;i<jsondata.total;i++){
                                          if(typeof(data.contents[i]['logo'])!="undefined"){
                                             str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+data.contents[i]['logo']+'"/></div><div style="margin-top: -50px;margin-left: 60px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size:13px;">'+data.contents[i]['ms']+'</text><br/><text style="color: rgb(255,163,0);">[距离主人：'+data.contents[i]['distance']+'米]</text></div></li>';
                                          }else{
                                            str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+serverURL+'/app/img/pic/blank_logo.png"/></div><div style="margin-top: -50px;margin-left: 60px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size:13px;">'+data.contents[i]['ms']+'</text><br/><text style="color: rgb(255,163,0);">[距离主人：'+data.contents[i]['distance']+'米]</text></div></li>';
                                          }
                                           
                                        }  
                                        
                                        $('#business_result').html(str);  
                                        $.ui.hideMask();                                
                                        //$('#vip').val(vip);
                                    }else{  
                                      $.ui.hideMask(); 
                                       showPopup('搜索失败'); 
                                       

                                       
                                    }
                                }
                            });
        
    }
    else {//失败的回调函数        
    //错误回调    
        
    //alert('failed'+this.getStatus());
    }        
},{enableHighAccuracy: true});
    }
    
          ///获取商家列表
            function bmap_flist(){

                setItem('flist_page','0');
              $.ui.slideSideMenu = true;
              var geolocation = new BMap.Geolocation();
              
geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
      
       
    
    
    var longitude=r.point.lng;//经度
    var latitude=r.point.lat; //纬度
    getPosition1(longitude,latitude);
        
        
        
    }
    else {//失败的回调函数        
    //错误回调    
        
    //alert('failed'+this.getStatus());
    }        
},{enableHighAccuracy: true});

                
                 $.jsonP({                                       
                                url:'http://api.map.baidu.com/geosearch/v3/local?ak='+ ak +'&geotable_id='+ geotable_id +'&region=&page_index='+getItem('flist_page')+'&sortby=distance:1|pm:1', 
                                timeout:"5000",
            error:function(data){
                $.ui.showMask('加载失败');
                            window.setTimeout(function () {
                                $.ui.hideMask();
                            }, 2000);

            },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.status==0){
                                        //alert(data.message); 
                                        var jsondata=data;
                                        var str='';
                                        setItem('main_total',Math.ceil(data.total/10)-1);
                                        
                                        str+='<span>合作店铺</span>';
                                        for(var i=0;i<JSONLength(data.contents);i++){
                                         
                                          if(typeof(data.contents[i]['logo'])!="undefined"){
                                             str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+data.contents[i]['logo']+'"/></div><div style="margin-top: -50px;margin-left: 60px;margin-bottom: 5px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size: 13px;">'+data.contents[i]['ms']+'</text></div></li>';
                                          }else{
                                            str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+serverURL+'/app/img/pic/blank_logo.png"/></div><div style="margin-top: -50px;margin-left: 60px;margin-bottom: 5px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size: 13px;">'+data.contents[i]['ms']+'</text></div></li>';
                                          }
                                           
                                        }  
                                        
                                        $('#result').html(str);  
                                        $.ui.hideMask();                                
                                        //$('#vip').val(vip);
                                    }else{  
                                       showPopup('搜索失败'); 
                                       

                                       
                                    }
                                }
                            });
    }
    function locat_1(){
        
      $.ui.toggleNavMenu();
       $.ui.slideSideMenu = false;
                
        $.ui.showMask('正在定位');
      var geolocation1 = new BMap.Geolocation();
geolocation1.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
      
       // alert('您的位置：'+r.point.lng+','+r.point.lat);
    
    
    var longitude=r.point.lng;//经度
    var latitude=r.point.lat; //纬度

     
         $.jsonP({                                       
                                url:'http://api.map.baidu.com/geosearch/v3/nearby?ak='+ ak +'&geotable_id='+ geotable_id +'&location='+longitude+','+latitude+'&radius=500&tags='+ getItem('fl') +'&sortby=distance:1|pm:1', 
                                timeout:"5000",
                                success:function(data){ 

                                //alert(data);                                
                                    if(data.status==0){

                                        //alert(data.message); 
                                        var jsondata=data;
                                        var str='';
                                        if(jsondata.total==0){
                                            str+='<li style="text-align: center;border:none;">周边没有合作商家,请通过意见反馈提交您需要打折的店铺,我们会为您努力！ฅ( ̳• ◡ • ̳)ฅ</li>';
                                        }else{
                                            str+='<li style="text-align: center;">主人！我搜到'+data.total+'家合作店铺哟~</li>';
                                        }
                                        
                                        for(var i=0;i<jsondata.total;i++){
                                          if(typeof(data.contents[i]['logo'])!="undefined"){
                                             str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+data.contents[i]['logo']+'"/></div><div style="margin-top: -50px;margin-left: 60px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size:13px;">'+data.contents[i]['ms']+'</text><br/><text style="color: rgb(255,163,0);">[距离主人：'+data.contents[i]['distance']+'米]</text></div></li>';
                                          }else{
                                            str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+serverURL+'/app/img/pic/blank_logo.png"/></div><div style="margin-top: -50px;margin-left: 60px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size:13px;">'+data.contents[i]['ms']+'</text><br/><text style="color: rgb(255,163,0);">[距离主人：'+data.contents[i]['distance']+'米]</text></div></li>';
                                          }
                                           
                                        }  
                                        
                                        $('#business_result').html(str);  
                                        $.ui.hideMask();                                
                                        //$('#vip').val(vip);
                                    }else{  
                                      $.ui.hideMask(); 
                                       showPopup('搜索失败'); 
                                       

                                       
                                    }
                                }
                            });
        
    }
    else {//失败的回调函数        
    //错误回调    
        
    //alert('failed'+this.getStatus());
    }        
},{enableHighAccuracy: true});
    }
    
          
         

            function showHide(obj, objToHide) {
                var el = $("#" + objToHide)[0];

                if (obj.className == "expanded") {
                    obj.className = "collapsed";
                } else {
                    obj.className = "expanded";
                }
                $(el).toggle();

            }


              // app.initialize();  //app 加载

              function sushebh_load(Id,title){
                $.ui.showMask('正在拼命加载哟！');
                $.ui.loadContent('sushebh_page');
                 $.ui.setTitle(title);
                  $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=search_huocun&Id='+Id+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);     
                                   setItem('dqss',JSON.stringify(data));
                               jiazaidqss(Id);

                
                
                       
                    
               

                                }
                            }); 
              }
              function jiazaidqss(Id){
                var jsondata=JSON.parse(getItem('dqss'));
                var str='';

                var splist = JSON.parse(getItem('splist_on'));
                    for(var a=0;a<=splist.length;a++){
                      if(jsondata[a]>=0){
                        str+='<li style="text-align: center; color:gray;">'+splist[a-1].name+'<div style="float:right; margin-top:0px;"><span onclick="xiugaihuocun('+ a +','+jsondata[a]+',\''+splist[a-1].name+'\');" class="button" style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[a]+splist[a-1].dw+'</span></div></li>'; 
                      }
                    
                }   
                str+='<a class="button block" onclick="fsxgqq();">确定修改</a>';
                str+='</ul>';  
                $('#sushebh_list').html(str);
                $.ui.hideMask();
              }
              function fsxgqq(){
                $.ui.showMask('正在拼命加载哟！');
                var string_dqss = JSON.parse(getItem('dqss'));
                $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=fsxgqq&string_dqss='+JSON.stringify(string_dqss)+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                  if(data.success != false){
                                    showPopup('修改成功!');
                                     $.ui.hideMask();
                                  }

                                }
                            }); 
              }
    
              function xiugaihuocun(sp_Id,gs,name){
                var dqss = JSON.parse(getItem('dqss'));

                 $.query("#afui").popup({
        title:"修改库存",
        message:name+":"+gs+"<br/>修改货存:<input type=text id=dqxg>",
        cancelText:"取消",
        cancelCallback: function(){console.log("cancelled");},
        doneText:"确定修改",
        doneCallback: function(){
          dqss[sp_Id] = $('#dqxg').val();
           setItem('dqss',JSON.stringify(dqss));
           jiazaidqss();
        },
        cancelOnly:false,
        doneClass:'button',
        cancelClass:'button',
        onShow:function(){console.log("showing popup");},
        autoCloseDone:true, //default is true will close the popup when done is clicked.
        suppressTitle:false //Do not show the title if set to true
  });

              }
              function sushe_load(){
                $.ui.showMask('正在拼命加载哟！');
                get_school();
                $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=sushe_load&vip='+getItem('vip')+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);     
                                var schoollist = JSON.parse(getItem('schoollist'));
                                var str='';                           
                                   for(var i=0;i<data['building_count'];i++){

                                    for(var a=0;a<schoollist.length;a++){ //循环判断校区名称
                                      if(data['building_select'][i]['cid'] == schoollist[a]['Id']){
                                        data['building_select'][i]['cid'] = schoollist[a]['name'];
                                      }
                                    }
                                    
                                    
                    str+='<li><a href="JavaScript:sushebh_load(\''+data['building_select'][i]['Id']+'\''+','+'\''+data['building_select'][i]['building']+'栋'+data['building_select'][i]['number']+'\');">【'+data['building_select'][i]['cid']+'】'+data['building_select'][i]['building']+'栋'+data['building_select'][i]['number']+'</a></li>';
                }               
                $('#sushe_list').html(str);
                $.ui.hideMask();

                                }
                            }); 
              }
              function ddtj_load(){
                $.ui.showMask('正在拼命加载哟！');
                
                $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=search_wish&vip='+getItem('vip')+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                               var schoollist = JSON.parse(getItem('schoollist'));
                               var splist = JSON.parse(getItem('splist_on'));
                                var str='';    
                                      
                                      
                                
                                  for(var i=0;i<data.length;i++){
                                   
                                    
                                    for(var a=0;a<schoollist.length;a++){ //循环判断校区名称
                                      if(data[i].school == schoollist[a]['Id']){
                                        data[i]['school'] = schoollist[a]['name'];
                                      }
                                    }
                                    
                                    if(data[i].wish_data !=null){
                                      str+='<li>补货订单号:'+data[i].wish_data[0].Id+'【'+data[i]['school']+'】'+data[i]['building']+'栋'+data[i]['number'];
                    for (var b = 1; b < splist.length+1; b++) {
                      if (data[i]['wish_data'][0][b] != 0) {
                        str+='<br/>'+splist[b-1]['name']+data[i]['wish_data'][0][b]+splist[b-1]['dw'];
                      }
                      
                    }
                    str+='<br/><span class="button" onclick="wanchengbh(\''+data[i]['wish_data'][0]['Id']+'\');">完成补货</span>';
                    str+='</li>';
                                    }
                    

                }         
                  
                $('#wish_list').html(str);
                $.ui.hideMask();

                                
                                }            
                                   
                            }); 
              }
              //完成补货
              function wanchengbh(Id){
                $.ui.showMask('正在拼命加载哟！');
                $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=wcbh_wish&wish_id='+Id+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                $.ui.hideMask();
                                showPopup('补货成功!');
                                ddtj_load();

                                }
                            }); 
              }

  

   
                    //下单前的检测
                    function msxd(){
                      $.ui.showMask('正在拼命加载哟！<br/> > 3 <');
                      $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=msxd_jc&vip='+getItem('vip')+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                        showPopup('请先申请陪你宅御用箱子！<br/> (๑•̀ㅂ•́)'); 
                                        $.ui.hideMask();                                   
                                        //$('#vip').val(vip);
                                    }else{  
                                       showPopup('欢迎选购哟！<br/>(´,,•∀•,,`)'); 

                                       $.ui.loadContent('#xzsppage',true,true,'flip');
                                       $.ui.hideMask();  

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 
                    }
                    //吃货圈
                    function chq_content(){
                       $.ui.loadContent('chqpage',true,true,'fade');
                    }
                    //我的
                    function my_content(){
                      $.ui.loadContent('afuidemo',true,true,'slide');


                    }
                    //青年卡页面
                    function ynk_content(){
                      $.ui.loadContent('ynkpage',true,true,'fade');
                    }
                    //陪你宅 页面
                    function pnz_content(){
                      $.ui.loadContent('pnzpage',true,true,'up');
                    }
                    //退出登录
                    function outlogin(){
                      setItem('manage','');
                      setItem('cid','');
                            setItem('phone','');
                            setItem('vip','');
                            setItem('charge','');
                            setItem('value','');
                            setItem('overtime','');
                            setItem('photo','');
                            setItem('auto','0');//取消自动登录
                            setItem('autovip','');
                            setItem('autopassword','');
                            setItem('address','');
                            setItem('school','');
                            setItem('building','');
                            setItem('number','');
                    $.ui.loadContent('test',true,true,'fade');
                    $.ui.loadContent('afuidemo',true,true,'fade');
                    $("#outlogin_button_div").hide();
                    $("#manager").hide();
                   }
                   //检查 打折卡办理 页面
                   function checkvip_dzkbl(){
                     if(getItem('vip')!=''&&getItem('vip')){
                            $.ui.loadContent('wode_dzkpage');
                        }else{
                            showPopup('请先登录您的账号！');
                     }
                   }
                   //检查 用户是否登录 订单页面
                   function checkvip_dd(){
                     if(getItem('vip')!=''&&getItem('vip')){
                            $.ui.loadContent('ddpage');
                        }else{
                            showPopup('请先登录您的账号！');
                     }
                   }
                   //检查 用户是否登录 订单页面
                   function checkvip_dzk(){
                     if(getItem('vip')!=''&&getItem('vip')){
                      if(getItem('overtime')!='2015-03-06'){
                        dzk_bl();
                      }else{
                        showPopup('您使用的是永久卡无需重复办理');
                      }
                            
                        }else{
                            showPopup('请先登录您的账号！');
                     }
                   }
                   //检查 意见反馈 订单页面
                   function checkvip_yjfk(){
                     if(getItem('vip')!=''&&getItem('vip')){
                            $.ui.loadContent('yjfk');
                        }else{
                            showPopup('请先登录您的账号！');
                     }
                   }
                   //检查 用户是否登录 充值页面
                   function checkvip_cz(){
                     if(getItem('vip')!=''&&getItem('vip')){
                      $.ui.toggleNavMenu();
                            $.ui.loadContent('czpage');
                        }else{
                            showPopup('请先登录您的账号！');
                     }
                   }
                   //检查 用户是否登录 修改密码页面
                   function checkvip_cPwd(){
                     if(getItem('vip')!=''&&getItem('vip')){
                            $.ui.loadContent('c_Pwdpage');
                        }else{
                            showPopup('请先登录您的账号！');
                     }
                   }
                   //定位api
                   function location_api(){
                    $.ui.loadContent('af',false,false,'down');
                   }
                   //检查 用户是否登录 上传实名制照片页面
                   function checkvip_smz(){
                     if(getItem('vip')!=''&&getItem('vip')){
                            $.ui.loadContent('smz_picture');
                        }else{
                            showPopup('请先登录您的账号！');
                     }
                   }
                   //切换到登录页面
                   function turntologin(){
                    if(getItem('auto')=='1'){
                        userlogin(getItem('autovip'),getItem('autopassword'));
                    }else{
                        $.ui.loadContent('registerandlogin',false,false,'flip');
                    }
                   }
                   //清除修改密码页面的密码记录
                   function clear_Pwd(){
                    $('#old_password').val("");
                    $('#new_password').val("");
                    $('#new_password_1').val("");
                   }
                   //修改密码
                   function c_Pwd(){
                    var old_password = $('#old_password').val();
                    var new_password = $('#new_password').val();
                    var new_password_1 = $('#new_password_1').val();
                    var new_sha = hex_sha1(new_password);
                    var old_sha = hex_sha1(old_password);
                    var vip =getItem('vip');

                    
                    if(new_password != new_password_1){
                        showPopup('两次输入的密码不一致');
                    }else{
                        $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=c_Pwd&vip='+vip+'&oldpassword='+old_sha+'&newpassword='+new_sha+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                        showPopup('旧密码错误！');                                    
                                        //$('#vip').val(vip);
                                    }else{  
                                       showPopup('密码修改成功！'); 
                                       $.ui.loadContent('#afuidemo');

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 

                    }
                   }
                  
                   //意见反馈 提交
                   function yjfk_up(text){
                    var vip =getItem('vip');
                    $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=yjfk_up&vip='+vip+'&text='+text+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                                                         
                                        //$('#vip').val(vip);
                                    }else{  
                                        
                                       showPopup('您的宝贵意见我们已经收到！'); 
                                       $.ui.loadContent('#afuidemo');

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 
                   }
                   //取消订单 陪你宅
                   function pnzdd_del(dd){
                   
                    $.ui.showMask('正在加载');
                    var dd_id = dd;
                    $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=pnzdd_del&&dd_id='+dd_id+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                                                         
                                        //$('#vip').val(vip);
                                    }else{  
                                        $.ui.hideMask();
                                       showPopup('订单已取消！'); 
                                       $.ui.loadContent('#afuidemo');

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 
                   }
                   //取消订单 操作
                   function paydd_del(dd){
                    var vip =getItem('vip');

                    var dd_id =getItem('dd_id');
                    if(dd != ''){
                        dd_id = dd;

                    }
                    $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=paydd_del&vip='+vip+'&dd_id='+dd_id+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                                                         
                                        //$('#vip').val(vip);
                                    }else{  
                                        
                                       showPopup('订单已取消！'); 
                                       $.ui.loadContent('#afuidemo');

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 
                   }
                   // 成功支付 打折卡操作
                   function dzk_paysuccess(dd){
                    var vip =getItem('vip');

                    var dd_id =getItem('dd_id');
                    if(dd != ''){
                        dd_id = dd;

                    }
                    $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=dzk_paysuccess&vip='+vip+'&dd_id='+dd_id+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                        showPopup('余额不足！');                                    
                                        //$('#vip').val(vip);
                                    }else{  
                                        setItem('r_charge','1');
                                       showPopup('打折卡办理成功！'); 
                                       $.ui.loadContent('#afuidemo');

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 
                   }
                   function qupingfen(){
                    window.open('https://itunes.apple.com/cn/app/pei-ni-zhai/id972972540?mt=8','_system','location=yes');
                   }
                   // 成功支付 操作
                   function pay_success(dd,pay){
                    var sexval_value = $('input[name="pay_fs'+dd+'"]:checked').val();
                    var vip =getItem('vip');
                    var dd_id =dd;
                    var dd_pay=pay;
                    if(sexval_value == 1){
                      alipay_plugin([dd_pay,dd_id],function(success){
                       
                        
                                    if(success['result'] === "6001"){
                                    showPopup('您取消了付款,如果支付宝没有余额,请选择管理员收款的方式..喵~~');
                                    }else if(success['result']==="8000"){
                                    showPopup('支付宝正在处理中...');
                                  }else if(success['result']==="9000"){
                                    $.jsonP({                                       
                                          url:serverURL+'/qndzkcx/index.php?a=alipay_result&dd_id='+dd_id+'&state=1&callback=?', 
                                          success:function(data){ 
                                            xzspload();
                                              pnz_listfn_1();
                                              pnz_listfn();
                                              
                                                 
                                              
                                              }
                                          
                                      });
                                              xzspload();
                                              pnz_listfn_1();
                                              pnz_listfn();
                                              showPopup('支付成功哟！');
                                    }else if(success['result']==="4000"){
                                    showPopup('订单支付失败,请重试');
                                    }else if(success['result']==="6002"){
                                    showPopup('世界上最远的距离就是没有网,请检查网络设置再重试');
                                    }
                                    
                      },function(error){
                       showPopup('未知错误');
                      });
                      
                    }else if(sexval_value == 2){
                      $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=manager_result&dd_id='+dd_id+'&state=2&callback=?', 
                                success:function(data){ 
                                  xzspload();
                                    pnz_listfn_1();
                                    pnz_listfn();
                                        
                                       
                                    
                                    }
                                
                            });
                    }else{
                    }
                    
                   
                            
                      
                   }
                   //加载支付页面 接口
                   function load_pay(){
                    showPopup('下单成功！请尽快支付！');
                    var vip =getItem('vip');
                    var pay_1 =getItem('pay');
                    var kind = getItem('kind');
                    $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=new_pay&vip='+vip+'&pay='+pay_1+'&kind='+kind+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                        showPopup(data['result']);                                    
                                        //$('#vip').val(vip);
                                    }else{  
                                        setItem('dd_id',data['id']);
                                        var pay = '<ul class="list inset" style="border-radius:20px; margin-bottom:50px;margin-top:20px;">';
                                         pay +='<li style="text-align: center; color:gray;">订单号:'+getItem('dd_id')+'</li>'; 
                                        if(kind=='cz'){
                                            pay +='<li style="text-align: center; color:gray;">交易类型: 账户充值</li>'; 
                                            pay +='<li style="text-align: center; color:rgb(255, 153, 0);">金额: '+getItem('pay')+' 元</li>'; 
                                        pay +='<li style="text-align: center; color:gray;">付款方式: <br/><br/><img src="img/pic/alipay.gif"/></li>';
                                        pay +='<a onclick="pay_success('+data['id']+');" class="button block" style="margin:15px; border-color:rgb(255, 153, 0); color:rgb(255, 153, 0);">立即支付</a>';
                                        pay+='</ul>';
                                        $('#pay_label').html(pay);
                                        }
                                        if(kind=='dzk'){
                                            pay +='<li style="text-align: center; color:gray;">交易类型: 打折卡办理</li>'; 
                                            pay +='<li style="text-align: center; color:rgb(255, 153, 0);">金额: '+getItem('pay')+' 元</li>'; 
                                        pay +='<li style="text-align: center; color:black;">付款方式: 账户余额</li>';
                                        pay +='<a onclick="dzk_paysuccess('+data['id']+');" class="button block" style="margin:15px; border-color:rgb(255, 153, 0); color:rgb(255, 153, 0);">立即支付</a>';
                                        pay+='</ul>';
                                        $('#pay_label').html(pay);
                                        }
                                        
                                       
                                      

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 
                   }
                    function user_overtime(){
                        if(getItem('value')!=''&&getItem('value')){
                            var over_value = getItem('value');
                            var over_time = getItem('overtime');
                            $('#wode_cishu').html(over_value); 
                            $('#wode_overtime').html(over_time); 
                        }

                    }
                    function loadsqxz(){
                      $.ui.loadContent('#sqxzpage');
                    }
                    //陪你宅 地址显示
                    function idtoschool(id){
                      var id =id;
                      $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=idtoschool&id='+id+'&callback=?', 
            timeout:"5000",
            success:function(data){  
            var rdata=data;  
            setItem('school_name',rdata.name);
              
            }
        }); 
                    }
                    function pdtz(){
                      if(getItem('building')!=''&&getItem('building')!='null'&&getItem('building')!=undefined){
                        $.ui.loadContent('#xzsppage',false,false,"none");
                        
                      }else{
                        $.ui.loadContent('#pnzpage',false,false,"none");
                       }
                       
                    }
                    function pnzpanelload(){
                      $.ui.showMask('正在加载..');
                       
                       $.ui.slideSideMenu = false;


                       var s = getItem('school');
                       idtoschool(s);
                       var a =getItem('school_name');
                       
                     
                       
                       var content='<p style="margin-top:20px;margin-left: 10px;margin-right: 10px;">动动手指，送货上门，先吃再给钱！<br/>客官您好：<br/>我们是成都陪你宅科技有限公司，通过菜单选择你要的零食并在线付款, 我们会定期给零食箱补货，同时清点上星期消费的情况，当然，如果箱子没货了，也可以拨打电话给我们，我们会及时给您补货。投诉、建议、补货电话请拨打13330857122.</p>';
                       content+='<a id="reg_button" class="button block" onclick="$.ui.loadContent(\'registerpage01\');" style="margin-bottom:30px;margin-left: 20px;margin-right: 20px;margin-top: 20px;">注册</a>';
                        $('#pnz_div').html(content);


                      
          $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=splist&callback=?', 
            timeout:"5000",
                  error:function(data){
                  showMask('喵~ 网络不通畅哟~');
                  },
           
            
            success:function(data){             
                
               
                var jsondata=data;
                var str='<span>商品详单</span>';
                $.ui.hideMask();
                for(var i=0;i<jsondata.length;i++){
                    str+='<li onclick="show_sp(\''+jsondata[i].photo+'\',\''+jsondata[i].name+'\');"><img width="100px" height="80px" src="http://www.qndzk.com/qndzkcx/Public/Uploads/'+jsondata[i].photo+'"><a class="bus" style="color: gray; margin-left:20px;font-size: 15px;">'+jsondata[i].name+'   ￥'+jsondata[i].pay+'/'+jsondata[i].dw+'</a></li>';
                }               
                $('#splist').html(str);
                $.ui.hideMask();
             
                 

            }
        }); 

                    }
                    //保留两位小数   
        //功能：将浮点数四舍五入，取小数点后2位  
        function toDecimal(x) {  
            var f = parseFloat(x);  
            if (isNaN(f)) {  
                return;  
            }  
            f = Math.round(x*100)/100;  
            return f;  
        }  
  
  
        //制保留2位小数，如：2，会在2后面补上00.即2.00  
        function toDecimal2(x) {  
            var f = parseFloat(x);  
            if (isNaN(f)) {  
                return false;  
            }  
            var f = Math.round(x*100)/100;  
            var s = f.toString();  
            var rs = s.indexOf('.');  
            if (rs < 0) {  
                rs = s.length;  
                s += '.';  
            }  
            while (s.length <= rs + 2) {  
                s += '0';  
            }  
            return s;  
        }  
          
        function fomatFloat(src,pos){     
             return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);     
        }  
        function allpay(){
          
          $.ui.slideSideMenu = false;
          $.ui.showMask('正在拼命加载中...');
          
          //从数据库获取splist 
          $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=splist&callback=?', 
            timeout:"5000",
            error:function(data){
                $.ui.showMask('加载失败');
                            window.setTimeout(function () {
                                $.ui.hideMask();
                            }, 2000);

            },
            
            success:function(data){             
                var jsondata=data;
                var str='';
                var cart={ "allpay":getItem('all_pay').toString()};
                var json_cart = cart;
                $.ui.hideMask();
                for(var i=0;i<jsondata.length;i++){
                    if(getItem(jsondata[i].Id)>0){
                      str+='<li>'+jsondata[i].name+'<span class="button" style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+getItem(jsondata[i].Id)+jsondata[i].dw+'</span></li>';
                      cart[jsondata[i].Id] = getItem(jsondata[i].Id).toString();
                      
                      }else{
                        cart[jsondata[i].Id] = "0";
                      //创建购物车json数据
                      //2015/2/6
                    }
                } 
                json_cart = JSON.stringify(cart); 
                
                setItem('cart_json',json_cart);
                        str+='<li style="color:rgb(253,152,0);">总计'+getItem('all_pay').toString()+'元</li>';
                        str+='<span onclick="JavaScript:pay_xdfk();" class="button block" style="color: rgb(253,152,0);border-color: rgb(253,152,0);margin-top: 20px;">完成订单</span>';
                
                $('#pay_howmuch').html(str);
               
                
                
               
               //pay_xdfk(json_cart);
             
                 

            }
        }); 
          
          

        }
        //收款清货
        function skqh(){
           var method_value = $('input[name="diy_time"]:checked').val();
           var school = $('#03_school_select').val();
           var building = $('#search_building').val();
           var number = $('#search_number').val();
           var date = $('#sk_date').val();
           var time = $('#sk_time').val();

           var search_json =
            {
              'method': method_value,        //属性名用引号括起来，属性间由逗号隔开
              'date': date,
              'time': time,
              'school': school,
              'building': building,
              'number': number
            };
            search_json = JSON.stringify(search_json);
            setItem('search_json',search_json);
            if(method_value == 1){
              if(date!=""&&time!=""&&building!=null&&number!=null){
                $.ui.loadContent('#srpage');
              }else{
                showPopup('请检查是否正确填写');
              }

              

              }else if(method_value == 0){
              if(building!=null&&number!=null){

              $.ui.loadContent('#srpage');

              }else{
              showPopup('请检查是否正确填写');
              
              }
              
              }else{
                showPopup('请选择一个检索方式');

              }

              
            
            
           

        }
        //收入统计
        function sr_load(){
          get_school();
          showMask('正在加载...');
          $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=sr_tj&vip='+getItem('vip')+'&json='+getItem('search_json')+'&callback=?', 
            timeout:"5000",
            success:function(data){  
              $.ui.hideMask();
              if(data != null){
                var str ='';
                var schoollist = JSON.parse(getItem('schoollist'));
                var splist = JSON.parse(getItem('splist_on'));

                for (var i = 0; i <data.length; i++) {
                  for(var a=0;a<schoollist.length;a++){ //循环判断校区名称
                                      if(data[i]['school'] == schoollist[a]['Id']){
                                        data[i]['school'] = schoollist[a]['name'];
                                      }
                                    }

                  str +='<li>陪你宅ID:'+data[i]['Id']+'【'+data[i]['school']+'】'+data[i]['building']+'栋'+data[i]['number']+'<br/>【'+data[i]['name']+'】'+'【'+data[i]['phone']+'】<br/>';
                  var all_pay = {};
                  var manager = {};
                   var online = {};
                   var been = {};
                  if(data[i]['pnz_dd'] != null){
                    for (var b = 0; b < data[i]['pnz_dd'].length; b++) {
                    if(data[i]['pnz_dd'][b]['state'] != 0){
                       
                       if(all_pay[i] != undefined){
                        all_pay[i] = parseFloat(data[i]['pnz_dd'][b]['pay']) +parseFloat(all_pay[i]);
                       }else{
                        all_pay[i] = parseFloat(data[i]['pnz_dd'][b]['pay']);

                       }
                    }
                    if(data[i]['pnz_dd'][b]['state'] == 2){
                       
                       if(manager[i] != undefined){
                        manager[i] = parseFloat(data[i]['pnz_dd'][b]['pay']) +parseFloat(manager[i]);
                       }else{
                        manager[i] = parseFloat(data[i]['pnz_dd'][b]['pay']);

                       }
                    }
                    if(data[i]['pnz_dd'][b]['state'] == 1){
                       
                       if(online[i] != undefined){
                        online[i] = parseFloat(data[i]['pnz_dd'][b]['pay']) +parseFloat(online[i]);
                       }else{
                        online[i] = parseFloat(data[i]['pnz_dd'][b]['pay']);

                       }
                    }
                    if(data[i]['pnz_dd'][b]['state'] == 3){
                       
                       if(been[i] != undefined){
                        been[i] = parseFloat(data[i]['pnz_dd'][b]['pay']) +parseFloat(been[i]);
                       }else{
                        been[i] = parseFloat(data[i]['pnz_dd'][b]['pay']);

                       }
                    }
                  
                  }
                  if(all_pay[i] != undefined){
                    if(manager[i] == undefined){
                      setItem('manager_pay','1');
                      if(online[i] == undefined){
                        str += '总金额:'+all_pay[i]+'元/线下需收:0元/线上已付:0元/线下已收:'+been[i]+'元<br/>';
                      }else{
                        str += '总金额:'+all_pay[i]+'元/线下需收:0元/线上已付:'+online[i]+'元/线下已收:'+been[i]+'元<br/>';
                      }
                      
                    }else if(online[i] == undefined){
                      setItem('manager_pay','0');
                      str += '总金额:'+all_pay[i]+'元/线下需收:'+manager[i]+'元/线上已付:0元/线下已收:'+been[i]+'元<br/>';
                    }else{
                      setItem('manager_pay','0');
                      if(been[i] == undefined){

                        str += '总金额:'+all_pay[i]+'元/线下需收:'+manager[i]+'元/线上已付:'+online[i]+'元/线下已收:0元<br/>';
                      }else{
                        str += '总金额:'+all_pay[i]+'元/线下需收:'+manager[i]+'元/线上已付:'+online[i]+'元/线下已收:'+been[i]+'元<br/>';
                      }
                    
                    }
                    
                  }
                  
                  var has_eat = {};
                  has_eat[i] ={};
                  var will_pay = {};
                  will_pay[i] ={};
                  var total_pay = {};
                  total_pay[i] ={};
                  for (var c = 0; c < data[i]['pnz_dd'].length; c++) {
                    for (var d = 1; d < splist.length; d++) {

                      if(data[i]['pnz_dd'][c][d] != 0 &&data[i]['pnz_dd'][c]['state'] == 1){
                       
                        if(has_eat[i][d-1] != undefined){
                        has_eat[i][d-1] = parseInt(data[i]['pnz_dd'][c][d]) + parseInt(has_eat[i][d-1]);
                       }else{
                         has_eat[i][d-1] = parseInt(data[i]['pnz_dd'][c][d]);
                       }
                      }

                      if(data[i]['pnz_dd'][c][d] != 0 &&data[i]['pnz_dd'][c]['state'] == 2){
                       
                        if(will_pay[i][d-1] != undefined){
                        will_pay[i][d-1] = parseInt(data[i]['pnz_dd'][c][d]) + parseInt(will_pay[i][d-1]);
                       }else{
                         will_pay[i][d-1] = parseInt(data[i]['pnz_dd'][c][d]);
                       }
                      }
                      if(data[i]['pnz_dd'][c][d] != 0 &&data[i]['pnz_dd'][c]['state'] == 3){
                       
                        if(will_pay[i][d-1] != undefined){
                        will_pay[i][d-1] = parseInt(data[i]['pnz_dd'][c][d]) + parseInt(will_pay[i][d-1]);
                       }else{
                         will_pay[i][d-1] = parseInt(data[i]['pnz_dd'][c][d]);
                       }
                      }

                      if(data[i]['pnz_dd'][c][d] != 0 &&data[i]['pnz_dd'][c]['state'] != 0){
                       
                        if(total_pay[i][d-1] != undefined){
                        total_pay[i][d-1] = parseInt(data[i]['pnz_dd'][c][d]) + parseInt(total_pay[i][d-1]);
                       }else{
                         total_pay[i][d-1] = parseInt(data[i]['pnz_dd'][c][d]);
                       }
                      }
                      
                    }

                  }
                  
                   str += '【在线支付】<br/>';
                  for (var e = 1; e < splist.length; e++) {
                    if(has_eat[i][e-1] != undefined){
                      str += splist[e-1]['name']+':'+has_eat[i][e-1]+splist[e-1]['dw']+'<br/>';
                    }
                  }
                    str += '【线下收款】<br/>';
                  for (var f = 1; f < splist.length; f++) {
                    if(will_pay[i][f-1] != undefined){
                      str += splist[f-1]['name']+':'+will_pay[i][f-1]+splist[f-1]['dw']+'<br/>';
                    }
                      
                      
                    }
                  }
                  var name = 'wcsk_' + i;
                  setItem(name,JSON.stringify(data[i]));
                  if(data[i]['pnz_dd'] != null){
                    str += '<span class="button" onclick="fs_wcsk(\''+ i +'\');">完成收款</span></li>';
                  }else{
                    str += '<br/>没有产生消费';
                  }
                  
                }

              
             $('#sr_list').html(str);
                 
                }else{
                  showPopup('可能有以下原因:<br/>1.账号权限不足!<br/>2.宿舍不存在于数据库');
                  $.ui.loadContent('#ht_sksspage');
              }
                
            }
        });
        }
        function fs_wcsk(a){
          if(getItem('manager_pay')=='1'){
            showPopup('没有产生线下收费,无需收款');
          }else{
            var name = 'wcsk_' + a;
          var json_c = JSON.parse(getItem(name));
          // json_c = JSON.stringify(json_c['pnz_dd']);
          
          
          for (var i = 0; i < json_c['pnz_dd'].length; i++) {
            
            if(json_c['pnz_dd'][i]['state'] != 2){
              json_c['pnz_dd'].splice(i,1);
              

            }
          }
          json_c = JSON.stringify(json_c);

          $.ui.showMask('正在发送请求..');
           $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=fs_wcsk&json='+json_c +'&callback=?', 
            timeout:"5000",
            success:function(data){
                $.ui.hideMask();
                showPopup('收款成功!');
                sr_load();
              
             
                 

            }
        }); 
          }
          
        }
        //完成陪你宅订单接口
        function pay_xdfk(){
          var str = getItem('cart_json');
          
          $.ui.showMask('正在提交订单');
          $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=add_cart&cart='+str+'&vip='+getItem('vip')+'&callback=?', 
            timeout:"5000",
            error:function(data){
                $.ui.showMask('订单提交失败');
                            window.setTimeout(function () {
                                $.ui.hideMask();
                            }, 2000);

            },
            
            success:function(data){             

                $.ui.hideMask();
                showPopup('下单成功！请尽快支付！');
                $.ui.loadContent('#ddpage',true,true,'fade');

              
             
                 

            }
        }); 

        }
                    function value_add(Id,pay){
                      var a = getItem(Id);
                      var b = 1;
                      var str='';
                      var a_pay=0;
                      var c =0;
                      var hc = getItem('hc_'+Id);
                      a = parseFloat(getItem(Id));
                      b = parseFloat(1);
                      a_pay = parseFloat(getItem('all_pay'));
                      
                      if (hc <= 0) {


                      }else{
                        setItem('hc_'+Id,hc-b);
                      setItem(Id,a+b);
                      str=getItem(Id);
                      c=parseFloat(pay);

                      a_pay = parseFloat(getItem('all_pay'))+parseFloat(pay);
                      setItem('all_pay',parseFloat(getItem('all_pay'))+parseFloat(pay));

                      
                      $('#all_pay').html('￥'+a_pay);
                      $('#'+Id.toString()).html(str);
                      $('#hc_'+Id.toString()).html("寝室货存:"+getItem('hc_'+Id));
                      }

                      
                      
                    }
                    function value_dec(Id,pay){
                       var a = getItem(Id);
                      var b = 1;
                      var c = getItem('hc_'+Id);
                      var str='';
                      var a_pay=0;
                      a = parseFloat(getItem(Id));
                      b = parseFloat(1);
                      c = parseFloat(getItem('hc_'+Id));
                       a_pay = parseFloat(getItem('all_pay'));

                       if(a-b>=0){
                        setItem('hc_'+Id,c+b);
                        setItem(Id,a-b);
                      str=getItem(Id);
                      a_pay = a_pay-parseFloat(pay);
                      setItem('all_pay',parseFloat(getItem('all_pay'))-parseFloat(pay));

                      $('#all_pay').html('￥'+a_pay.toString());
                      $('#'+Id.toString()).html(str);
                       $('#hc_'+Id.toString()).html("寝室货存:"+getItem('hc_'+Id));
                       }
                      
                      
                    }
                    function xdfk_jc(){
                      if(getItem('all_pay')>0){
                        $.ui.loadContent('xdfkpage');
                      }else{
                        showPopup('购物车空空的耶~~');
                      }
                      
                    }
                    //选择商品 页面 
                    function xzspload(){
                      
                        
                       $.ui.slideSideMenu = false;
                       $.ui.showMask('正在拼命加载中...');
                      
                        $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=splist&callback=?', 
            timeout:"5000",
                                error:function(data){
                                showMask('喵～ 网络不通畅哟～');
                                },
            
            
            success:function(data){             
                setItem('splist_on',JSON.stringify(data));
                $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=huocun&building='+getItem('building')+'&number='+getItem('number')+'&school='+getItem('school')+'&callback=?', 
            timeout:"5000",
                        
            
            
            success:function(data){             
                setItem('qs_huocun',JSON.stringify(data));
               var jsondata=JSON.parse(getItem('splist_on'));
                var str='';
                var a_pay=0;
                var huocun = JSON.parse(getItem('qs_huocun'));
                setItem('all_pay',0);
                

                $('#all_pay').html('￥'+a_pay.toString());
                $.ui.hideMask();
                var a=1;

                for(var i=0;i<jsondata.length;i++){
                  setItem(jsondata[i].Id,0);
                  
                  
                  setItem('hc_'+a,huocun[a]);
                    if(huocun[a] >0){
                    str+='<li style="padding: 5px 5px 5px 5px;" ><img onclick="show_sp(\''+jsondata[i].photo+'\',\''+jsondata[i].name+'\');" width="80px" height="60px" src="http://www.qndzk.com/qndzkcx/Public/Uploads/'+jsondata[i].photo+'"><p style="color:#000;font-size: 15px;margin-bottom:0px; float:none;">'+jsondata[i].name+'/'+jsondata[i].dw+' </p><p style="margin: -25px 50px;padding: 0px 0px;float: right;" id="hc_'+a+'">寝室货存:'+getItem('hc_'+a)+'</p><div style="float:right; margin-top:-60px;"><span style="color:rgb(149,215,0);border-color:rgb(149,215,0);margin:0px 5px;padding:1px 10px;" onclick="value_dec('+jsondata[i].Id+','+jsondata[i].pay+');" class="button">-</span><span class="button" id="'+jsondata[i].Id+'" style="padding: 1px 5px;margin: 0px 10px;background: rgb(149,215,0);color: #FFF;">'+getItem(jsondata[i].Id)+'</span><span onclick="value_add('+jsondata[i].Id+','+jsondata[i].pay+');" style="color:rgb(149,215,0);border-color:rgb(149,215,0);margin:0px 5px;padding:1px 5px;" class="button">￥'+jsondata[i].pay+'</span></div></li> ';
                  }
                a = a+ 1;
                }      
                if(str==''){
                  str+='<li>寝室的货存已空,请及时补货!</li>';
                }  

                $('#splist_1').html(str);
            }
        });       
            }
        }); 
                
          
          
               
                

                    }

                    function show_sp(photo,name){
                      $.query("#afui").popup({
                              title:"商品简介",
                              message:'<img width="250px" height="250px" src="http://www.qndzk.com/qndzkcx/Public/Uploads/'+photo+'"><br/>'+name,
                              cancelText:"关闭",
                              cancelOnly:true,
                              doneClass:'button',
                              cancelClass:'button',
                              autoCloseDone:true, //default is true will close the popup when done is clicked.
                              suppressTitle:false //Do not show the title if set to true
                      });
                    }
                    
                   //用户信息 显示
                   function panelload(){
                    
                    
                    $.ui.slideSideMenu = false;
                    
                    var vip = getItem('phone');
                    if(vip){
                     
                      $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=flash_time&vip='+vip+'&callback=?',
                                error:function(){
                                  showMask('连接服务器超时');
                                  var login_div='';
                                  login_div+='<div style="color:gray;font-size:17px;text-align: center;padding: 40px 25px 10px 20px;">世界上最遥远的距离就是没有网</div>';
                                  login_div+='<div style="color:black;margin-bottom:10px;margin-left:150px;margin-top:20px; fount-size:25px;">.</div>';
                                  $('#login_div').html(login_div); 
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success!=false){
                                     
                                      setItem('overtime',data['overtime']);
                                     
                            
                                        var login_div='';
                                        
                                        login_div+='<div style="color:gray;font-size:17px;text-align: center;padding: 40px 25px 10px 20px;">卡号: '+getItem('vip')+'</div>';
                                       if(getItem('overtime') == '2015-03-06'){
                                         login_div+='<div style="color:gray;font-size:17px;text-align: center;padding: 40px 25px 10px 20px;">永久卡</div>';
                                       }else if(getItem('overtime') == 'error'){
                                        login_div+='<div style="color:gray;font-size:17px;text-align: center;padding: 40px 25px 10px 20px;">哎呦! 过期啦! </div>';
                                       }else{
                                         login_div+='<div style="color:gray;font-size:17px;text-align: center;padding: 40px 25px 10px 20px;">到期时间: '+getItem('overtime')+'</div>';
                                       }
                                    login_div+='<div style="color:black;margin-bottom:10px;margin-left:150px;margin-top:20px; fount-size:25px;">.</div>';
                                    //退出登录按钮
                                   
                                    $("#outlogin_button_div").show();
                                     if (getItem('cid') != '1'&&getItem('cid') != '2') {
                                      $("#manager").hide();
                                     }else{
                                      $("#manager").show();
                                    }
                                    $('#login_div').html(login_div); 
                   
                                    }
                                }
                            }); 
                            }else{
                            var login_div='<a>.</a>';
                        login_div+='<a class="button block" id="userloginandregister_button" style="margin-left:100px; margin-right:100px; margin-top:40px; border-color: gray; color:gray;" href="javascript:turntologin();">立即登录/注册</a>';
                         login_div+='<p style="margin-bottom:40px; text-align:center;color:gray;">你好，欢迎来到青年打折卡！</p>';
                            login_div+='<a>.</a>';
                            $('#login_div').html(login_div);
                            $("#outlogin_button_div").hide();
                            $("#manager").hide();   
                    }
                   
                    
                         
                   }
                    function cz_listfn_1(){
            $('#listForumCate').text('');
        }
        function shuaxin_dd(){
          pnz_listfn_1();
          pnz_listfn();
        }
         function pnz_listfn_1(){
            $('#listForumCate_2').text('');
        }
        function dzk_listfn_1(){
            $('#listForumCate_1').text('');
        }
        function sqbh(){
          //发送补货请求 检测cash
          $.ui.showMask('正在加载...');
          $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=sqbh&building='+getItem('building')+'&school='+getItem('school')+'&number='+getItem('number')+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){
                                $.ui.hideMask(); 
                                //alert(data);                              
                                    if(data.success==false){
                                        //alert(data.message); 
                                        if(data['result'] == '1'){
                                          showPopup('距上次补货,这段时间消费了'+data.cash+'元。<br/>请消费满50元再申请哟！'); 
                                        }else if(data['result'] == '2'){
                                          showPopup('已经申请过补货!请静候补货小哥的光临!'); 
                                        }
                                                                         
                                        //$('#vip').val(vip);
                                    }else{  
                                                                         
                                    $.ui.loadContent('bhpage');
                                
                                    }
                                }
                            });
        }
        function dzk_listfn(){
            $.ui.showMask('正在拼命加载中...');
            $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=ddlist_dzk&vip='+getItem('vip')+'&callback=?', 
            timeout:"5000",
            error:function(data){
                $.ui.showMask('加载失败');
                            window.setTimeout(function () {
                                $.ui.hideMask();
                            }, 2000);

            },
            //http://www.phonegap100.com/appapi.php?a=getThreadCate&callback=?
            success:function(data){             
                
                //alert(data['result'][0]['name']);
                //获取一级分类第一个的名称
                //console.log(data['result'][0]['name']+'111');
                //获取一级分类下的子分类的第一个分类名称
                //console.log(data['result'][0]['subcate'][0]['name']+'111');
                var jsondata=data;
                var str='';
                $.ui.hideMask();
                for(var i=0;i<jsondata.length;i++){
                    var state=jsondata[i].state;
                    
                    str+='<ul class="list inset" id='+jsondata[i].Id+' style="border-radius:20px; margin-bottom:50px;margin-top:20px;">';
                    str+='<li style="text-align: center; color:gray;">订单号:'+jsondata[i].Id+'</li>';  
                    str+='<li style="text-align: center; color:rgb(255, 153, 0);">金额: '+jsondata[i].pay+' 元</li>';
                    str+='<li style="text-align: center; color:gray;">付款方式:账户余额</li>'; 
                    str+='<li style="text-align: center; color:gray;">操作时间: '+jsondata[i].time+'</li>'; 
                    if(state=='0'){
                        str+='<li style="text-align: center; color:gray;">订单状态:待付款</li>';
                        str+='<a onclick="paydd_del('+jsondata[i].Id+');" id="'+jsondata[i].Id+'_cancel" class="button block" style="margin:15px; border-color:rgb(255, 153, 0); color: white;background: rgb(255,153,0);letter-spacing: 3px;font-size: 14px;">取消订单</a>';
                        str+='<a onclick="dzk_paysuccess('+jsondata[i].Id+');" id="'+jsondata[i].Id+'_pay" class="button block" style="margin:15px; border-color:rgb(149,215,0); color: white;background: rgb(149,215,0);letter-spacing: 5px;">去付款</a>';
                    }
                    if(state=='1'){
                        str+='<li style="text-align: center; color:rgb(149,215,0);">订单状态:交易成功</li>';
                    }
                    str+='</ul>';
                }               
                $('#listForumCate_1').append(str);
            }
        }); 
        }
        //获取url传过来的内容
  function getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    } 
  function yuedu_(){

    var id = getQueryString('id');
    if(id != null){
      $.ui.showMask('正在拼命加载中...');
            $.ui.loadContent('ydpage');
      $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=ydwz_read&Id=' + id + '&callback=?', 
            timeout:"5000",
            //http://www.phonegap100.com/appapi.php?a=getThreadCate&callback=?
            success:function(data){             
                
                //alert(data['result'][0]['name']);
                //获取一级分类第一个的名称
                //console.log(data['result'][0]['name']+'111');
                //获取一级分类下的子分类的第一个分类名称
                //console.log(data['result'][0]['subcate'][0]['name']+'111');
                
                var str='';
                $.ui.hideMask();


                
                str +='<p style="font-size:20px; color:black; margin-top:13px;">'+ data.name +'</p><br/><a style="color:gray;">'+ data.time +'</a><a style=" color:#607fa6;font-size: 14px;margin-left: 10px;">'+ data.by +'</a><br/><br/><p>'+ data.text+'</p><br/><br/><a style="color:gray;margin-right:15px;">阅读: '+data.read+'</a><a style="color:white;">.</a>';
                    
                     
                 

                 
                $('#ydwz').html(str);
            }
        }); 
    }

           
  }
        function yd(Id){
          $.ui.showMask('正在拼命加载中...');
            $.ui.loadContent('ydpage');
            
            $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=ydwz_read&Id=' + Id + '&callback=?', 
            timeout:"5000",
            //http://www.phonegap100.com/appapi.php?a=getThreadCate&callback=?
            success:function(data){             
                
                //alert(data['result'][0]['name']);
                //获取一级分类第一个的名称
                //console.log(data['result'][0]['name']+'111');
                //获取一级分类下的子分类的第一个分类名称
                //console.log(data['result'][0]['subcate'][0]['name']+'111');
                
                var str='';
                $.ui.hideMask();


                
                str +='<p style="font-size:20px; color:black; margin-top:13px;">'+ data.name +'</p><br/><a style="color:gray;">'+ data.time +'</a><a style=" color:#607fa6;font-size: 14px;margin-left: 10px;">'+ data.by +'</a><br/><br/><p>'+ data.text+'</p><br/><br/><a style="color:gray;margin-right:15px;">阅读: '+data.read+'</a><a style="color:white;">.</a>';
                    
                     
                 

                 
                $('#ydwz').html(str);
            }
        }); 

        }
        function check_main(){
          if(getItem('main_r')=='1'){
            hide_();

          }else{

          }
        }
        function hide_(){
          $.ui.showMask('正在拼命加载中');
          $('#infinite').hide();
          //$.ui.toggleNavMenu();
          $.ui.slideSideMenu = true;
          gold_load();
          bmap_flist();
          var myScroller;
          
                        $.ui.ready(function () {
                            myScroller = $("#main").scroller(); //Fetch the scroller from cache
                            //Since this is a App Framework UI scroller, we could also do
                            // myScroller=$.ui.scrollingDivs['webslider'];
                            myScroller.addInfinite();
                           
                            //myScroller.addPullToRefresh();
                            
                           
                           
                           
                            var hideClose;
                            $.bind(myScroller, "refresh-release", function () {
                                var that = this;
                                
                                clearTimeout(hideClose);
                                hideClose = setTimeout(function () {
                                  that.hideRefresh();
                                    setItem('main_r','1');
                                    check_main();
                                    that.hideRefresh();

                                }, 3000);
                                return false; //tells it to not auto-cancel the refresh
                            });

                            $.bind(myScroller, "refresh-cancel", function () {
                                clearTimeout(hideClose);
                                console.log("cancelled");
                            });
                            myScroller.enable();

                            $.bind(myScroller, "infinite-scroll", function () {
                                var self = this;
                                $('#infinite').show();
                                

                                $.bind(myScroller, "infinite-scroll-end", function () {
                                    $.unbind(myScroller, "infinite-scroll-end");
                                    self.scrollToBottom();

                                    setItem('flist_page',parseInt(getItem('flist_page'))+1);

                                    $(self.el).find("#infinite").remove();
                                        self.clearInfinite();
                                        
                                        if(getItem('flist_page')<=getItem('main_total')){
                                            $.jsonP({                                       
                                url:'http://api.map.baidu.com/geosearch/v3/local?ak='+ ak +'&geotable_id='+ geotable_id +'&region=&page_index='+getItem('flist_page')+'&sortby=distance:1|pm:1', 
                                timeout:"5000",
            error:function(data){
                $.ui.showMask('加载失败');
                            window.setTimeout(function () {
                                $.ui.hideMask();
                            }, 2000);

            },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.status==0){
                                        //alert(data.message); 
                                        var jsondata=data;
                                        var str='';
                                        if(jsondata.total==0){
                                            str+='<li style="text-align: center;">周边没有合作商家,请通过意见反馈提交您需要打折的店铺,我们会为您努力！ฅ( ̳• ◡ • ̳)ฅ</li>';
                                        
                                        }
                                        
                                        for(var i=0;i<JSONLength(data.contents);i++){
                                         
                                          if(typeof(data.contents[i]['logo'])!="undefined"){
                                             str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+data.contents[i]['logo']+'"/></div><div style="margin-top: -50px;margin-left: 60px;margin-bottom: 20px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size:13px;">'+data.contents[i]['ms']+'</text></div></li>';
                                          }else{
                                            str+='<li onclick="JavaScript:yd('+data.contents[i]['wz_id']+');"><div><img src="'+serverURL+'/app/img/pic/blank_logo.png"/></div><div style="margin-top: -50px;margin-left: 60px;margin-bottom: 20px;"><a style="font-weight: bold;">'+data.contents[i]['title']+'</a><a style="color:rgb(255,163,0);margin-left: 10px;">'+data.contents[i]['zhe']+'折</a><br/><text style="color: gray;font-size:13px;">'+data.contents[i]['ms']+'</text></div></li>';
                                          }
                                           
                                        }  
                                        $(self.el).find("#infinite").remove();
                                        self.clearInfinite();
                                        $('#result').append(str);  
                                         
                                        self.scrollToBottom();
                                        $.ui.hideMask();
                                        //$('#vip').val(vip);
                                    }else{  
                                       showPopup('搜索失败'); 
                                       

                                       
                                    }
                                }
                            });
                                }else{
                                  setItem('flist_page',parseInt(getItem('flist_page'))-1);

                                    $("#bottom_info").html("已经木有更多咯");
                                        }
                                    
                            self.scrollToBottom();
                                });
                            });
                            
                            

                            
                        });
           
          setItem('main_r','0');
        }
        
        function jryh_listfn(){
          $('#jryh_list').html('');
            var model = getItem('wz_model');
            $.ui.showMask('正在拼命加载中...');
            $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=list_jryh&model='+model+'&callback=?', 
            timeout:"5000",
            //http://www.phonegap100.com/appapi.php?a=getThreadCate&callback=?
            success:function(data){             
                
                //alert(data['result'][0]['name']);
                //获取一级分类第一个的名称
                //console.log(data['result'][0]['name']+'111');
                //获取一级分类下的子分类的第一个分类名称
                //console.log(data['result'][0]['subcate'][0]['name']+'111');
                var jsondata=data;
                var str='';
                $.ui.hideMask();
                for(var i=0;i<jsondata.length;i++){
                    str+='<li onclick="JavaScript:yd('+jsondata[i].Id+');" id='+jsondata[i].Id+'><p style="font-size: 17px;">'+jsondata[i].name+'</p><p style="color: rgba(96,96,96,255);float:right;font-size: 12px;margin-top:120px;margin-left:10px;">阅读:'+jsondata[i].read+'</p><p style="color: rgba(96,96,96,255);float:right; font-size: 12px; margin-top:120px;">赞:'+jsondata[i].good+'</p><image src="'+jsondata[i].photo+'" style="margin-top:20px;" width="150px" height="120px"/></li>';
                }               
                $('#jryh_list').html(str);
             
                 

            }
        }); 
        }
        function showMask(text) {

                            $.ui.showMask(text);
                            window.setTimeout(function () {
                                $.ui.hideMask();
                            }, 2000);
                        }
        function jiance_smzphoto(){
            if(getItem('photo') == 1){
                        var smz_up1='<p style="text-align:center;">照片正在审核中...</p>';
                            $('#smz_up').html(smz_up1);
            }
            if(getItem('photo') == 2){
                        var smz_up1='<p style="text-align:center;">照片审核通过</p>';
                            $('#smz_up').html(smz_up1);
            }
            if(getItem('photo') == 3){
                        var smz_up1='<p style="text-align:center;">照片审核失败</p>';
                            $('#smz_up').html(smz_up1);
            }
        }
        function toggle_nav(){
          $.ui.toggleNavMenu();
        }
        function bh_listfn(){
         
          $.ui.showMask('正在拼命加载中...');
          $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=splist_on&callback=?', 
            timeout:"5000",
           
            
            success:function(data){             
              setItem('splist_on',JSON.stringify(data));
                 $.ui.hideMask();

            }
        });
           var jsondata=JSON.parse(getItem('splist_on'));
                var str='';
                var a_pay=0;
                setItem('all_pay',0);
                $('#all_pay_bh').html('￥'+a_pay.toString());
                for(var i=0;i<jsondata.length;i++){
                  setItem(jsondata[i].Id,0);
                  str+='<li style="padding: 5px 5px 5px 5px;"><img width="80px" height="60px" src="http://www.qndzk.com/qndzkcx/Public/Uploads/'+jsondata[i].photo+'"><p style="color:#000;font-size: 15px;margin-bottom:0px; float:none;">'+jsondata[i].name+'/'+jsondata[i].dw+' </p><div style="float:right; margin-top:-60px;"><span id="'+jsondata[i].Id+'_dec" style="color:rgb(149,215,0);border-color:rgb(149,215,0);margin:0px 5px;padding:1px 10px;" onclick="value_dec_bh('+jsondata[i].Id+','+jsondata[i].pay+');" class="button">-</span><span class="button" id="'+jsondata[i].Id+'_bh" style="padding: 1px 5px;margin: 0px 10px;background: rgb(149,215,0);color: #FFF;">'+getItem(jsondata[i].Id)+'</span><span id="'+jsondata[i].Id+'_add" onclick="value_add_bh('+jsondata[i].Id+','+jsondata[i].pay+');" style="color:rgb(149,215,0);border-color:rgb(149,215,0);margin:0px 5px;padding:1px 5px;" class="button">￥'+jsondata[i].pay+'</span></div></li> ';
                }  
                 $('#splist_bh').html(str);  

        }
       function fs_wish(){
        var wish = {};
        var splist = JSON.parse(getItem('splist_on'));
        var all_pay = parseFloat(getItem('all_pay'));


        if(all_pay >= 120 && all_pay <= 140){
          for(var i=0;i<splist.length;i++){
          wish[i] = getItem(splist[i].Id).toString();
        }
        wish = JSON.stringify(wish);
         $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=wish&school='+getItem('school')+'&number='+getItem('number')+'&building='+getItem('building')+'&wish='+wish+'&callback=?', 
            timeout:"5000",
           
            
            success:function(data){  
              if(data['success']==false){
                showPopup('存在上次补货的订单,请不要重复提交并联系送货小哥!'); 
              }else{
                  showPopup('补货申请提交成功!');           
              $.ui.loadContent('main');

              }
          


            }
        });
        }else{
          showPopup('选择的商品总价需高于120元,且小于140元');
        }
        
       }
        function value_add_bh(Id,pay){
                      var a = getItem(Id);
                      var b = 1;
                      var str='';
                      var a_pay=0;
                      var c =0;
                      
                      a = parseFloat(getItem(Id));
                      b = parseFloat(1);
                      a_pay = parseFloat(getItem('all_pay'));
                      
                     
                        
                      setItem(Id,a+b);
                      str=getItem(Id);
                      c=parseFloat(pay);

                      a_pay = parseFloat(getItem('all_pay'))+parseFloat(pay);
                      setItem('all_pay',parseFloat(getItem('all_pay'))+parseFloat(pay));

                      
                      $('#all_pay_bh').html('￥'+a_pay);
                      $('#'+Id.toString()+'_bh').html(str);
                      
                      

                      
                      
                    }
                    function value_dec_bh(Id,pay){
                       var a = getItem(Id);
                      var b = 1;
                      
                      var str='';
                      var a_pay=0;
                      a = parseFloat(getItem(Id));
                      b = parseFloat(1);
                      
                       a_pay = parseFloat(getItem('all_pay'));

                       if(a-b>=0){
                        
                        setItem(Id,a-b);
                      str=getItem(Id);
                      a_pay = a_pay-parseFloat(pay);
                      setItem('all_pay',parseFloat(getItem('all_pay'))-parseFloat(pay));

                      $('#all_pay_bh').html('￥'+a_pay.toString());
                      $('#'+Id.toString()+'_bh').html(str);
                      
                       }
                      
                      
                    }
        function pnz_listfn(){

          setItem('ddlist_page','0');
          
          
            $.ui.showMask('正在拼命加载中...');
            $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=splist_on&callback=?', 
            timeout:"5000",
           
            
            success:function(data){             
              setItem('splist_on',JSON.stringify(data));
                 

            }
        });
             $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=ddlist_count&vip='+getItem('vip')+'&callback=?', 
            timeout:"5000",
           
            
            success:function(data){             
             setItem('pnzdd_total',data['count']);
                 

            }
        });

            $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=ddlist_pnz&vip='+getItem('vip')+'&dq='+getItem('ddlist_page')+'&callback=?', 
            //http://www.phonegap100.com/appapi.php?a=getThreadCate&callback=?
            error:function(){
                                  showMask('连接服务器超时');
                                },
            success:function(data){             
                $.ui.hideMask();
                //alert(data['result'][0]['name']);
                //获取一级分类第一个的名称
                //console.log(data['result'][0]['name']+'111');
                //获取一级分类下的子分类的第一个分类名称
                //console.log(data['result'][0]['subcate'][0]['name']+'111');
                var jsondata=data;
                var str='';
                var splist = JSON.parse(getItem('splist_on'));
                
                if(jsondata==null){
                  
                  str+='<ul class="list inset" id="0" style="border-radius:20px; margin-bottom:50px;margin-top:20px;">';
                    str+='<li style="text-align: center; color:gray;">您还没有下过单哟！</li>'; 
                    str+='</ul>';
                }else{
                  for(var i=0;i<jsondata.length;i++){
                    var state=jsondata[i].state;
                    
                    str+='<ul class="list inset" id='+jsondata[i].Id+' style="border-radius:20px; margin-bottom:50px;margin-top:20px;">';
                    
                   

                    
                    if(state=='0'){
                      str+='<li ><div style="text-align: left; color:black;">订单号:'+jsondata[i].Id+'</div><div style="margin-left:20PX;margin-left: 40%;MARGIN-TOP: -18PX;color:gray;">等待付款</div><div style="font-size: 25px;color:rgb(255, 153, 0); float:right;margin-top:-25px;">￥'+jsondata[i].pay+' </div></li>'; 
                      str+='<li style="text-align: center; color:gray;">'+jsondata[i].time+'</li>';
                      for(var a=0;a<=splist.length;a++){
                       
                      if(jsondata[i][a]>0){
                        str+='<li style="text-align: left; color:gray;">'+splist[a-1].name+'<span style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[i][a]+splist[a-1].dw+'</span></li>'; 
                      }
 
                    }
                    str+='<li><form><input id="alipay'+jsondata[i].Id+'" type="radio" name="pay_fs'+jsondata[i].Id+'" value="1"><label for="alipay'+jsondata[i].Id+'" class="icon"><img src=http://www.qndzk.com/app/img/pic/alipay/alipay_58x58.png class style="margin-top: -15px;margin-left: -110px;width:45px;height:45px;"><div style="margin-left: -55px;padding-bottom: 20px;margin-top: -50PX;font-size: 16px;font-weight: bold;letter-spacing: 1px;">支付宝钱包支付</div><div style="margin-left: -55px;padding-bottom: 20px;margin-top: -20PX;font-size: 14px;color:gray;font-weight: bold;">推荐支付宝用户使用</div></label><input id="manager'+jsondata[i].Id+'" type="radio" name="pay_fs'+jsondata[i].Id+'" value="2"><label for="manager'+jsondata[i].Id+'" class="icon"><img src=http://www.qndzk.com/app/img/pic/icon.png class style="width:45px; height:45px;margin-top: -10px;margin-left: -110px;"><div style="margin-left: -55px;padding-bottom: 20px;margin-top: -50PX;font-size: 16px;font-weight: bold;letter-spacing: 1px;">陪你宅线下支付</div><div style="margin-left: -55px;padding-bottom: 20px;margin-top: -20PX;font-size: 14px;color:gray;font-weight: bold;">校区管理员收款</div></label><br style="clear:both"><br style="clear:both"></form></li>';  
                        
                        str+='<a onclick="pay_success('+jsondata[i].Id+','+jsondata[i].pay+');" id="'+jsondata[i].Id+'_pay" class="button block" style="margin:15px; border-color:rgb(255, 153, 0);background:rgb(255, 153, 0); color:white;letter-spacing: 3px;">去付款</a>';
                        str+='<a onclick="pnzdd_del('+jsondata[i].Id+');" id="'+jsondata[i].Id+'_cancel" class="button block" style="margin:15px; color: #B3B3B3;">取消订单</a>';
                        
                    }
                    if(state=='1'){
                      str+='<li ><div style="text-align: left; color:black;">订单号:'+jsondata[i].Id+'</div><div style="margin-left:20PX;margin-left: 40%;MARGIN-TOP: -18PX;color:gray;">在线支付</div><div style="font-size: 25px;color:rgb(255, 153, 0); float:right;margin-top:-25px;">￥'+jsondata[i].pay+' </div></li>'; 
                    for(var a=0;a<=splist.length;a++){
                       
                      if(jsondata[i][a]>0){
                        str+='<li style="text-align: left; color:gray;">'+splist[a-1].name+'<span style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[i][a]+splist[a-1].dw+'</span></li>'; 
                      }
 
                    }
                     str+='<li style="text-align: left; color:gray;">'+jsondata[i].time+'<div style="text-align: center; color:rgb(149,215,0);float:right;">交易成功</div></li>'; 
                        
                      }
                     if(state=='2'){
                    str+='<li ><div style="text-align: left; color:black;">订单号:'+jsondata[i].Id+'</div><div style="margin-left:20PX;margin-left: 40%;MARGIN-TOP: -18PX;color:gray;">线下支付</div><div style="font-size: 25px;color:rgb(255, 153, 0); float:right;margin-top:-25px;">￥'+jsondata[i].pay+' </div></li>';
                    for(var a=0;a<=splist.length;a++){
                       
                      if(jsondata[i][a]>0){
                        str+='<li style="text-align: left; color:gray;">'+splist[a-1].name+'<span style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[i][a]+splist[a-1].dw+'</span></li>'; 
                      }
 
                    } 
                    
                    
                   
                    str+='<li style="text-align: left; color:gray;">'+jsondata[i].time+'<div style="text-align: center; color:rgb(149,215,0);float:right;">等待管理员收款</div></li>';
                    }
                    if(state=='3'){
                    str+='<li ><div style="text-align: left; color:black;">订单号:'+jsondata[i].Id+'</div><div style="margin-left:20PX;margin-left: 40%;MARGIN-TOP: -18PX;color:gray;">线下支付</div><div style="font-size: 25px;color:rgb(255, 153, 0); float:right;margin-top:-25px;">￥'+jsondata[i].pay+' </div></li>'; 
                    for(var a=0;a<=splist.length;a++){
                       
                      if(jsondata[i][a]>0){
                        str+='<li style="text-align: left; color:gray;">'+splist[a-1].name+'<span style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[i][a]+splist[a-1].dw+'</span></li>'; 
                      }
 
                    }
                    
                    
                    str+='<li style="text-align: left; color:gray;">'+jsondata[i].time+'<div style="text-align: center; color:rgb(149,215,0);float:right;">交易成功</div></li>';
                    }

                      
                    
                    str+='</ul>';

                }  
                }
                       
                    
                $('#listForumCate_2').append(str);
            }
        }); 
            var ddlist_Scroller;
          
                        $.ui.ready(function () {
                            ddlist_Scroller = $("#ddpage").scroller(); //Fetch the scroller from cache
                            //Since this is a App Framework UI scroller, we could also do
                            // myScroller=$.ui.scrollingDivs['webslider'];
                            ddlist_Scroller.addInfinite();
                           
                           

                            ddlist_Scroller.enable();

                            $.bind(ddlist_Scroller, "infinite-scroll", function () {
                                var self = this;
                                $('#infinite').show();
                                $.bind(ddlist_Scroller, "infinite-scroll-end", function () {
                                    $.unbind(ddlist_Scroller, "infinite-scroll-end");
                                    self.scrollToBottom();

                                    setItem('ddlist_page',parseInt(getItem('ddlist_page'))+10);
                                    
                                    $(self.el).find("#infinite").remove();
                                        self.clearInfinite();
                                        
                                        if(getItem('ddlist_page')<=getItem('pnzdd_total')){
                                          //获取数据
                                                                    $.jsonP({       
                                    url:serverURL+'/qndzkcx/index.php?a=ddlist_pnz&vip='+getItem('vip')+'&dq='+getItem('ddlist_page')+'&callback=?', 
                                    //http://www.phonegap100.com/appapi.php?a=getThreadCate&callback=?
                                    error:function(){
                                                          showMask('连接服务器超时');
                                                        },
                                    success:function(data){             
                                        $.ui.hideMask();
                                        //alert(data['result'][0]['name']);
                                        //获取一级分类第一个的名称
                                        //console.log(data['result'][0]['name']+'111');
                                        //获取一级分类下的子分类的第一个分类名称
                                        //console.log(data['result'][0]['subcate'][0]['name']+'111');
                                        var jsondata=data;
                                        var str='';
                                        var splist = JSON.parse(getItem('splist_on'));
                                        
                                        if(jsondata==null){
                                          
                                          str+='<ul class="list inset" id="0" style="border-radius:20px; margin-bottom:50px;margin-top:20px;">';
                                            str+='<li style="text-align: center; color:gray;">您还没有下过单哟！</li>'; 
                                            str+='</ul>';
                                        }else{
                                          for(var i=0;i<jsondata.length;i++){
                                            var state=jsondata[i].state;
                                            
                                            str+='<ul class="list inset" id='+jsondata[i].Id+' style="border-radius:20px; margin-bottom:50px;margin-top:20px;">';
                                            
                                           

                                            
                                            if(state=='0'){
                                              str+='<li ><div style="text-align: left; color:black;">订单号:'+jsondata[i].Id+'</div><div style="margin-left:20PX;margin-left: 40%;MARGIN-TOP: -18PX;color:gray;">等待付款</div><div style="font-size: 25px;color:rgb(255, 153, 0); float:right;margin-top:-25px;">￥'+jsondata[i].pay+' </div></li>'; 
                                              str+='<li style="text-align: center; color:gray;">'+jsondata[i].time+'</li>';
                                              for(var a=0;a<=splist.length;a++){
                                               
                                              if(jsondata[i][a]>0){
                                                str+='<li style="text-align: left; color:gray;">'+splist[a-1].name+'<span style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[i][a]+splist[a-1].dw+'</span></li>'; 
                                              }
                         
                                            }
                                            str+='<li><form><input id="alipay'+jsondata[i].Id+'" type="radio" name="pay_fs'+jsondata[i].Id+'" value="1"><label for="alipay'+jsondata[i].Id+'" class="icon"><img src=http://www.qndzk.com/app/img/pic/alipay/alipay_58x58.png class style="margin-top: -15px;margin-left: -110px;width:45px;height:45px;"><div style="margin-left: -55px;padding-bottom: 20px;margin-top: -50PX;font-size: 16px;font-weight: bold;letter-spacing: 1px;">支付宝钱包支付</div><div style="margin-left: -55px;padding-bottom: 20px;margin-top: -20PX;font-size: 14px;color:gray;font-weight: bold;">推荐支付宝用户使用</div></label><input id="manager'+jsondata[i].Id+'" type="radio" name="pay_fs'+jsondata[i].Id+'" value="2"><label for="manager'+jsondata[i].Id+'" class="icon"><img src=http://www.qndzk.com/app/img/pic/icon.png class style="width:45px; height:45px;margin-top: -10px;margin-left: -110px;"><div style="margin-left: -55px;padding-bottom: 20px;margin-top: -50PX;font-size: 16px;font-weight: bold;letter-spacing: 1px;">陪你宅线下支付</div><div style="margin-left: -55px;padding-bottom: 20px;margin-top: -20PX;font-size: 14px;color:gray;font-weight: bold;">校区管理员收款</div></label><br style="clear:both"><br style="clear:both"></form></li>';  
                                                
                                                str+='<a onclick="pay_success('+jsondata[i].Id+','+jsondata[i].pay+');" id="'+jsondata[i].Id+'_pay" class="button block" style="margin:15px; border-color:rgb(255, 153, 0);background:rgb(255, 153, 0); color:white;letter-spacing: 3px;">去付款</a>';
                                                str+='<a onclick="pnzdd_del('+jsondata[i].Id+');" id="'+jsondata[i].Id+'_cancel" class="button block" style="margin:15px; color: #B3B3B3;">取消订单</a>';
                                                
                                            }
                                            if(state=='1'){
                                              str+='<li ><div style="text-align: left; color:black;">订单号:'+jsondata[i].Id+'</div><div style="margin-left:20PX;margin-left: 40%;MARGIN-TOP: -18PX;color:gray;">在线支付</div><div style="font-size: 25px;color:rgb(255, 153, 0); float:right;margin-top:-25px;">￥'+jsondata[i].pay+' </div></li>'; 
                                            for(var a=0;a<=splist.length;a++){
                                               
                                              if(jsondata[i][a]>0){
                                                str+='<li style="text-align: left; color:gray;">'+splist[a-1].name+'<span style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[i][a]+splist[a-1].dw+'</span></li>'; 
                                              }
                         
                                            }
                                             str+='<li style="text-align: left; color:gray;">'+jsondata[i].time+'<div style="text-align: center; color:rgb(149,215,0);float:right;">交易成功</div></li>'; 
                                                
                                              }
                                             if(state=='2'){
                                            str+='<li ><div style="text-align: left; color:black;">订单号:'+jsondata[i].Id+'</div><div style="margin-left:20PX;margin-left: 40%;MARGIN-TOP: -18PX;color:gray;">线下支付</div><div style="font-size: 25px;color:rgb(255, 153, 0); float:right;margin-top:-25px;">￥'+jsondata[i].pay+' </div></li>';
                                            for(var a=0;a<=splist.length;a++){
                                               
                                              if(jsondata[i][a]>0){
                                                str+='<li style="text-align: left; color:gray;">'+splist[a-1].name+'<span style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[i][a]+splist[a-1].dw+'</span></li>'; 
                                              }
                         
                                            } 
                                            
                                            
                                           
                                            str+='<li style="text-align: left; color:gray;">'+jsondata[i].time+'<div style="text-align: center; color:rgb(149,215,0);float:right;">等待管理员收款</div></li>';
                                            }
                                            if(state=='3'){
                                            str+='<li ><div style="text-align: left; color:black;">订单号:'+jsondata[i].Id+'</div><div style="margin-left:20PX;margin-left: 40%;MARGIN-TOP: -18PX;color:gray;">线下支付</div><div style="font-size: 25px;color:rgb(255, 153, 0); float:right;margin-top:-25px;">￥'+jsondata[i].pay+' </div></li>'; 
                                            for(var a=0;a<=splist.length;a++){
                                               
                                              if(jsondata[i][a]>0){
                                                str+='<li style="text-align: left; color:gray;">'+splist[a-1].name+'<span style="padding: 5px 10px;margin: -5px 10px;float: right;color: rgb(149,215,0);border-color: rgb(149,215,0);">'+jsondata[i][a]+splist[a-1].dw+'</span></li>'; 
                                              }
                         
                                            }
                                            
                                            
                                            str+='<li style="text-align: left; color:gray;">'+jsondata[i].time+'<div style="text-align: center; color:rgb(149,215,0);float:right;">交易成功</div></li>';
                                            }

                                              
                                            
                                            str+='</ul>';

                                        }  
                                        }
                                               
                                            
                                        $('#listForumCate_2').append(str);
                                    }
                                }); 
                                        }else{
                                          setItem('ddlist_page',parseInt(getItem('ddlist_page'))-10);

                                           
                                                }
                                    
                                      self.scrollToBottom();
                                          });
                                      });
                            
                            

                            
                        });
        }
        function pnz_jj(){
          showPopup('动动手指，送货上门，先吃再给钱！客官您好：我们是成都陪你宅科技有限公司，通过菜单选择你要的零食并在线付款, 我们会定期给零食箱补货，同时清点上星期消费的情况，当然，如果箱子没货了，也可以拨打电话给我们，我们会及时给您补货。投诉、建议、补货电话请拨打13330857122.');
        }
        function cz_listfn(){
            $.ui.showMask('正在拼命加载中...');
            $.jsonP({       
            url:serverURL+'/qndzkcx/index.php?a=ddlist_cz&vip='+getItem('vip')+'&callback=?', 
            //http://www.phonegap100.com/appapi.php?a=getThreadCate&callback=?
            error:function(){
                                  showMask('连接服务器超时');
                                },
            success:function(data){             
                $.ui.hideMask();
                //alert(data['result'][0]['name']);
                //获取一级分类第一个的名称
                //console.log(data['result'][0]['name']+'111');
                //获取一级分类下的子分类的第一个分类名称
                //console.log(data['result'][0]['subcate'][0]['name']+'111');
                var jsondata=data;
                var str='';
                for(var i=0;i<jsondata.length;i++){
                    var state=jsondata[i].state;
                    
                    str+='<ul class="list inset" id='+jsondata[i].Id+' style="border-radius:20px; margin-bottom:50px;margin-top:20px;">';
                    str+='<li style="text-align: center; color:gray;">订单号:'+jsondata[i].Id+'</li>';  
                    str+='<li style="text-align: center; color:rgb(255, 153, 0);">金额: '+jsondata[i].pay+' 元</li>';
                    str+='<li style="text-align: center; color:gray;">付款方式:支付宝</li>'; 
                    str+='<li style="text-align: center; color:gray;">操作时间: '+jsondata[i].time+'</li>'; 
                    if(state=='0'){
                        str+='<li style="text-align: center; color:gray;">订单状态:待付款</li>';
                        str+='<a onclick="paydd_del('+jsondata[i].Id+');" id="'+jsondata[i].Id+'_cancel" class="button block" style="margin:15px; border-color:rgb(255, 153, 0); color:rgb(255, 153, 0);">取消订单</a>';
                        str+='<a onclick="pay_success('+jsondata[i].Id+');" id="'+jsondata[i].Id+'_pay" class="button block" style="margin:15px; border-color:rgb(149,215,0); color:rgb(149,215,0);">去付款</a>';
                    }
                    if(state=='1'){
                        str+='<li style="text-align: center; color:rgb(149,215,0);">订单状态:交易成功</li>';
                    }
                    str+='</ul>';
                }               
                $('#listForumCate').append(str);
            }
        }); 
        }
        //申请箱子
        function sqxz(){
          var vip=getItem('vip');
          var school=$('#01_school_select').val();
          var building=$('#building').val();
          var number=$('#number').val();
          if(building==''&&number==''){
            showPopup('请检查是否全部填写');
          }else{
            if(getItem('vip')&&getItem('vip')!=""&&getItem('vip')!="null"){
              $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=add_pnz&vip='+vip+'&school='+school+'&building='+building+'&number='+number+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                                                            
                                        //$('#vip').val(vip);
                                    }else{  
                                       showPopup('申请成功！'); 
                                       setItem('building',building);
                                        setItem('number',number);
                                        setItem('school',school);
                    $.ui.loadContent('afuidemo',true,true,'fade');
                    
                                       

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 
          }else{
            showPopup('请先登录您的账号！');
            $.ui.loadContent('test',true,true,'fade');
                    $.ui.loadContent('afuidemo',true,true,'fade');
            }
            
          }
          

        }
        //手机验证注册页面 检测是否已经注册
        function checkphoneregister(){
             var vip=$('#firstvip').val();
             var phone=$('#02_phone').val();
             var password=$('#02_password').val();
             var password_1=$('#02_password_1').val();
             var sha=hex_sha1(password);
             if(password != password_1){
                showPopup('两次输入的密码不一致!');
                 }else{
                    $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=checkphoneregister&vip='+vip+'&phone='+phone+'&password='+sha+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                        showPopup(data['result']);                                    
                                        //$('#vip').val(vip);
                                    }else{  
                                       showPopup('注册成功！'); 
                                       $.ui.loadContent('#afuidemo');

                                       
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            }); 

             }
             
        }
  
        //注册接口
        function checkvip_id(){
            var vip=$('#firstvip').val(); //获取输入框数据
             if(vip==''){
                showPopup('卡号仅支持阿拉伯数字');
                }else{
                    if(vip > 99999){
                        showPopup('卡号不得超过5位数');
                    }else{
                        $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=checkvip_id&vip='+vip+'&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                        showPopup('恭喜! 此号未注册！');  
                                        $.ui.loadContent('#registerpage01');                                   
                                        //$('#vip').val(vip);
                                    }else{  
                                        if(data.result=='been'){
                                            showPopup('此号已经被注册！'); 
                                        }else{
                                            showPopup('您以前提交过资料,请验证手机号码！'); 
                                            $.ui.loadContent('#registerpage02');
                                        }
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            });
                    }
             }
        }

         //登录接口
                    function userlogin(vip,password) {
                      $.ui.showMask('正在登陆');
                        var auto =$('input[name="auto"]:checked').val();
                        //处理登录的一些操作
                        var vip=$('#vip').val();
                        var password=$('#password').val();  
                        var sha = hex_sha1(password);
                        //alert(vip);          
                        //alert(password);      //wierli
                        //undefined
                        

                        
                        if(vip=='' || password==''){
                          
                            showPopup('手机或者密码不能为空');
                            $.ui.hideMask();
                        }else{
                         
                            $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=appuserlogin&vip='+vip+'&password='+sha+'&callback=?', 
                                error:function(data){
                                  $.ui.showMask('登陆超时');
                                  window.setTimeout(function () {
                                $.ui.hideMask();
                            }, 2000);
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        //alert(data.message); 
                                        
                                        showPopup('手机号或密码错误'); 
                                        $.ui.hideMask();                                  
                                        //$('#vip').val(vip);
                                    }else{  
                                      $.ui.hideMask();
                                        //alert(data['result']);
                                        //alert('登录成功');
                                        //alert(data['result'].username);  
                                        setItem('cid',data['cid']); //用户级别                         
                                        setItem('phone',data['phone']); //用户id
                                        setItem('vip',data['vip']);
                                        setItem('manage',data['manage']);
                                        setItem('charge',data['charge']);
                                        setItem('header',data['header']);
                                        setItem('overtime',data['overtime']);
                                        setItem('value',data['value']);
                                        setItem('photo',data['photo']);
                                        setItem('school',data['school']);
                                        setItem('building',data['building']);
                                        setItem('number',data['number']);
                                        
                                        $.ui.loadContent('afuidemo',false,false,'fade');
                                        
                                        //setItem('username',data['result'].username);//用户名
                                        //setItem('salt',data['result'].salt);//用户的唯一标识
                                    }
                                }
                            });     
                         }   
                     }
                      // 信息框模块
        function showPopup(text) {
                $("#afui").popup(text);
                    
               
            }
            function hidefooter(){
                clear_Pwd();
                $('#password').val("");
                $.ui.slideSideMenu = false;
                $.ui.toggleNavMenu();
            }
            function slidemenuisfalse(){
                $.ui.slideSideMenu = false;
            }
            function slidemenuistrue(){
                $.ui.slideSideMenu = true;
            }
            function loadedPanel(what) {
                //We are going to set the badge as the number of li elements inside the target
                $.ui.updateBadge("#aflink", $("#af").find("li").length);
            }


            function unloadedPanel(what) {
                console.log("unloaded " + what.id);
            }
             function isTelOrMobile(telephone){  
    var teleReg = /^((0\d{2,3})-)(\d{7,8})$/;  
    var mobileReg =/^1[358]\d{9}$/;   
    if (!teleReg.test(telephone) && !mobileReg.test(telephone)){  
        return false;  
    }else{  
        return true;  
    }  
}  

               // 填资料注册接口
                    function newdata_register(){
                        var vip = $('#firstvip').val();
                        var name = $('#01_name').val();
                        var password = $('#01_password').val();
                        var building =$('#building').val();
                        var number =$('#number').val();
                        var sha = hex_sha1(password);
                        var phone = $('#01_phone').val();
                        var school = $('#01_school_select').val();
                        var sexval_value = $('input[name="sex"]:checked').val();
                        //alert(school);
                        if (password != $('#01_password_1').val()) {
                            showPopup('两次输入的密码不一致');
                           }else{
                            if(name !=""){
                              if(phone !="" && isTelOrMobile(phone) == true){
                                if(sexval_value !=""){
                                  $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=newdata_register&vip='+vip+'&password='+sha+'&name='+name+'&phone='+phone+'&sex='+sexval_value+'&school='+school+'&building='+building+'&number='+number+'&callback=?', 
                                error:function(){
                                  showMask('注册超时');
                                },
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        showPopup('该手机号已经注册');
                                    }else{  
                                        showPopup('注册成功！');
                                        setItem('building',building);
                                        setItem('number',number);
                                        setItem('school',school);
                    $.ui.loadContent('afuidemo',true,true,'fade');
                                        
                                    }
                                }
                            }); 
                                }else{
                                   showPopup('请选择性别');
                                }
                                
                              }else{
                                showPopup('请输入正确的手机号');
                              }
                            }else{
                              showPopup('名字不能为空');
                            }
                            
                        };
                    }
                    function gxload(){
                        $.getJSON('n_ver.html', function (data) {
                                var ver = data;
                            });
                        $.ui.toggleNavMenu();
                        var str='<li style="text-align: center;margin-top: 10px;font-size: 16px;color: #6D6D6D;">当前版本号: ' + getItem('ver') + '</li>';
                        str+='<li><span onclick="JavaScript:jcgx();" class="button block" style="text-align: center;background: rgb(149,215,0);color: white;font-family: &quot;宋体&quot;;">检测更新</span></li>';
                        $('#gxlist').html(str);
                    }
                    function jcgx(){
                         $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=jcgx&callback=?', 
                                success:function(data){ 
                                //alert(data);                                
                                    if(data.success==false){
                                        
                                    }else{  
                                        
                                       var n_ver =JSON.stringify(data.ver).toString();
                                       if(getItem('ver') != n_ver){
                            showPopup('为了更好的体验新功能,请及时更新app哟!<br/>当前版本号: '+getItem('ver')+'<br/>最新版本号:'+n_ver);
                        }else{
                            showPopup('当前版本为最新!');
                        }
                                    }
                                }
                            });
                    }
                    function alipay_plugin(args,success_fn,error_fn){
                       window.plugins.HelloWorld.pay(args,success_fn,error_fn);
                    }
                    function dzk_bl(){
                      $('#afui').actionsheet(
                         [{
                         text: '永久会员卡 ￥50',
                         cssClasses: 'red',
                         handler: function () {
                          //购买永久卡
                          dd_id = new Date().getTime();
                            alipay_plugin(['50',dd_id],
                              function (success){
                                if(success['result'] === "6001"){
                                    showPopup('您取消了付款,如果支付宝没有余额,请选择管理员收款的方式..喵~~');
                                    }else if(success['result']==="8000"){
                                    showPopup('支付宝正在处理中...');
                                  }else if(success['result']==="9000"){
                                    $.ui.showMask('正在完成办理');
                                $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=dzk_paysuccess&vip='+getItem('vip')+'&kind=forever&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                  $.ui.hideMask();
                                        setItem('r_charge','1');
                                       showPopup('打折卡办理成功！'); 
                                       panelload();
                                }
                            }); 
                                    }else if(success['result']==="4000"){
                                    showPopup('订单支付失败,请重试');
                                    }else if(success['result']==="6002"){
                                    showPopup('世界上最远的距离就是没有网,请检查网络设置再重试');
                                    }
                                
                              },
                              function(error){
                                showPopup('办理失败');
                              });
                         
                         }
                         }, {
                         text: '月卡会员卡 ￥15',
                         cssClasses: 'orange',
                         handler: function () {
                          //购买月卡
                         dd_id = new Date().getTime();
                            alipay_plugin(['15',dd_id],
                              function (success){
                                if(success['result'] === "6001"){
                                    showPopup('您取消了付款,如果支付宝没有余额,请选择管理员收款的方式..喵~~');
                                    }else if(success['result']==="8000"){
                                    showPopup('支付宝正在处理中...');
                                  }else if(success['result']==="9000"){
                                    $.ui.showMask('正在完成办理');
                                $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=dzk_paysuccess&vip='+getItem('vip')+'&kind=30&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                  $.ui.hideMask();
                                        setItem('r_charge','1');
                                       showPopup('打折卡办理成功！'); 
                                       panelload();
                                }
                            }); 
                                    }else if(success['result']==="4000"){
                                    showPopup('订单支付失败,请重试');
                                    }else if(success['result']==="6002"){
                                    showPopup('世界上最远的距离就是没有网,请检查网络设置再重试');
                                    }
                              },
                              function(error){
                                showPopup('办理失败');
                              });
                         }
                         }, {
                         text: '日卡会员卡 ￥1',
                         cssClasses: '',
                         handler: function () {
                          //购买日卡
                         dd_id = new Date().getTime();
                            alipay_plugin(['1',dd_id],
                              function (success){
                               if(success['result'] === "6001"){
                                    showPopup('您取消了付款,如果支付宝没有余额,请选择管理员收款的方式..喵~~');
                                    }else if(success['result']==="8000"){
                                    showPopup('支付宝正在处理中...');
                                  }else if(success['result']==="9000"){
                                    $.ui.showMask('正在完成办理');
                                $.jsonP({                                       
                                url:serverURL+'/qndzkcx/index.php?a=dzk_paysuccess&vip='+getItem('vip')+'&kind=1&callback=?', 
                                error:function(){
                                  showMask('连接服务器超时');
                                },
                                success:function(data){ 
                                  $.ui.hideMask();
                                        setItem('r_charge','1');
                                       showPopup('打折卡办理成功！'); 
                                       panelload();
                                }
                            }); 
                                    }else if(success['result']==="4000"){
                                    showPopup('订单支付失败,请重试');
                                    }else if(success['result']==="6002"){
                                    showPopup('世界上最远的距离就是没有网,请检查网络设置再重试');
                                    }
                              },
                              function(error){
                                showPopup('办理失败');
                              });
                         }
                         }]
                      );
                    }
                    function aps_notification (alert,id){
                      $.query("#afui").popup({
                        title:"消息推送",
                        message:alert,
                        cancelText:"取消",
                        cancelCallback: function(){
                          showPopup('错过了优惠不要怪我没有提醒哟!');
                        },
                        doneText:"查看更多",
                        doneCallback: function(){
                          var str = 'jpush_content.html?id=' + id ;
                          window.location.href=str;
                        },
                        cancelOnly:false,
                        doneClass:'button',
                        cancelClass:'button',
                        autoCloseDone:true, //default is true will close the popup when done is clicked.
                        suppressTitle:true //Do not show the title if set to true
                      });
                    }