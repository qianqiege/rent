// pages/confirm/confirm.js
const util = require('../../utils/util.js');
Page({

  data: {
    order:{}
  },

  onLoad: function (options) {
    var id = options.id;
    var  that = this;
    console.log(options,id)
    util.request(util.bashUrl + "/rent-order/detail", { order_id: id }, function (result) {
      console.log(result);
      that.setData({
        order:result.data
      })
      
    }, 'GET');
  },

  getConfirm(){
    var id= this.data.order.id;
    wx.navigateTo({
      url: '../card/card?id='+id,
    })
  }
})