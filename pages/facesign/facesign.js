// pages/facesign/facesign.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgAvatar:'/images/carmer.png',
    imgBack: '/images/carmer.png',
    imgHandson: '/images/carmer.png',
    avatar:'',
    back: '',
    handson: '',
    order_id:0,
    pickup_code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var imei = options.imei;
    console.log(imei)
    this.setData({
      order_id:id,//options.order_id,
      imei:(options.imei?options.imei:'')
    });
  },
  bindText: function (e) {
    var text = e.detail.value;
    this.setData({
      pickup_code:text
    })
  },
  uploadAvatar:function(){
    var _this = this;
    upload('avatar',function(data){
      _this.setData({
        avatar:data.path,
        imgAvatar:data.url
      });
    });
  },
  uploadBack:function(){
    var _this = this;
    upload('back',function(data){
      _this.setData({
        back:data.path,
        imgBack:data.url
      });
    });
  },
  uploadHandson:function(){
    var _this = this;
    upload('handson',function(data){
      _this.setData({
        handson:data.path,
        imgHandson:data.url
      });
    });
  },
  faceSign:function(e){//面签操作
    var form = this.data;
    util.request(util.bashUrl +"/rent-order/face-sign", form, function (result) {
      console.log(result);
      if (result.code == 0) {
        wx.showToast({title: '成功',icon: 'success',duration: 2000});
        wx.navigateTo({
          url: '../complete/complete?id='+result.data.order_id,
        })
      } else {
        wx.showModal({ title: '提示', content: result.msg, showCancel:false });
      }
    });
  }
})

//上传图片代码
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
          filename:filename,
          type:'base64'
        },
        success: function (res) {
          var result = JSON.parse(res.data);
          if (result.code == 0) {
            callback( result.data );
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