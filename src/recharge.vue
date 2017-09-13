<template>
	<div class="login-bg">
	    <image src="http://oslg9bt6h.bkt.clouddn.com/honor/img/bg.png" class="bg-img" style="width: 750px;height: 1218px;"></image>
		<div>
            <div class="clumn-login row">
                <text class="clumn-tit">* 我的队长：</text>
                <input type="text" v-model="formcode" class="input-login" placeholder="输入邀请码" v-if="!nickname" />
                <input type="text" class="left input-login" readonly v-model="nickname" v-if="nickname" />
                <image class="recharge-sure-btn" src="http://oslg9bt6h.bkt.clouddn.com/honor/img/recharge-sure-btn.png" v-if="!nickname" @click="getUser"></image>
                <image class="recharge-sure-btn" src="http://oslg9bt6h.bkt.clouddn.com/honor/img/edit-btn.png" v-if="nickname" @click="editUser"></image>
            </div>
            <div class="clumn-select">
                <text class="clumn-tit">* 已选套餐：</text>
                <div style="margin-left: 17px;margin-right: 30px;margin-top: 20px;" class="row">
                	<image :src="honorObj.cover" class="select-meal-img"></image>
                	<div style="margin-left:20px;width:400px;">
                		<text class="meal-detail">+附赠：{{honorObj.diamonds}}钻石</text>
	                	<text class="meal-detail" v-html="explain1"></text>
	                    <text class="meal-detail" v-html="explain2"></text>
	                	<text class="meal-detail">+附赠：您的邀请者{{honorObj.rebate}}枚荣誉勋章</text>
	                	<div class="row" style="justify-content:space-between;">
		                	<div>
		                		<text class="meal-detail">价值：</text>
		                	</div>
	                		<div class="row">
	                			<text class="meal-detail" v-if="honorObj.old_price">{{honorObj.old_price/100}}元</text>
	                			<text class="meal-price" v-if="honorObj.price">￥{{honorObj.price/100}}</text>
	                		</div>
	                	</div>
                	</div>
                </div>
            </div>
            <div class="center">
            	<image src="http://oslg9bt6h.bkt.clouddn.com/honor/img/recharge-submit-btn.png" style="width: 633px;height: 75px;margin-left:59px;margin-top:60px;" @click="pay"></image>
            </div>
		</div>
	</div>
</template>
<script>
  import common from './common';
  export default {
    data: function(){
    	return {
    		isShow:false,
            honorObj:{},
            formcode:'',
            nickname:'',
            form_uid:'',
            explain1:'',
            explain2:''
    	}
    },
    mounted:function(){
    	//获取套餐索引
        var index = 0;
        common.storage.getItem("index", event => {
            index = event.data;
            this.getMeal(index);
        });
        //获取邀请码
        //var formcode = common.getQueryString("formcode");
        //有索引且没有邀请码利用索引获取套餐id
        /*if(index >= 0 && formcode == undefined){
            this.getMeal(index);
        }else{
            //根据邀请码获取用户和相关套餐信息
            this.formcode = formcode;
            this.getUser();
        }*/
    },
    methods: {
        getMeal(index) {
            common.get({
	            url:"api/honor",
	            callback:respose=>{
	                this.honorObj = respose.data.data[parseInt(index)];
	                if(this.honorObj.explain){
		                this.explain1 = respose.data.data[Number(index)].explain.split(" ")[0];
		                this.explain2 = respose.data.data[Number(index)].explain.split(" ")[1];
		            }
	            }
            })
        },
        getUser(){
        	common.get({
	            url:"api/honor/formcode/user?formcode="+ this.formcode,
	            callback:respose=>{
	                this.nickname = respose.data.nickname;
                    this.form_uid = respose.data.uid;
                    this.honorObj = respose.data.honor;
                    if(respose.data.honor.explain){
                        this.explain1 = respose.data.honor.explain.split(" ")[0];
                        this.explain2 = respose.data.honor.explain.split(" ")[1];
                    }
                    this.honor_id = respose.data.honor.id;
	            }
            })
        },
        editUser(){
            this.nickname = '';
            $("input[name='formcode']").focus();
        },
        pay(){
            //没有用户ID又有名称的时候根据名称查询一下套餐信息
            if(!this.form_uid && this.formcode){
                this.getUser();
            }
            this.payment();
        },
		payment(){
            var param = {
                honor_id : this.honorObj.id,
                form_uid : this.form_uid,
            }
            /*var isWchat = common.isWechat();
            if(isWchat){ 
                param.payment_type = 3;  //微信浏览器使用APP支付
                param.openid = localStorage.openId;
            }else{*/
                param.payment_type = 2;  //非微信浏览器使用支付宝
            //}
            common.post({
	            url:"api/honor/payment",
	            param:JSON.stringify(param),
	            callback:respose=>{
	                var data = respose.data.data;
                    /*if(isWchat){
                        //微信浏览器使用APP支付
                        this.onBridgeReady(data.url);
                    }else{ */
                        //location.href = data.url;
                        common.navigator.push({
                          url: data.url,
                          animated: "true"
                        }, event => {
                          modal.toast({ message: 'callback: ' + event })
                        })
                    //}
	            }
            })
        },
        onBridgeReady(obj){
           WeixinJSBridge.invoke(
               'getBrandWCPayRequest', {
                   "appId":obj.appId,
                   'timeStamp': obj.timeStamp,
                   'nonceStr': obj.nonceStr,
                   'package':  obj.package,
                   'signType': obj.signType,
                   'paySign': obj.paySign,
               },
               // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
               function(res){     
                   if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                        common.jump("/my");
                   }      
               }
           ); 
        }
    }
  }
</script>
<style>
    .row{
	    flex-direction: row;
	}
	.center{
		text-align: center;
		justify-content: center;/*水平居中*/
	}
	.login-bg{
		width: 750px;
		height: 1218px;
	}
	.bg-img{
		position: absolute;
		top: 0;
		left: 0;
	}
	.clumn-login{
		margin-top: 38px;
		margin-bottom: 38px;
		height: 86px;
		line-height: 86px;
	    background-color: rgba(85,67,31,.15);
	    padding-left: 28px;
		padding-right: 28px;
		position: relative;
	}
	.clumn-select{
		height: 266px;
		background-color: rgba(85,67,31,.15);
	    padding-left: 28px;
		padding-right: 28px;
	}
	.clumn-tit{
		font-size: 26px;
        color: #e7dcbf;
        width: 170px;
        text-align: left;
        margin-top: 25px!important;
	}
	.input-login{
		height: 46px;
	    line-height: 46px;
	    border: none;
	    background: transparent;
	    margin-top:20px;
	    margin-bottom: 20px;
	    width: 500px;
	    font-size: 24px;
	    color: #e7dcbf;
	}
	.recharge-sure-btn{
        width: 124px;
        height: 33px;
        position: absolute;
        right: 40px;
        top:25px;
	}
	.select-meal-img{
		width: 226px;
	    height: 110px;
	}
	.meal-detail{
		font-size: 20px;
        color: #515151;
        line-height: 30px;
	}
	.meal-price{
		font-size:30px;
	    color: #dd2727;
	}
</style>