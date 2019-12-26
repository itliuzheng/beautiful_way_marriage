// pages/music/index.js
const config = require('../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   * 
   * danmuList = [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      }]
   */
  data: {
    is_match: false,
    danmuList: [],
    videoList:null,
    audioList: null,
    is_comment: false,
    commentInfo: null,
    STATUS:null

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
    this.getStatus();
    // this.videoContext = wx.createVideoContext('myVideo')
  },

  getStatus() {

    let _this = this;

    config.ajax('GET', {
    }, `/auth/status`, (resp) => {
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          STATUS: res.data
        })

      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.is_match){
      //音频
      this.getAudio();
    }else{
      //视频
      this.getVideo();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();

    if (this.is_match) {
      //音频
      this.getAudio();
    } else {
      //视频
      this.getVideo();
    }
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.videoList.current < this.data.videoList.pages) {
      let page = this.data.videoList.current + 1;
      if (this.is_match) {
        //音频
        this.getAudio(page);
      } else {
        //视频
        this.getVideo(page);
      }
    }
  },
  getVideo(page = 1) {
    let _this = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('POST', {
      pageNum: page
    }, `/video/page`, (resp) => {
      let res = resp.data;
      wx.hideLoading();
      if (res.code == 1) {


        if (page != 1) {
          this.data.videoList.data.push.apply(this.data.videoList.data, res.data.data);
          this.data.videoList.current = res.data.current;

          _this.setData({
            videoList: _this.data.videoList
          })
        } else {
          _this.setData({
            videoList: res.data
          })

        }

      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  getAudio(page = 1) {
    let _this = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('POST', {
      pageNum: page
    }, `/audio/page`, (resp) => {
      let res = resp.data;
      wx.hideLoading();
      if (res.code == 1) {


        if (page != 1) {
          this.data.audioList.data.push.apply(this.data.audioList.data, res.data.data);
          this.data.audioList.current = res.data.current;

          _this.setData({
            audioList: _this.data.audioList
          })
        } else {
          _this.setData({
            audioList: res.data
          })

        }

      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  clickNav(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 'music') {
      this.getAudio(1);
      this.setData({
        is_match: true
      })
    } else {
      this.getVideo(1);
      this.setData({
        is_match: false
      })
    }
  },
  clickPlayer(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/music/audio/audio?id=${id}`,
    })
  },
  clickMessage(e){

    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/music/video/video?id=${id}`,
    })
    // config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  clickCollect(){

    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },

  clickComment(e) {

    var token = wx.getStorageSync('token')

    if (!app.globalData.userInfo) {
      config.mytoast('您还未登录，请先登录', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }, 500)
      return false;
    }
    if (!token) {
      config.mytoast('您还未登录，请先登录', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/login/login',
        })
      }, 500)
      return false;
    }
    if (!this.data.STATUS.completeInfo) {
      config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/person_info/person_info',
        })
      }, 500)
      return false;
    }
    if (this.data.STATUS.userAuth != 1) {
      config.mytoast('您尚未实名认证，请前往认证！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/my_certification/my_certification',
        })
      }, 500)
      return false;
    }
    if (!this.data.STATUS.vipLevel) {
      config.mytoast('请购买会员后再评论~', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/member/member',
        })
      }, 500)
      return false;
    }


    let id = e.currentTarget.dataset.id;
    // is_comment
    this.setData({
      is_comment: true,
      commentInfo: {
        id: id
      }
    })
  },
  formSubmitComment(e) {
    let content = e.detail.value.content

    console.log(
      'videoId:' + this.data.commentInfo.id,
      "content:" + content);

    config.ajax('POST', {
      videoId: this.data.commentInfo.id,
      content: content
    }, `/video/video-comment/add`, (res) => {
      console.log(res.data);

      if (res.data.code == 1) {
        if (this.is_match) {
          //音频
          this.getAudio();
        } else {
          //视频
          this.getVideo();
        }
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  commentBlur() {
    this.setData({
      is_comment: false,
    })
  },
})