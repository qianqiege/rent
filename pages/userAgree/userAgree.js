const util = require('../../utils/util.js');
Page({
  data: {
    path: ''
  },
  onLoad: function(options) {
    var id = options.id;
    var order_no = options.order_no;
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        console.log(res)
        that.setData({
          path: util.bashUrl + '/rent-order/order-info?order_id=' + id + '&page=yixiang&order_no=' + order_no + '&id=' + res.data
        })
      },
    })

  },
})