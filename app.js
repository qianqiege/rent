//app.js
const util = require('./utils/util.js');
App({
  onLaunch: function () {
    console.log('onLanch')
    

  },

  login:function(){
     // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var _this = this;
    // 登录
    if (getApp().globalData.token == '' || getApp().globalData.token==null){
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          util.request(util.bashUrl + "/user/wx-login", { code: res.code }, function (result) {
            var token = result.data;
            getApp().globalData.token = token;
            wx.setStorage({
              key: "token",
              data: getApp().globalData.token
            })

            if (getApp().globalData.token) {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }
          });
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    userData: null,
    token:'',
    channel_code: 'QD100000',
    order: {},
    Image:'',
    baseImg: 'https://static.test.mintongfu.com'
  },
  showErrMsg(title) {
    var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '../images/warn.png';
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;

    wx.showToast({
      title: title,
      image: image,
      duration: duration
    });
  }
})