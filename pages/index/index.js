var winWidth = null;
var winHeight = null;
var _num = null;
let timer = null
const config = require('../../utils/config.js');
let app = getApp()
Page({
  data: {
    myindex: null,
    mask: false,
    lick: null,
    x: winWidth,
    y: winHeight,
    distance: "",
    otherdetail: '右滑喜欢Ta',
    animationData: {},
    content: [],
    noCode: false,
    wrapContent: false,
    expectMarriedArray: ['半年内', '一年内', '两年内'],
    is_match: true,
    hasUserInfo: false,
    STATUS: null,
    isShow_wx: false,
  },
  onLoad: function () {

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
        // config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  /**
   * 滑动函数
   */
  tap: function (e) {
    var that = this;
    var distance = that.data.distance;
    if ((distance > (winWidth + winWidth / 5)) || (distance < (winWidth - winWidth / 5))) {
      var content = that.data.content;
      if (app.globalData._ishua) {
        if (distance > (winWidth + winWidth / 5)) {
          var lick = true
          // this.getselectR(config.getData(e, 'id'))  //右滑
          that.setData({
            distance: winWidth
          })
        }
        if (distance < (winWidth - winWidth / 4)) {
          var lick = false
          // this.getselectL(config.getData(e, 'id'))  //左滑
          that.setData({
            distance: winWidth
          })
        }
        content.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          x: winWidth,
          y: winHeight,
          content: content,
          distance: winWidth,
          lick: lick
        });
      } else {
        var res = wx.getSystemInfoSync();
        winWidth = res.windowWidth;
        winHeight = res.windowHeight;
        that.setData({
          x: winWidth,
          y: winHeight,
          distance: winWidth,
          noCode: true
        });
      }
    } else {
      var res = wx.getSystemInfoSync();
      winWidth = res.windowWidth;
      winHeight = res.windowHeight;
      that.setData({
        x: winWidth,
        y: winHeight,
        distance: winWidth,
        lick: null
      })
      // that.setData({
      //   x: winWidth,
      //   y: winHeight,
      //   lick: null
      // })
    }
  },
  lookmore(e) {
    this.setData({
      lick: null
    })
    wx.navigateTo({
      // url: '/pages/index/basicInformation2/basicInformation2?userId='+e.currentTarget.dataset.id,
      url: '/pages/index/detail/detail?userId=' + e.currentTarget.dataset.id + '&type=1&status=1',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //左滑不喜欢点击函数
  unlick: function () {
    if (app.globalData._ishua) {
      var that = this
      var length = this.data.content.length - 1;
      _num = length--
      this.setData({
        myindex: _num,
        action: 'left',
        lick: false,
      })
      setTimeout(function () {
        var content = that.data.content;
        that.getselectL(content[_num].user_id)
        content.splice(_num, 1);
        console.log(content);
        that.setData({
          content: content,
        })
      }, 1000)
    } else {
      // this.setData({
      //   noCode: true
      // })
    }

  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return app.globalData.shareInfo
  },
  //右滑喜欢点击函数
  lick: function () {
    if (app.globalData._ishua) {
      var that = this
      var length = this.data.content.length - 1;
      _num = length--
      this.setData({
        myindex: _num,
        action: 'right',
        lick: true
      })
      setTimeout(() => {
        var content = that.data.content;
        that.getselectR(content[_num].user_id)
        content.splice(_num, 1);
        that.setData({
          content: content,
        })
      }, 1000)
    } else {
      // this.setData({
      //   noCode: true
      // })
    }

  },
  /**
   * 提示函数
   */
  openlick: function () {
    if (this.data.otherdetail == '右滑喜欢Ta') {
      this.setData({
        otherdetail: '左滑忽略'
      })
    } else {
      this.setData({
        mask: false
      })
      wx.setStorageSync('secMore', true)
    }
  },
  /**
   * 去授权登录页面
   */
  goloading() {
    wx.navigateTo({
      url: '/pages/index/toloading/toloading',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 获取首页滑一滑数据
   */
  getallData() {
    let _this = this;
    setTimeout(function(){

    //     if (res.data.data.step == '5' || res.data.data.step == '4') {
    //       this.setData({
    //         noCode: true,
    //         step: res.data.data.step
    //       })
    //     } else {
    //       console.log(1111)
      _this.setData({
            noCode: false
          })
    //     }
      _this.setData({
          content: [
            {},
            {},
            {},
            {}
          ]
        })

      _this.setData({
        wrapContent: true
      })
    //     let secMore = wx.getStorageSync('secMore')
    //     if (!secMore) {
    //       this.setData({
    //         mask: true
    //       })
    //     }


    },1000)
    // config.ajax('POST', {
    //   uid: res.data.data.uid
    // }, config.index, (res) => {
    //   if (res.data.data.code == '20000') {
    //     console.log(res)
    //     if (res.data.data.step == '5' || res.data.data.step == '4') {
    //       this.setData({
    //         noCode: true,
    //         step: res.data.data.step
    //       })
    //     } else {
    //       console.log(1111)
    //       this.setData({
    //         noCode: false
    //       })
    //     }
    //     this.setData({
    //       content: res.data.data.list
    //     })
    //     let secMore = wx.getStorageSync('secMore')
    //     if (!secMore) {
    //       this.setData({
    //         mask: true
    //       })
    //     }
    //   } else {
    //     config.mytoast('暂无数据', (res) => {
    //       app.globalData._ishua = false
    //       this.setData({
    //         noCode: false,
    //       })
    //       config.mytoast('没有其他了', (res) => {

    //       })
    //     })
    //   }
    //   this.setData({
    //     wrapContent: true
    //   })
    //   wx.hideLoading()

    // }, (res) => {

    // })
  },
  /**
   * 左滑不喜欢封装函数
   */
  getselectL(tid) {
    config.ajax('POST', {
      uid: app.globalData.uid,
      _type: 1,
      relation_id: tid
    }, config.select, (res) => {
      console.log(res)
      if (res.data.data.code == '40000') {
        app.globalData._ishua = false
        console.log(res.data)
        this.setData({
          mynoCode: true,
          step: res.data.data.step,
          distance: winWidth,
        })
      }
      if (res.data.data.code == '40002') {
        app.globalData._ishua = false
        // this.setData({
        //   noCode: true,
        //   otherdetail: '没有其他了...'
        // })
        config.mytoast(res.data.data.msg, (res) => {

        })
      }
    }, (res) => {

    })
  },
  /**
   * 右滑喜欢封装函数
   */
  getselectR(tid) {
    config.ajax('POST', {
      uid: app.globalData.uid,
      _type: 2,
      relation_id: tid
    }, config.select, (res) => {
      if (res.data.data.code == '40000') {
        console.log(res.data)
        app.globalData._ishua = false
        this.setData({
          noCode: true,
          step: res.data.data.step,
          distance: winWidth,
        })
      }
      if (res.data.data.code == '40002') {
        app.globalData._ishua = false
        // this.setData({
        //   noCode: true,
        //   otherdetail: '没有其他了...'
        // })
        config.mytoast('没有其他了', (res) => {

        })
      }
    }, (res) => {

    })
  },
  /**
   * 滑动检测事件
   */
  onChange: function (e) {
    var that = this;
    that.setData({
      distance: e.detail.x
    })
  },
  onScale: function (e) {
  },
  geNumdata(res) {
    config.ajax('POST', {
      uid: res.data.data.uid
    }, config.mailBoxNew, (res) => {
      if (res.data.data.code == '20000') {
        var otherNum = 0;
        console.log(res.data.data)
        for (var i = 0; i < res.data.data.list.length; i++) {
          res.data.data.list[i].myleft = 0,
            otherNum += parseInt(res.data.data.list[i].num)
        }
        otherNum = parseInt(otherNum) + parseInt(res.data.data.message_num)
      } else {
        var otherNum = 0;
        otherNum = res.data.data.message_num
      }
      console.log(otherNum)
      if (otherNum > 0) {
        wx.showTabBarRedDot({
          index: 3,
          success: function (res) {
            wx.setTabBarBadge({
              index: 3,
              text: otherNum.toString(),
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        wx.hideTabBarRedDot({
          index: 3,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }, (res) => {

    })
  },
  onShow: function () {
    this.getStatus();

    // wx.showLoading({
    //   title: '数据加载中...',
    //   mask: true,
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    var that = this;
    var res = wx.getSystemInfoSync();
    winWidth = res.windowWidth;
    winHeight = res.windowHeight;
    that.setData({
      x: winWidth,
      y: winHeight,
      distance: winWidth
    })
    // config.getuid((res) => {
    //   if (res.data.data.code == '20000') {
    //     app.globalData.uid = res.data.data.uid
    //     this.setData({
    //       delect_time: res.data.data.delete_time
    //     })
    //     this.geNumdata(res)
    //     if (res.data.data.delete_time != 0) {
    //       config.mytoast('您已被拉黑', (res) => {

    //       })
    //     }
    //     this.getallData(res)
    //   } else {
    //     config.mytoast('服务器错误,请稍后再试', (res) => { })
    //   }
    // }, (res) => { })

    /*
      测试
    */

    this.setData({
      delect_time: 0,
      // noCode: true
    })
    this.getallData()
    /*
      测试end
    */

  },
  clickNav(e){
    let type = e.currentTarget.dataset.type;
    if(type == 'match'){
      this.setData({
        is_match:true
      })
    }else{

      if (!this.data.STATUS.vipLevel) {
        config.mytoast('请购买会员后查看~', (res) => { });
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/myself/member/member',
          })
        }, 500)
        return false;
      }
      this.setData({
        is_match: false
      })
    }
  },
  goUrl(e) {
    let url = e.currentTarget.dataset.url;
    let isVip = e.currentTarget.dataset.vip;
    var token = wx.getStorageSync('token')

    console.log(url);
    console.log(app.globalData.userInfo);
    console.log(token);

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
    if (isVip) {
      if (!this.data.STATUS.vipLevel) {
        config.mytoast('请购买会员后查看~', (res) => { });
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/myself/member/member',
          })
        }, 500)
        return false;
      }
    }

    if (url) {
      wx.navigateTo({
        url: url,
      })
    } else {
      config.mytoast('暂未开放，敬请期待...', (res) => { });
    }
  },

  showWx() {

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
    if (!this.data.info.completeInfo) {
      config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/person_info/person_info',
        })
      }, 500)
      return false;
    }
    if (this.data.info.userAuth != 1) {
      config.mytoast('您尚未实名认证，请前往认证！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/my_certification/my_certification',
        })
      }, 500)
      return false;
    }
    if (!this.data.info.vipLevel) {
      config.mytoast('请购买会员后查看~', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/member/member',
        })
      }, 500)
      return false;
    }

    this.setData({
      isShow_wx: true
    })
  },
  closeMask() {
    this.setData({
      isShow_wx: false
    })
  },
})