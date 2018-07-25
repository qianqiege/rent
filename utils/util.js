const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//服务器请求封装
function request(url, data, callback, method) {
  if( method == undefined ){
    method = 'POST';
  }
  wx.showLoading({ title: '加载中', mask: true });
  wx.request({//请求
    url: url,
    method: method,
    data: data,
    header: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + getApp().globalData.token ,
    },
    success: function (res) {
      callback(res.data);
    },
    fail: function (error) {
      console.log(error);
      wx.showModal({ title: '提示', content: JSON.stringify(error) , showCancel: false });
    },
    complete: function (res) {
      wx.hideLoading();
    }
  });
}

const bashUrl = 'https://client.test.mintongfu.com';
// const bashUrl = "http://www.adong.com/";

module.exports = {
  formatTime: formatTime,
  request: request,
  bashUrl:bashUrl
}