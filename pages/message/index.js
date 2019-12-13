//index.js
const config = require('../../utils/config.js');
let app = getApp()

Page({
  data: {
    info:null
  },
  not_open_yet() {

    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  onLoad: function () {

  },

  goDetail(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;

    wx.navigateTo({
      url: `/pages/message/list/list?name=${type}`,
    })

  },
  getInit() {
    let that = this;

    config.ajax('POST', {

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
