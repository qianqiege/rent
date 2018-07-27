const util = require('../../utils/util.js');
Page({
  data: {
    orderCom:{},
    iemiMsg:'点击扫码',
    imei:'',
    id:'',
    sku_name:'',
    reason:'',
    reupload:false
  },

  onLoad: function (options) {
    var that = this;
    var id = options.id;
    that.setData({
      id: options.id,
      reason: options.reason
    })
    util.request(util.bashUrl + "/rent-order/detail", { order_id: id }, function (result) {
      console.log(result.data)
      var sku_name = result.data.sku_name;
      var sku = sku_name.replace(/,/g, " ");
      if (result.code == 0) {
        that.setData({
          orderCom: result.data,
          imei:result.data.imei,
          sku_name:sku
        })
      }
    }, 'GET');
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

  //验证imei
  verify:function(){
    var that= this;
    var id = that.data.id;
    var imei = that.data.imei;
    var reason = that.data.reason;
    util.request(util.bashUrl + "/rent-order/check-old-imei", { order_id: id,imei:imei }, function (result) {
      console.log(result.data)
      if (result.code == 0) {
        wx.navigateTo({
          url: '../changeInfo/changeInfo?id='+id+'&reason='+reason,
        })
      }else{
        that.setData({
          reupload:true
        })
      }
    }, 'POST');
  },

  // 验证失败重新上传
  reUp:function(){
    this.setData({
      reupload: false
    })
  }
})