const util = require('../../utils/util.js');
Page({

  data: {
    iemiMsg:'点击扫码',
    imgHandson: '/images/carmer.png',
    avatar: '',
    sku: [],
    sku1: [],
    curr: 10,
    color: [],
    reason:'',
    handson:''
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
    var sku = options.sku;
    that.setData({
      id:id,
      reason:options.reason,
      sku:sku
    })
    util.request(util.bashUrl + "/rent-order/get-color-sku", { order_id: id }, function (result) {
      console.log(result.data)
      if (result.code == 0) {
        that.setData({
          color: result.data
        })
        for (var i = 0; i < result.data.length; i++) {
          if (result.data[i].current == true) {
            that.setData({
              sku: result.data[i].sku,
            })
          }
        } 
      }
    }, 'GET');
  },

  // 换机选择不同的颜色
  setModel(e, disabled) {
    var that = this;
    if (disabled == 'true') return;
    var key = e.currentTarget.dataset.key;
    console.log(e)
    that.setData({
      curr: key,
      sku1: e.currentTarget.dataset.sku
    })
  },

  uploadHandson: function () {
    var _this = this;
    upload('handson', function (data) {
      _this.setData({
        handson: data.path,
        imgHandson: data.url
      });
    });
  },
  confirmBtn:function(){
    var that =this;
    var id = that.data.id;
    var reason=that.data.reason;
    var imei = that.data.iemiMsg;
    var handson = that.data.handson;
    var sku1 = that.data.sku1;
    var sku = that.data.sku;
    if(imei==""||sku1==""){

    }else{
      util.request(util.bashUrl + "/rent-order/save-new-sku", { order_id: id, reason: reason, imei: imei, sku: sku1,handson:handson,type:1}, function (result) {
        console.log(result);
        if (result.code == 0) {
          wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
          wx.navigateTo({
            url: '../changeSucc/changeSucc?id=' + id,
          })
        } else {
          wx.showModal({ title: '提示', content: result.msg, showCancel: false });
        }
      });
    }
  }
})


//上传图片代码
function upload(filename, callback) {
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      var tempFilePaths = res.tempFilePaths;
      console.log(res);
      const uploadTask = wx.uploadFile({
        url: util.bashUrl + '/rent-order/upload-img',
        filePath: tempFilePaths[0],
        name: filename,
        header: {
          'Authorization': 'Bearer ' + getApp().globalData.token,
        },
        formData: {
          filename: filename,
          type: 'base64'
        },
        success: function (res) {
          var result = JSON.parse(res.data);
          if (result.code == 0) {
            callback(result.data);
          } else {
            wx.showModal({ title: '提示', content: result.msg });
          }
        }
      });

      uploadTask.onProgressUpdate(function (res) {
        wx.showLoading({ title: '上传中' + res.progress + "%", mask: true });
        console.log('上传进度', res.progress);
        if (res.progress == 100) {
          setTimeout(function () {
            wx.hideLoading();
          }, 2000);//延迟一下，等待后端服务加载完成
        }
        console.log('已经上传的数据长度', res.totalBytesSent);
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
      });
    }
  });

}