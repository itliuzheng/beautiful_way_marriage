// pages/music/audio/audio.js
const config = require('../../../utils/config.js');
let app = getApp()

const bgMusic = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    isOpen:false,
    starttime: '00:00', //正在播放时长
    duration: '00:00',   //总时长,
    audio:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioPlay();
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
    var that = this
    that.listenerButtonStop()//停止播放
    console.log("离开")
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  audioPlay: function () {

    let that = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('GET', {
    }, `/audio/${this.data.id}`, (resp) => {
      let res = resp.data;
      wx.hideLoading();
      if (res.code == 1) {
        this.audioDetail(res.data);
        this.setData({
          poster: res.data.imgUrl,
          audio: res.data
        })
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  audioDetail(audio){

    let that = this;
    //bug ios 播放时必须加title 不然会报错导致音乐不播放
    bgMusic.title = audio.title;
    bgMusic.epname = audio.title;
    bgMusic.src = audio.audioUrl;
    bgMusic.onTimeUpdate(() => {

      //bgMusic.duration总时长  bgMusic.currentTime当前进度
      var duration = bgMusic.duration;
      var offset = bgMusic.currentTime;
      var currentTime = parseInt(bgMusic.currentTime);
      var min = "0" + parseInt(currentTime / 60);
      var sec = currentTime % 60;

      var max = parseInt(bgMusic.duration);
      var total_min = parseInt(duration / 60);
      var total_sec = parseInt(duration % 60);
      if (total_min < 10) {
        total_min = "0" + total_min;
      };
      if (sec < 10) {
        sec = "0" + sec;
      };
      if (total_sec < 10) {
        total_sec = "0" + total_sec;
      };
      var starttime = min + ':' + sec;   /*  00:00  */
      var endtime = total_min + ':' + total_sec;   /*  00:00  */

      that.setData({
        offset: currentTime,
        starttime: starttime,
        duration: endtime,
        max: max,
        changePlay: true
      })
    })
    //播放结束
    bgMusic.onEnded(() => {
      that.setData({
        starttime: '00:00',
        isOpen: false,
        offset: 0
      })
      console.log("音乐播放结束");
    })
    bgMusic.play();
    that.setData({
      isOpen: true,
    })
  },
  audioPause: function () {
    var that = this
    bgMusic.pause()
    that.setData({
      isOpen: false,
    })
  },
  listenerButtonStop(){
    bgMusic.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },
  // 进度条拖拽
  sliderChange(e) {
    var that = this
    var offset = parseInt(e.detail.value);
    console.log(offset);
    bgMusic.play();
    bgMusic.seek(offset);
    that.setData({
      isOpen: true,
    })
  },
})