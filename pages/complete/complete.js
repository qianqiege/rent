// pages/success/success.js
const util = require('../../utils/util.js');
Page({
  data: {
    id: ''
  },

  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    })
  },

  //返回首页
  returnPage: function () {
    wx.switchTab({
      url: '../home/home',
    })
  },
})