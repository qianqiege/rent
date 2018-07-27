// pages/orderInfo/orderInfo.js
const util = require('../../utils/util.js');
Page({

  data: {
    orderNum: '',
    order: {},
    sku_name: '',
    id: '',
    status: '',
    Insurance: true,
    changePhone: true,
    faceSign: true,
    success:true
  },

  onLoad: function(options) {
    var id = options.id;
    var that = this;
    that.setData({
      id: id
    })
    util.request(util.bashUrl + "/rent-order/detail", {
      order_id: id
    }, function(result) {
      console.log(result);
      var sku_name = result.data.sku_name;
      var sku = sku_name.replace(/,/g, " ");
      that.setData({
        order: result.data,
        sku_name: sku,
        orderNum: result.data.order_no
      })

      var sta = result.data.order_status;
      var imei = result.data.imei;
      if (sta == 3 && imei == '') {
        that.setData({
          Insurance: false,
          changePhone: false,
          faceSign: false,
          success:true
        })
      } else if (sta == 3 && iemi !== '') {
        that.setData({
          Insurance: false,
          changePhone: false,
          faceSign: true,
          success: false
        })
      } else if (sta == 4) {
        that.setData({
          Insurance: false,
          changePhone: true,
          faceSign: false,
          success: false
        })
      } else if (sta == 5) {
        that.setData({
          Insurance: false,
          changePhone: false,
          faceSign: false,
          success: false
        })
      }
    }, 'GET');
  },
  faceSign: function() {
    var id = this.data.id;
    wx.navigateTo({
      url: '../facesign/facesign?id=' + id,
    })
  },

  success: function() {
    var id = this.data.id;
    wx.navigateTo({
      url: '../success/success?id=' + id,
    })
  },

  Insurance: function() {

  },

  changePhone: function() {
    var id = this.data.id;
    wx.navigateTo({
      url: '../change/change?id=' + id,
    })
  }
})