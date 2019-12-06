// pages/single/my_single/my_single.js
const config = require('../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
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
    this.getInit();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getInit(page = 1){

    let that = this;

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
      pageNum:page
    }, `/circle/single-circle/page`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (page != 1) {
        this.data.list.data.push.apply(this.data.list.data, res.data);
        this.data.list.current = res.current;

        that.setData({
          list: that.data.list
        })
      } else {
        that.setData({
          list: res.data
        })

      }
    }, (res) => {

    })
  }
})