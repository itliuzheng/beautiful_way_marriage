//index.js
const config = require('../../utils/config.js');
let app = getApp()

Page({
  data: {
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
})
