// pages/success/success.js
const util = require('../../utils/util.js');
Page({
  data: {
    id:'',
    option_name: ['陶瓷黑', '星空紫', '雪莹白','星空灰'],
    showChoose:false,
    cancelorder:false
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
      cancelorder: true
    })
  },
  renewInfo:function(){
    this.setData({
      cancelorder: false,
      showChoose: true
    })
  },
  cancelOrder:function(){
    var id = this.data.order_id;
    util.request(util.bashUrl + "/rent-order/update-status", {
      order_id: id,
      action: 'close'
    }, function (result) {
      if (result.code == 0) {
        console.log(result);
        wx.navigateTo({
          url: '../cancel/cancel',
        })
      }
    });
  }
})