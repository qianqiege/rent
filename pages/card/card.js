// pages/card/card.js
const util = require('../../utils/util.js');
Page({
  data: {
    sdate: '',
    month: '月',
    year: '年',
    name: '',
    idCard: '',
    credit: '',
    num: '',
    alertModel: false,
    msg: '',
    phcode: '获取验证码',
    Image: '',
    showText: true,
    showImage: false,
    order_id: '',
    showPrompt: false,
    promptMsg:''
  },

  onLoad: function(options) {
    var order_id = options.id;
    console.log(order_id);
    var that = this;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    var formDate = year + '-' + month + '-' + day;
    that.setData({
      sdate: formDate,
      order_id: order_id
    })
  },

  nameInput: function(e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
    var name = that.data.name;
    var nm = /^[\u4e00-\u9fa5][\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
    if (name == '') {
      that.setData({
        alertModel: false
      })
    } else if (!nm.test(name)) {
      that.setData({
        alertModel: true,
        msg: '请正确填写姓名'
      })
    }
  },

  cardInput: function(e) {
    var that = this;
    that.setData({
      idCard: e.detail.value
    })
    var idCard = this.data.idCard;
    // var reg = /^(1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|81|82|90)([0-5][0-9]|90)(\\d{2})(19|20)(\\d{2})((0[13578][1-9]|0[13578][12][0-9]|0[13578]3[01]|1[02]3[01])|(0[469][1-9]|0[469][12][0-9]|30)|(02[1-9]|02[12][0-9]))(\\d{3})([0-9]|x)$/;
    var regexp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (idCard == '') {
      that.setData({
        alertModel: false
      })
    } else if (!regexp.test(idCard)) {
      that.setData({
        alertModel: true,
        msg: '请填写有效证件号码'
      })
    }
  },

  creditInput: function(e) {
    var that = this;
    that.setData({
      credit: e.detail.value
    })
    var credit = this.data.credit;
    if (credit == '') {
      that.setData({
        alertModel: false
      })
    } else if(credit.length<14){
      that.setData({
        alertModel: true,
        msg: '请填写正确的卡号'
      })
    }
  },

  numberInput: function(e) {
    var that = this;
    that.setData({
      num: e.detail.value
    })
    var num = that.data.num;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (num == '') {
      that.setData({
        alertModel: false
      })
    } else if (!myreg.test(num)) {
      that.setData({
        alertModel: true,
        msg: '请填写正确的手机号'
      })
    }
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var all = e.detail.value;
    var d = all.split('-');
    var yy = d[0].slice(2);
    this.setData({
      date: e.detail.value,
      month: d[1],
      year: yy
    })
  },

  doGetCode: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(res);

        const uploadTask = wx.uploadFile({
          url: util.bashUrl + '/rent-order/upload-img-ocr',
          filePath: tempFilePaths[0],
          name: 'avatar',
          header: {
            'Authorization': 'Bearer ' + getApp().globalData.token,
          },
          formData: {
            filename: 'avatar',
            type: 'idcard' //识别身份证
          },
          success: function(res) {
            var result = JSON.parse(res.data);
            console.log(result)
            if (result.code == 0) {
              that.setData({
                name: result.data.name,
                idCard: result.data.id,
              })
            } else {
              wx.showModal({
                title: '提示',
                content: result.msg
              });
            }
          }
        });

        uploadTask.onProgressUpdate(function(res) {
          wx.showLoading({
            title: '上传中' + res.progress + "%",
            mask: true
          });
          console.log('上传进度', res.progress);
          if (res.progress == 100) {
            setTimeout(function() {
              wx.hideLoading();
            }, 2000); //延迟一下，等待后端服务加载完成
          }
          console.log('已经上传的数据长度', res.totalBytesSent);
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
        });
      }
    })
  },

  doGetBankCode: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(res);

        const uploadTask = wx.uploadFile({
          url: util.bashUrl + '/rent-order/upload-img-ocr',
          filePath: tempFilePaths[0],
          name: 'avatar',
          header: {
            'Authorization': 'Bearer ' + getApp().globalData.token,
          },
          formData: {
            filename: 'avatar',
            type: 'bankcard'
          },
          success: function(res) {
            var result = JSON.parse(res.data);
            console.log(result)
            if (result.code == 0) {
              that.setData({
                name: result.data.name,
                idCard: result.data.id,
              })
            } else {
              wx.showModal({
                title: '提示',
                content: result.msg
              });
            }
          }
        });

        uploadTask.onProgressUpdate(function(res) {
          wx.showLoading({
            title: '上传中' + res.progress + "%",
            mask: true
          });
          console.log('上传进度', res.progress);
          if (res.progress == 100) {
            setTimeout(function() {
              wx.hideLoading();
            }, 2000); //延迟一下，等待后端服务加载完成
          }
          console.log('已经上传的数据长度', res.totalBytesSent);
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
        });
      }
    })
  },

  clickSign: function() {
    wx.navigateTo({
      url: '../signature/signature',
    })

  },

  // 获取手机验证码
  getCode: function() {
    var num = this.data.num;
    if (num.length == 0) {
      this.setData({
        alertModel: true,
        msg: '请输入手机号'
      })
    } else {
      this.setData({
        alertModel: false
      })
      util.request(util.bashUrl + "/rent-order/send-pay-code", {
        mobile: num,
        contract_type: "rent"
      }, function(result) {
        console.log(result);
        if (result.code == 0) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showModal({
            title: '提示',
            content: result.msg,
            showCancel: false
          });
        }
      });
    }
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    var val = e.detail.value;
    var img = that.data.Image;
    console.log(img)
    if (val.namee == "" || val.idCard == "" || val.credit == "" || val.picker == null || val.cvn == "" || val.phone == "" || val.code == "" || img=='') {
      that.setData({
        alertModel: true,
        msg: '请完善您的资料'
      })
    } else {
      that.setData({
        alertModel: false
      })
    }
    var orid = that.data.order_id;
    console.log(orid);

    var datev = that.data.month + that.data.year;
    var data = {
      order_id: orid,
      name: val.namee,
      certificate_no: val.idCard,
      card_no: val.credit,
      cvn: val.cvn,
      sign: img,
      phone: val.phone,
      valid_date: datev,
      valid_code: val.code
    };

    util.request(util.bashUrl + "/rent-order/pay", data, function(result) {
      console.log(result);
      if (result.code == 0) {
        wx.navigateTo({
          url: '../success/success?id=' + orid,
        })
      }else{
        // that.setData({
        //   showPrompt:true,
        //   promptMsg:result.msg
        // })
      }
    }, 'POST');
  },


  // 支付失败更改资料
  renewInfo: function() {
    this.setData({
      showPrompt: false
    })
  },
  //支付失败取消订单
  cancelOrder: function() {
    var id = this.data.order_id;
    util.request(util.bashUrl + "/rent-order/update-status", {
      order_id: id,
      action: 'close'
    }, function(result) {
      if(result.code==0){
        console.log(result);
        wx.navigateTo({
          url: '../cancel/cancel',
        })
      }
    });
  }
})