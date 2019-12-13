
const config = require('../../utils/config.js');
const app = getApp()

Page({
  data: {
    myself:null
  },
  onLoad: function () {
  },
  onShow: function () {
    this.getInit()
  },
  getInit() {
    let _this = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('GET', {
    }, `/user/`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          myself: res.data
        })

      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  not_open_yet() {

    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
})
