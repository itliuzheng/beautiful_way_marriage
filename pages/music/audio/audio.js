// pages/music/audio/audio.js

const bgMusic = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    isOpen:false,
    starttime: '00:00', //正在播放时长
    duration: '00:00',   //总时长
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
 
    var that = this
    //bug ios 播放时必须加title 不然会报错导致音乐不播放
    bgMusic.title = '此时此刻'
    bgMusic.epname = '此时此刻'
    bgMusic.src = that.data.src;
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