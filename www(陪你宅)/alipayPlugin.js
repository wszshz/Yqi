/**
 *  @ 公司:成都陪你宅科技有限公司
 *  @ 作者:Wierli
 *  @ www.qndzk.com
 *  @ 支付宝快捷支付插件
 */
var Alipay = function() {
	
};

Alipay.prototype.pay = function(args,successCallback,failureCallback) {
	 return cordova.exec( 
	 successCallback,    //Success callback from the plugin
	 failureCallback,     //Error callback from the plugin
	 'HelloWorld',  //Tell PhoneGap to run "DatePickerPlugin" Plugin
	 'alipay',              //Tell plugin, which action we want to perform
	 args);        //Passing list of args to the plugin
};



/**
 * Enregistre une nouvelle bibliothèque de fonctions
 * auprès de PhoneGap
 **/


    //如果不支持window.plugins,则创建并设置
    if(!window.plugins){
        window.plugins={};
    }
    window.plugins.HelloWorld=new Alipay();