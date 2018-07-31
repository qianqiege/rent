Page({

  data: {
    pathCon: 'https://github.com/'
  },
  onLoad: function (options) {
    var pathCon = options.pathCon;
    console.log(options)
    this.setData({
      pathCon: pathCon
    })
  },
})