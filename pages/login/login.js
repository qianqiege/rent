// pages/login/login.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUpdate:false,
    userPhone:'',
    verifMobile:'',
    id:'',
    getCode:'获取验证码',
    timer: '',//定时器名字
    second: '60',//倒计时初始值
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    console.log(id)
    this.setData({
      id:id
    })
  },
  update:function(){
    this.setData({
      isUpdate:false
    });
  },
  getPhoneNumber:function(e){
    var _this = this;
    if (e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showToast({ title: '没有获得手机号哟', icon:'none' , duration: 2000 });
    } else {
      util.request(util.bashUrl + "/user/encrypted-data", { wxdata:e.detail }, function (result) {
        console.log(result);
        if(result.code == 0 && result.data.phoneNumber !=''){
          _this.setData({
            userPhone:result.data.phoneNumber,
            isUpdate:true
          });
        }
      });
      
    }
  },
  verifMobile:function(e){
    var text = e.detail.value;
    this.setData({
      verifMobile:text
    })
  },
  sendCode: function () {//发送验证码
    var that = this;
    var mobile = that.data.verifMobile;
    console.log(mobile)

    if(!mobile.match(/^1[0-9]{10}$/)){
      wx.showToast({ title: '请正确填写手机号码', icon: 'none', duration: 2000 });
      return; 
    }

    util.request(util.bashUrl +"/user/sendcode", {mobile:mobile} , function (result) {
      console.log(result);
      if (result.code == 0) {
        wx.showToast({ title: '成功', icon: 'success', duration: 2000 });

        var second = that.data.second;
        console.log(second);
        that.setData({
          timer: setInterval(function () {
            second--;
            //然后把countDownNum存进data，好让用户知道时间在倒计着
            that.setData({
              second: second,
              getCode: '倒计时(' + second+')',
              disabled:true
            })
            //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
            if (second == 0) {
              //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
              //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
              clearInterval(that.data.timer);
              //关闭定时器之后，可作其他处理codes go here
              that.setData({
                getCode: '重新获取',
                disabled:false,
                second:'60'
              })
              
            }
          }, 1000)
        })
      } else {
        wx.showModal({ title: '提示', content: result.msg, showCancel: false });
      }
    });
  },
  bindPhoneToOrder:function(e){//再将手机绑定到订单
    var form = e.detail.value;
    //判断是否验证验证码
    form.isvali = this.data.isUpdate?'no':'yes';

    var mobile = form.mobile;

    if(!mobile.match(/^1[0-9]{10}$/)){
      wx.showToast({ title: '请正确填写手机号码', icon: 'none', duration: 2000 });
      return; 
    }

    var verifycode = form.verifycode;

    if( form.isvali=='yes' && verifycode != undefined && !verifycode.match(/^[0-9]{6}$/) ){
      wx.showToast({ title: '请正确填写验证码', icon: 'none', duration: 2000 });
      return; 
    }

    var order_id = this.data.id;
    console.log(order_id)
    
    form.order_id = order_id;
    util.request(util.bashUrl +"/rent-order/bind-order-mobile",form, function (result) {
      console.log(result);
      if(result.code == 0){
        getApp().globalData.token = result.data.token;
        wx.setStorage({
          key: "token",
          data: getApp().globalData.token
        });
        //跳转到下一个流程页面
        wx.navigateTo({
          url: '../confirm/confirm?id='+order_id,
        })
      }else{
        wx.showModal({ title: '提示', content: result.msg, showCancel: false });
      }
    });
  },

})


function getUserPhone(_this){
    //从api获得用户信息，如果没有手机号，则调用微信接口获得当前微信绑定的手机号
    util.request(util.bashUrl + "/user/info", {}, function (result) {
      console.log(result);
      if(result.code == 0 && result.data.phone !=''){
        _this.setData({
          userPhone:result.data.phone,
          isUpdate:false,
        });
      }else{

      }
    });
}