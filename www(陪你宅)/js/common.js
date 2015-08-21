// JavaScript Document

//网站的主域名
var serverURL = 'http://www.qndzk.com';
//AK密匙
var ak= '22f300d2690b7cecabede060cbd310f3';
var geotable_id= '92132';
setItem('ver','"1.1.3"');
setItem('fl','');
var fq='郫县';
function JSONLength(obj) {
var size = 0, key;
for (key in obj) {
if (obj.hasOwnProperty(key)) size++;
}
return size;
};
/*
写入loclstorage缓存
 * @param key
 * @param data
*/
function setItem(key,data){
	localStorage.setItem(key,data);
}
/*
读取localstorage缓存
  * @param key 
  * @returns
*/
function getItem(key){
	return localStorage.getItem(key);
}

/**
 * 检查网络情况
 * @returns {Boolean}
 */
function checkConnection() {
	var networkState = navigator.network.connection.type;
	if (networkState == Connection.NONE) {
		navigator.notification.confirm('请确认网络连接已开启,并重试', showAlert, '提示',
				'确定');
		return false;
	}else{
		return true;
	}
}
/*时间戳转换为 2011年3月16日 16:50:43 格式*/
function getDate(tm){
	var tt=new Date(parseInt(tm) * 1000).toLocaleString()
	return tt;
}