
const config = require('../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  goUrl(e) {
    let url = e.currentTarget.dataset.url;
    var token = wx.getStorageSync('token')

    console.log(url);
    console.log(app.globalData.userInfo);
    console.log(token);

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
    if (url) {
      wx.navigateTo({
        url: url,
      })
    } else {
      config.mytoast('暂未开放，敬请期待...', (res) => { });
    }
  }
})