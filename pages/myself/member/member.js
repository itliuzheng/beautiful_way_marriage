// pages/myself/member/member.js
const config = require('../../../utils/config.js');
const app = getApp()

const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    pay_id:null,
    now_time:null,
    next_time:null,
    info:null,
    vipList:{
      "current": 0,  //当前",
      "pageSize": 0, //页大小",
      "pages": 0,   //总页数",
      "total": 0,    //总数据量",
      "data": []
    }
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
    this.getInit();
  },
  /**
   * 页面下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.getStatus();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },
  getStatus() {
    let _this = this;
    config.ajax('GET', {
    }, `/auth/status`, (resp) => {
      let res = resp.data;
      if (res.code == 1) {
        let vipExpireDate = res.data.vipExpireDate.substring(0, 10);
        res.data.vipExpireDate = vipExpireDate;
        this.setData({
          info: res.data
        })
      } else {
      }
    }, (res) => {

    })

  },
  getInit() {

    let _this = this;

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
    }, `/payment/payment-manage/getVip`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {

        let now_day = new Date();
        var pay_id, next_time, time;

        res.data.data.forEach((value, index) => {
          if (value.payNumberUnit == '月') {
            time = value.payNumber * 30
          } else if (value.payNumberUnit == '年') {
            time = value.payNumber * 365
          } else {
            time = value.payNumber
          }

          if (index == _this.data.type) {
            pay_id = value.id;
            next_time = util.addDate(now_day, time);
          }
          console.log(time);
          value.day_price = (value.price / time).toFixed(2)
          console.log(value.day_price);


        })

        this.setData({
          vipList: res.data,
          pay_id: pay_id,
          next_time: next_time
        })
      }
    }, (res) => {

    })

  },
  not_open_yet() {
    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  buyMember(){
    let _this = this;
    config.ajax('POST', {
      paymentId: _this.data.pay_id,
      tradeType: 'JSAPI'
    }, `/wx/pay/createOrder`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
          
        config.pay(res, function (res) {
          this.getStatus();
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
    let id = e.currentTarget.dataset.id;
    let payNumber = e.currentTarget.dataset.time;
    let payNumberUnit = e.currentTarget.dataset.unit;

    if (payNumberUnit == '月') {
      payNumber = payNumber * 30
    } else if (payNumberUnit == '年') {
      payNumber = payNumber * 365
    }

    let next_time = util.addDate(now_day, payNumber);

    this.setData({
      type: type,
      next_time: next_time,
      pay_id: id
    })
  }
})