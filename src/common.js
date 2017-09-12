//http请求
//import axios from 'axios'
import router from './router'
//store为实例化生成的
//import store from './../../store/index'
export default{
    modal:weex.requireModule('modal'),
    stream:weex.requireModule('stream'),
    navigator:weex.requireModule('navigator'),
    animation:weex.requireModule('animation'),
    storage:weex.requireModule('storage'),
    token:'',
    getToken:function(){
        this.storage.getItem('token', event => {
            this.token = event.data
        })
    },
    get:function(obj){
        this.getToken();
        return this.stream.fetch({
          method: 'GET',
          type:"json",
          headers:{
            'Authorization': this.token,
            "Content-Type":"application/json"
          },
          url: 'https://api.91war.com/' + obj.url
        },function(res){
            if(res.ok){
                obj.callback(res);
            }else{
                if(res.data.info == "没有登录,请登录!"){
                    router.push("login");
                }else{
                    this.modal.toast({ message: res.data.info})
                }
            }
        })
    },
    post:function(obj){
        this.getToken();
        return this.stream.fetch({
          method: 'POST',
          type:"json",
          headers:{
            'Authorization': this.token,
            "Content-Type":"application/json"
          },
          url: 'https://api.91war.com/' + obj.url,
          body:obj.param
        },res =>{
            if(res.ok){
                obj.callback(res);
            }else{
                if(res.data.info == "没有登录,请登录!"){
                    router.push("login");
                }else{
                    this.modal.toast({ message: res.data.info})
                }
            }
        })
    },
    jump:function(url){
        router.push(url);
    },
    jumpQuery:function(url,param){
        router.push({ path: url, query: param})
    },
    getQueryString:function(name){
        return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    },
    getUrl:function(bundleUrl,fileName,dir,host){
        var nativeBase;
        var isAndroidAssets = bundleUrl.indexOf('file://assets/') >= 0;
        var isiOSAssets = bundleUrl.indexOf('file:///') >= 0 && bundleUrl.indexOf('WeexDemo.app') > 0;
        if (isAndroidAssets) {
            nativeBase = 'file://assets/';
        }
        else if (isiOSAssets) {
            nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);
        }
        else {
            host = host||'localhost:8080';
            var matches = /\/\/([^\/]+?)\//.exec(bundleUrl);
            if (matches && matches.length >= 2) {
                host = matches[1];
            }
            nativeBase = 'http://' + host + '/' + dir + '/';
        }
        var h5Base = './index.html?page=./' + dir + '/';
        // in Native
        var base = nativeBase;
        if (typeof window === 'object') {
            base = h5Base;
        }
        return base+fileName;
    },
    isWechat:function () {
        var ua = window.navigator.userAgent.toLowerCase(); 
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
            return true; 
        } else { 
            return false; 
        } 
    }
}