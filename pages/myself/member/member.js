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
    next_time:null,
    info:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let now_day = new Date();
    let now = util.formatTime(now_day).substring(0, 10);
    this.setData({
      now_time: now,
      next_time: util.addDate(now_day, 365)
    })

  },
  onShow(){
    this.getStatus();
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
        let vipExpireDate = res.data.vipExpireDate.substring(0, 10);
        res.data.vipExpireDate = vipExpireDate;
        this.setData({
          info: res.data
        })
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  not_open_yet() {
    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  buyMember(){

    config.ajax('POST', {
      body:'会员支付',
      totalFee:0.01,
      tradeType: 'JSAPI'
    }, `/wx/pay/createOrder`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
          
        config.pay(res, function (res) {
          console.log(res);

        }, function (error) { 
          console.log(error);
        })
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })
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