var WxParse = require('../../../wxParse/wxParse.js');
const config = require('../../../utils/config.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    id: null,
    article: ``,
    info: null,

  },
  onLoad: function (e) {
    this.setData({
      id: e.id
    });
    this.getInit(e.id);

  },
  getInit(id) {

    let that = this;

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('GET', {}, `/article/${id}`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        that.setData({
          info: res.data
        })
        WxParse.wxParse('article', 'html', res.data.content, this, 0);
      }else{
        config.mytoast('id不能为空', (res) => { })
        wx.navigateBack({
          
        })
      }

    }, (res) => {

     }, (resp) => {})
  },
})