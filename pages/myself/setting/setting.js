// pages/myself/setting/setting.js
const config = require('../../../utils/config.js');
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    switchChecked:true
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  unsubscribe() {

    let info = this.data.info;

    wx.showLoading({
      title: '资料注销中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', info, `/user/unsubscribe`, (res) => {
      wx.hideLoading();
      if (res.data.code == 1) {
        config.mytoast('资料注销成功，正在跳转...', (res) => { })
        wx.navigateBack({})
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  }
})
