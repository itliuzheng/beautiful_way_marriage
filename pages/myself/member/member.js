// pages/myself/member/member.js
const config = require('../../../utils/config.js');
const app = getApp()

const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    now_time:null,
    next_time:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let now_day = new Date();
    let now = util.formatTime(now_day).substring(0, 10);
    console.log(now);
    this.setData({
      now_time: now,
      next_time: util.addDate(now_day, 365)
    })

  },
  not_open_yet() {
    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  goBuy(e){
    let now_day = new Date();
    let type = e.currentTarget.dataset.type;
    let next_time = util.addDate(now_day, e.currentTarget.dataset.time);
    this.setData({
      type: type,
      next_time: next_time
    })
  }
})