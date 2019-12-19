
const config = require('../../utils/config.js');
let app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    list:null
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
    this.getStatus();
    this.getInit();

  },

  /**
   * 页面下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();

    this.getInit();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.list.current < this.data.list.pages) {
      let page = this.data.list.current + 1;
      this.getInit(page);
    }
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
          info: res.data
        })
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  isVip(e) {
    let id = e.currentTarget.dataset.id;
    if (this.data.info.vipLevel) {
      let url = `/pages/introduction/introduction?id=${id}`
      wx.navigateTo({
        url: url,
      })
    } else {
      config.mytoast('您还不是会员，暂不能查看他/她的个人信息', (res) => { })
      wx.navigateTo({
        url: '/pages/myself/member/member',
      })
    }
  },
  getInit(page = 1) {
    let that = this;

    config.ajax('POST', {
    }, `/user/page`, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
        if (page != 1) {
          this.data.list.data.push.apply(this.data.list.data, res.data.data);
          this.data.list.current = res.data.current;

          that.setData({
            list: that.data.list
          })
        } else {
          that.setData({
            list: res.data
          })

        }
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
})