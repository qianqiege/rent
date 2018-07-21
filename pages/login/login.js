// pages/login/login.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUpdate:false,
    userPhone:'',
    verifMobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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

    var mobile = this.data.verifMobile;

    if(!mobile.match(/^1[0-9]{10}$/)){
      wx.showToast({ title: '请正确填写手机号码', icon: 'none', duration: 2000 });
      return; 
    }

    util.request(util.bashUrl +"/user/sendcode", {mobile:mobile} , function (result) {
      console.log(result);
      if (result.code == 0) {
        wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
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
    
    form.order_id = 9;
    util.request(util.bashUrl +"/rent-order/bind-order-mobile",form, function (result) {
      console.log(result);
      if(result.code == 0){
        getApp().globalData.token = result.data.token;
        wx.setStorage({
          key: "token",
          data: getApp().globalData.token
        });
        //跳转到下一个流程页面
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