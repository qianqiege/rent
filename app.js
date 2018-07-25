//app.js
const util = require('./utils/util.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var _this = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        util.request(util.bashUrl +"/user/wx-login",{code:res.code}, function(result){
          var token = result.data;
          getApp().globalData.token = token;
          wx.setStorage({
            key: "token",
            data: getApp().globalData.token
          })

          // if (getApp().globalData.token) {
          //   wx.switchTab({
          //     url: '/pages/home/home',
          //   })
          // }
        });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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