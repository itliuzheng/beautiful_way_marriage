// pages/music/index.js
const config = require('../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_match: false,
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    // this.videoContext = wx.createVideoContext('myVideo')
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

  clickNav(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 'music') {
      this.setData({
        is_match: true
      })
    } else {
      this.setData({
        is_match: false
      })
    }
  },
  clickPlayer(e){

    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  clickMessage(){

    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  clickCollect(){

    config.mytoast('暂未开放，敬请期待...', (res) => { });
  }
})