// pages/confirm/confirm.js
const util = require('../../utils/util.js');
Page({
  data: {
    order:{},
    sku_name:''
  },

  onLoad: function (options) {
    var id = options.id;
    var  that = this;
    util.request(util.bashUrl + "/rent-order/detail", { order_id: id }, function (result) {
      console.log(result);
      var sku_name = result.data.sku_name;
      var sku = sku_name.replace(/,/g, " ");
      that.setData({
        order:result.data,
        sku_name:sku
      }) 
    }, 'GET');
  },

  getConfirm(){
    var id= this.data.order.id;
    util.request(util.bashUrl + "/rent-order/update-status", { order_id: id, action: "confirm" }, function (result) {
      console.log(result);
      if(result.code ==0 ){
        wx.navigateTo({
          url: '../card/card?id=' + id,
        })
      }
    }, 'POST');  
  }
})