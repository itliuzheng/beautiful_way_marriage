
const config = require('../../../utils/config.js');
let app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  getInit(page = 1) {
    let that = this;

    config.ajax('POST', {
    }, `/user/page`, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
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
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
})