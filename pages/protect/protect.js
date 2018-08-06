const util = require('../../utils/util.js');
Page({
  data: {
    pathPro: '',
  },
  onLoad: function (options) {
    var id = options.id;
    var order_no = options.order_no;
    this.setData({
      pathPro: util.bashUrl + '/rent-order/order-info?order_id='+id + '&page=baozhang&order_no=' + order_no
    })
  },
})