// pages/facesign/facesign.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar:'/images/facesign/pic.png',
    back: '/images/facesign/pic.png',
    handson: '/images/facesign/pic.png',
    iptAvatar:'',
    iptBack: '',
    iptHandson: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
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
  uploadBack:function(){
    var _this = this;
    upload('back',function(data){
      _this.setData({
        iptBack:data.path,
        back:data.url
      });
    });
  },
  uploadHandson:function(){
    var _this = this;
    upload('handson',function(data){
      _this.setData({
        iptHandson:data.path,
        handson:data.url
      });
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
          type:'bankcard'
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