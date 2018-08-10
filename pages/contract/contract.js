const util = require('../../utils/util.js');
Page({
  data: {
    pathCon: ''
  },
  onLoad: function (options) {
    var id = options.id;
    var order_no = options.order_no;
    console.log(options)
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res)
        that.setData({
          pathCon: util.bashUrl + '/rent-order/order-info?order_id=' + id + '&page=lebaifen&order_no=' + order_no + '&id=' + res.data
        })
      },
    })
  },
})