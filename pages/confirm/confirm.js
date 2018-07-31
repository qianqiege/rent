// pages/confirm/confirm.js
const util = require('../../utils/util.js');
Page({
  data: {
    order:{},
    sku_name:'',
    check:1
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

  ischeck:function(e){
    if (e.detail.value == '') {
      this.setData({
        check:0
      })
    }
    else {
      this.setData({
        check: 1
      })
    }
  },

  getConfirm(){
    var id= this.data.order.id;
    var check = this.data.check;
    if(check ==1){
      util.request(util.bashUrl + "/rent-order/update-status", { order_id: id, action: "confirm" }, function (result) {
        console.log(result);
        if (result.code == 0) {
          wx.navigateTo({
            url: '../card/card?id=' + id,
          })
        }
      }, 'POST');  
    } 
  },

  //易享优租用户协议
  user:function(){
    var path = 'https://blog.csdn.net/eadio/article/details/79096216';
    wx.navigateTo({
      url: '../userAgree/userAgree?path='+path,
    })
  },

  //易享优租意外保障服务协议//不需要传参
  protect: function () {
    var pathPro = 'https://blog.csdn.net/qq_33744228/article/details/80238087';
    wx.navigateTo({
      url: '../protect/protect?pathPro=' + pathPro,
    })
  },

  //个人消费分期合同
  contract: function () {
    var pathCon = 'https://gitee.com/jing785/events';
    wx.navigateTo({
      url: '../contract/contract?pathCon=' + pathCon,
    })
  }
})