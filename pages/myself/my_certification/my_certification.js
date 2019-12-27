
const config = require('../../../utils/config.js');
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null
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
    this.getStatus()
  },
  getStatus(){

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
          info:res.data
        })
        if (res.data.userAuth == 2){
          config.mytoast('认证失败，请重新认证！', (res) => { });
        }
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  goUrl(e) {
    let url = e.currentTarget.dataset.url;
    let status = e.currentTarget.dataset.status;

    if (status == 1 || status == 3){
      return false;
    }

    wx.navigateTo({
      url: url,
    })
  }
})