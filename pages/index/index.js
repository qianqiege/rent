//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatar:'/images/default.jpg',
    back: '/images/default.jpg',
    handson: '/images/default.jpg',
    iptAvatar:'',
    iptBack: '',
    iptHandson: '',
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.userData = e.detail;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
  },

  //================================== 接口案例

  createOrder: function () {//生成订单
    var data = {
      goods_id:1,
      channel_id:1,
      store_id:1,
      sku: '1,3,4,6',//用户选择机型规格等信息
      order_type: 'rent', //租赁 - rent，购买 - sale
      app_source: 'wxapp',
      pay_platform:'lbf',

    };
    util.request(util.bashUrl+"/rent-order/create",data, function (result) {
      console.log(result);
      if (result.code == 0) {
        wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
      } else {
        wx.showModal({ title: '提示', content: result.msg, showCancel: false });
      }
    });
  },
  sendCode: function () {//发送验证码
    util.request(util.bashUrl +"/user/sendcode", {mobile:'18682428250'} , function (result) {
      console.log(result);
      if (result.code == 0) {
        wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
      } else {
        wx.showModal({ title: '提示', content: result.msg, showCancel: false });
      }
    });
  },
  bindPhone: function () {//绑定手机
    var data = {
      mobile: '18682428259',
      verifycode:'666666',
      wxdata:app.globalData.userData
    };
    util.request(util.bashUrl +"/user/wx-mini-bind-mobile",data, function (result) {
      console.log(result);
      if(result.code == 0){
        app.globalData.token = result.data.token;
      }else{
        wx.showModal({ title: '提示', content: result.msg, showCancel: false });
      }
    });
  },
  bindPhoneToOrder: function () {//绑定手机到订单
    var data = {
      order_id : 1 ,
      mobile:'18682428259',
      referee_mobile:'18682428299'
    }
    util.request(util.bashUrl +"/rent-order/bind-order-mobile", data, function (result) {
      console.log(result);
      if (result.code == 0) {
        wx.showToast({ title: '成功', icon: 'success', duration: 2000 });
      } else {
        wx.showModal({ title: '提示', content: result.msg, showCancel: false });
      }
    });
  },
  faceSign:function(e){//面签操作
    var form = e.detail.value;
    util.request(util.bashUrl +"/rent-order/face-sign", form, function (result) {
      console.log(result);
      if (result.code == 0) {
        wx.showToast({title: '成功',icon: 'success',duration: 2000});
      } else {
        wx.showModal({ title: '提示', content: result.msg, showCancel:false });
      }
    });
  },

  uploadAvatar:function(){
    var _this = this;
    upload('avatar',function(data){
      _this.setData({
        iptAvatar:data.path,
        avatar:data.url
      });
    });
  },
  uploadBack: function () {
    var _this = this;
    upload('back', function (data) {
      _this.setData({
        iptBack: data.path,
        back: data.url
      });
    });
  },
  uploadHandson: function () {
    var _this = this;
    upload('handson', function (data) {
      _this.setData({
        iptHandson: data.path,
        handson: data.url
      });
    });
  },

  closeOrder: function () {//关闭订单操作
    util.request(util.bashUrl +"/rent-order/update-status", { order_id: 1,action:'close' }, function (result) {
      console.log(result);
    });
  },



  indexBanner: function () {//首页banner
    util.request(util.bashUrl +"/channel/channel-banner/rent-list", { channel_code: "QD1000" }, function (result) {
      console.log(result);
    },'GET');
  },
  indexHotGoods: function () {//首页热门商品
    util.request(util.bashUrl +"/channel/channel-hot-goods/rent-list", { channel_code: "QD1000", business_type:'is_rent' }, function (result) {
      console.log(result);
    }, 'GET');
  },
  brandList: function () {//品牌列表
    util.request(util.bashUrl +"/rent-goods/brand-list", { channel_code: "QD1000", business_type: 'is_rent' }, function (result) {
      console.log(result);
    }, 'GET');
  },
  goodsList: function () {//商品列表
    util.request(util.bashUrl +"/rent-goods/model-list", { channel_code: "QD1000", business_type: 'is_sale' }, function (result) {
      console.log(result);
    }, 'GET');
  },
  goodsDetail: function () {//商品详情
    util.request(util.bashUrl +"/rent-goods/model-detail", { channel_code: "QD1000", business_type: 'is_rent', goods_id: 1 }, function (result) {
      console.log(result);
    }, 'GET');
  },
  goodsSku: function () {//商品sku
    util.request(util.bashUrl +"/rent-goods/get-sku-price", { channel_code: "QD1000", business_type: 'is_rent', goods_id: 1, sku_ids: '1,3,5,6' }, function (result) {
      console.log(result);
    }, 'GET');
  }





})

function upload(filename,callback){
  wx.chooseImage({
    count:1,
    sizeType: ['compressed'], 
    sourceType: ['album', 'camera'], 
    success: function (res) {
      var tempFilePaths = res.tempFilePaths;
      console.log(res);
      const uploadTask = wx.uploadFile({
        url: util.bashUrl +'/rent-order/upload-img' ,
        filePath: tempFilePaths[0],
        name: filename,
        header: {
          'Authorization': 'Bearer ' + getApp().globalData.token,
        },
        formData: {
          filename:filename
        },
        success: function (res) {
          var result = JSON.parse(res.data);
          if (result.code == 0) {
            callback(result.data);
          } else {
            wx.showModal({title:'提示',content:result.msg});
          }
        }
      });

      uploadTask.onProgressUpdate(function (res) {
        wx.showLoading({ title: '上传中' + res.progress+"%",mask:true});
        console.log('上传进度', res.progress);
        if( res.progress == 100 ){
          setTimeout(function(){
            wx.hideLoading();
          },2000);//延迟一下，等待后端服务加载完成
        }
        console.log('已经上传的数据长度', res.totalBytesSent);
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
      });


    }
  });

}