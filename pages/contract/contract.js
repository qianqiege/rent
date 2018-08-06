const util = require('../../utils/util.js');
Page({
  data: {
    pathCon: ''
  },
  onLoad: function (options) {
    var id = options.id;
    var order_no = options.order_no;
    this.setData({
      pathCon: util.bashUrl + '/rent-order/order-info?order_id='+id + '&page=lebaifen&order_no=' + order_no
    })
  },
})