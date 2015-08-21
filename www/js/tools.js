//
'use strict';
var tools = function () {
    return {
        K11ServerURL: "fz.k11.tenant.serverurl",
        version: function () {
            var version = {
                page: '0',
                source: '0'
            };
            return version;
        },
        //检查是否包含特殊字符
        checkScript:function(s,reg){
        	reg=reg==undefined? "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]":reg;
        	var pattern = new RegExp(reg);
        	var rs = "";
			for (var i = 0;i < s.length; i++) {
				rs = rs+s.substr(i, 1).replace(pattern, '');
			}
			return rs==s; 
        },
        storage: {
            set: function (key, value) {
                localStorage[key] = value;
            }, get: function (key) {
                return localStorage[key];
            }
        },
        //get the wcf address
        getServerUrl: function () {
            var serverUlr = fz.storage.get(fz.K11ServerURL);
            if (serverUlr == undefined || serverUlr === "") {
                //fz.setServerUrl("http://192.168.1.9:8036");
                fz.setServerUrl("http://192.168.1.209:8093");
                serverUlr = fz.storage.get(fz.K11ServerURL);
            }
            return serverUlr;
        },
        //set the wcf address
        setServerUrl: function (value) {
            fz.storage.set(fz.K11ServerURL, value);
        },
        init:function (){
            fz.initPage();
        },
        initPage: function () {
        }
    }
}();


/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
    可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
    Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
 */        
Date.prototype.format=function(fmt) {         
    var o = {         
        "M+" : this.getMonth()+1, //月份         
        "d+" : this.getDate(), //日         
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
        "H+" : this.getHours(), //小时         
        "m+" : this.getMinutes(), //分         
        "s+" : this.getSeconds(), //秒         
        "q+" : Math.floor((this.getMonth()+3)/3), //季度         
        "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
        "0" : "/u65e5",         
        "1" : "/u4e00",         
        "2" : "/u4e8c",         
        "3" : "/u4e09",         
        "4" : "/u56db",         
        "5" : "/u4e94",         
        "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}
Date.prototype.toString=Date.prototype.format;