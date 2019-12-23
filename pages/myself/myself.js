
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
  goUrl(e) {
    let url = e.currentTarget.dataset.url;
    let isVip = e.currentTarget.dataset.vip;
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
    if (!this.data.myself.completeInfo) {
      config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/person_info/person_info',
        })
      }, 500)
      return false;
    }
    if (!this.data.myself.realName) {
      config.mytoast('您尚未实名认证，请前往认证！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/my_certification/my_certification',
        })
      }, 500)
      return false;
    }
    if (isVip){
      if (!this.data.myself.vipLevel) {
        config.mytoast('请购买会员后查看~', (res) => { });
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/myself/member/member',
          })
        }, 500)
        return false;
      }
    }
    
    if(url){
      wx.navigateTo({
        url: url,
      })
    }else{
      config.mytoast('暂未开放，敬请期待...', (res) => { });
    }

  }
})
