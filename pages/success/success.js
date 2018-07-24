// pages/success/success.js
const util = require('../../utils/util.js');
Page({
  data: {
    id:''
  },

  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
    })
  },

  // 扫码获取imei值
  scanCode:function(){
    wx.scanCode({
      // onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      
        util.request(util.bashUrl + "/rent-order/check-imei", { order_id:this.data.id,imei:res.result }, function (result) {
          console.log(result.data)
          if (result.code == 0) {
            that.setData({
              // popular: result.data
            });
          }
        }, 'GET');
      }
    })
  }
})