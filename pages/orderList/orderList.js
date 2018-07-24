// pages/orderList/orderList.js
Page({
  data: {
    orderList: [{
      order: {
        title: '苹果 iPhone X 浅灰色 64G 全网通',
        goods_image: 'https://cimgs1.fenqile.com/product/M00/CA/CD/hhoGAFoMC4SAMiixAACHczSWzO4333_300x300.jpg',
        amount: 5016,
        price: 8388,
        period: 12,
        insu_cost: 318,
        per_cost: 418
      },
      headMsg: {
        left: '订单号：2018032600291238',
      },
      footMsg: {
        showFoot: 'true',
        buttons: [{
          text: '去面签',
          value: 'faceSign',
          id: 0
        }, {
          text: '关闭订单',
          value: 'close',
          // disabled: 'true',
          id: 0
        }]
      }
    }, {
      order: {
        title: '苹果 iPhone X 浅灰色 64G ',
        goods_image: 'https://cimgs1.fenqile.com/product/M00/CA/CD/hhoGAFoMC4SAMiixAACHczSWzO4333_300x300.jpg',
        amount: 5016,
        price: 8388,
        period: 12,
        insu_cost: 318,
        per_cost: 418
      },
      headMsg: {
        left: '订单号：2018032600291238',
      },
      footMsg: {
        showFoot: 'true',
        buttons: [{
          text: '去付款',
          value: 'view',
          id: 1
        }]
      }
    }, {
      order: {
        title: '苹果 iPhone X 浅灰色 64G ',
        goods_image: 'https://cimgs1.fenqile.com/product/M00/CA/CD/hhoGAFoMC4SAMiixAACHczSWzO4333_300x300.jpg',
        amount: 5016,
        price: 8388,
        period: 12,
        insu_cost: 318,
        per_cost: 418
      },
      headMsg: {
        left: '订单号：2018032600291238',
      },
      footMsg: {
        showFoot: 'true',
        buttons: [{
          text: '换机',
          value: 'view',
          id: 2
        }]
      }
    }],
    status: ['全部', '待支付', '已完成', '已取消'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderList: [0, 172, 348, 520],
    sliderLeft: 72,
    showHead: {
      type: Boolean,
      default: true
    },
    showFoot: {
      type: Boolean,
      default: true
    },
    buttons: []
  },

  onLoad: function(options) {

  },

  tabClick(e) {
    var id = e.currentTarget.id;
    var that = this;
    that.setData({
      sliderOffset: this.data.sliderList[id],
      activeIndex: id
    })
  },
})