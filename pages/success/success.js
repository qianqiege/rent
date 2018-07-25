// pages/success/success.js
const util = require('../../utils/util.js');
Page({
  data: {
    id:'',
    option_name: ['陶瓷黑', '星空紫', '雪莹白','星空灰'],
    showChoose:false,
    confirmCancel:false,
    iemiMsg:'点击扫码',
    succCancel:false,
    order:{},
    sku_name:'',
  },

  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
    })
  },

  // 扫码获取imei值
  scanCode:function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        that.setData({
          iemiMsg: res.result
        });
      }
    })
  },

  nextStep:function(){
    var that = this;
    var id = that.data.id;
    var imei = that.data.iemiMsg;
    console.log(imei);
    util.request(util.bashUrl + "/rent-order/check-imei", { order_id: id, imei: imei }, function (result) {
      console.log(result.data)
      if (result.code == 0) {
        wx.navigateTo({
          url: '../facesign/facesign?id=' + id,
        })
      }
    }, 'POST');
  },

  changeSpe:function(){
    console.log('1123')
    this.setData({
      showChoose:true
    })
  },
  conbtn: function () {
    this.setData({
      showChoose: false
    })
  },
  cancel:function(){
    this.setData({
      confirmCancel: true
    })
  },
  renewInfo:function(){
    this.setData({
      confirmCancel: false,
      showChoose: true
    })
  },

  //取消订单更改订单状态
  confirmCancel:function(){
    var that = this;
    var id = that.data.id;
    util.request(util.bashUrl + "/rent-order/update-status", {
      order_id: id,
      action: 'close'
    }, function (result) {
      if (result.code == 0) {
        console.log(result);
        var sku_name = result.data.order.sku_name;
        var sku = sku_name.replace(/,/g, " ");
        that.setData({
          succCancel: true,
          order: result.data.order,
          sku_name: sku
        })
        wx.setNavigationBarTitle({
          title: '订单已取消'
        })
      }
    });
  },

  returnPage:function(){
    wx.navigateTo({
      url: '../home/home',
    })
  }
})