const util = require('../../utils/util.js');
Page({

  data: {
    iemiMsg:'点击扫码',
    imgHandson: '/images/carmer.png',
    avatar: '',
  },

  // 扫码获取imei值
  scanCode: function () {
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

  onLoad: function (options) {
    var that = this;
    var id = options.id;
    that.setData({
      id:id,
      reason:options.reason
    })
    util.request(util.bashUrl + "/rent-order/get-color-sku", { order_id: id }, function (result) {
      console.log(result.data)
      if (result.code == 0) {
        that.setData({
          sku: result.data
        })
      }
    }, 'GET');
  },
})