Page({
  data: {
    path: 'https://www.baidu.com/'
  },
  onLoad: function (options) {
    var path = options.path;
    console.log(options)
    this.setData({
      path: path
    })
  },
})