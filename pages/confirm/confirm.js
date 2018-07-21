// pages/confirm/confirm.js
Page({

  data: {
    order:{}
  },

  onLoad: function (options) {
    var order = getApp().globalData.order;
    this.setData({
      order:order
    })
    console.log(order)
  },
})