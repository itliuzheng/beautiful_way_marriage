//index.js
const config = require('../../utils/config.js');
let app = getApp()

Page({
  data: {
    info:null,
    STATUS:null
  },
  not_open_yet() {

    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  onLoad: function () {
    this.getInit();
    this.getStatus();
  },
  getStatus() {

    let _this = this;

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('GET', {
    }, `/auth/status`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          STATUS: res.data
        })
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },

  goDetail(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;

    var token = wx.getStorageSync('token')

    if (!app.globalData.userInfo) {
      config.mytoast('您还未登录，请先登录', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }, 500)
      return false;
    }
    if (!token) {
      config.mytoast('您还未登录，请先登录', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/login/login',
        })
      }, 500)
      return false;
    }

    if (!this.data.STATUS.completeInfo) {
      config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/person_info/person_info',
        })
      }, 500)
      return false;
    }
    if (!this.data.STATUS.userAuth) {
      config.mytoast('您尚未实名认证，请前往认证！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/my_certification/my_certification',
        })
      }, 500)
      return false;
    }

    wx.navigateTo({
      url: `/pages/message/list/list?name=${type}`,
    })

  },
  getInit() {
    let that = this;

    config.ajax('GET', {

    }, `/message/`, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
          that.setData({
            info: res.data
          })
        
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
})
