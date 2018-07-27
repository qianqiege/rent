// pages/success/success.js
const util = require('../../utils/util.js');
Page({
  data: {
    id: '',
    order:{},
    sku_name:''
  },

  onLoad: function (options) {
    var that = this;
    var id = options.id;
    that.setData({
      id: id
    })
    
    util.request(util.bashUrl + "/rent-order/detail", { order_id: id }, function (result) {
      console.log(result);
      var sku_name = result.data.sku_name;
      var sku = sku_name.replace(/,/g, " ");
      that.setData({
        order: result.data,
        sku_name: sku
      })
    }, 'GET');
  },

  //返回首页
  returnPage: function () {
    wx.switchTab({
      url: '../home/home',
    })
  },

  orderDetail:function(){
    var id=this.data.id;
    wx.navigateTo({
      url: '../orderInfo/orderInfo?id='+id,
    })
  }
})