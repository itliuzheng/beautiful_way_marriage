// pages/home/index.js
const config = require('../../utils/config.js');
let app = getApp()
let timer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSwiper: 0,
    currentSwiperNav: 0,
    background: [],
    topList: [],
    recommendUserList:[],
    annualIncomeArray: ['3-8万', '8-12万', '12-20万', '20-30万', '30-100万', '100万以上'],
    expectMarriedArray: ['半年内', '一年内', '两年内'],
    hasUserInfo:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    noCode: false,
    info:null,
    home:null,
    vipLevel:false,
    isShow_wx:false,
    backTopValue:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let token = wx.getStorageSync('token') || null;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

      console.log('hasUserInfo-1--', this.data.hasUserInfo);

      console.log('token=1==', token);

      if (!token) {
        wx.navigateTo({
          url: '/pages/login/login/login'
        })
        return false;
      }
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        console.log('hasUserInfo-2--', this.data.hasUserInfo);

        console.log('token=2==', token);

        if (this.data.hasUserInfo == false) {
          clearTimeout(timer);
          wx.navigateTo({
            url: '/pages/login/index'
          })
          return false;
        }
        if (!token) {
          clearTimeout(timer);
          wx.navigateTo({
            url: '/pages/login/login/login'
          })
          return false;
        }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
      })
      console.log('hasUserInfo-3--', this.data.hasUserInfo);

      console.log('token=3==', token);

      if (this.data.hasUserInfo == false) {
        wx.navigateTo({
          url: '/pages/login/index'
        })
        return false;
      }

      if (!token) {
        wx.navigateTo({
          url: '/pages/login/login/login'
        })
        return false;
      }
    }


    // timer = setTimeout(function () {
    //   console.log('hasUserInfo-4--', _this.data.hasUserInfo);

    //   if (_this.data.hasUserInfo == false) {
    //     wx.navigateTo({
    //       url: '/pages/login/index'
    //     })
    //   }
    //   if (!token) {
    //     wx.navigateTo({
    //       url: '/pages/login/login/login'
    //     })
    //   }
    // }, 2000)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    this.getInit();
    this.getHome();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getBanner();
    this.getTopList()
    this.getRecommendUser();
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

    if (this.data.recommendUserList.current < this.data.recommendUserList.pages) {
      let page = this.data.recommendUserList.current + 1;
      this.getRecommendUser(page);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getInit() {

    let _this = this;

    config.ajax('GET', {
    }, `/auth/status`, (resp) => {
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          info: res.data
        })
      } else {
      }
    }, (res) => {

    })

  },
  isVip(e){
    let id = e.currentTarget.dataset.id;

    var token = wx.getStorageSync('token')
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

    if (this.data.info.vipLevel){
      let url = `/pages/introduction/introduction?id=${id}`
      wx.navigateTo({
        url: url,
      })
    }else{
      config.mytoast('您还不是会员，暂不能查看他/她的个人信息', (res) => { })
      wx.navigateTo({
        url: '/pages/myself/member/member',
      })
    }
  },
  getHome() {

    config.ajax('GET', {
    }, config.getHome, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
        this.setData({
          home: res.data
        });
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  getBanner() {

    config.ajax('POST', {
      type:1
    }, config.getBanner, (res) => {
      console.log(res.data);

      if (res.data.code == 1) {
        this.setData({
          background: res.data.data.data
        });
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  getTopList() {

    config.ajax('GET', {
      pageSize: 100,
      pageNum: 1
    }, `/user/topList`, (resp) => {
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          topList: res.data
        });
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  getRecommendUser(page = 1) {
    let that = this;
    config.ajax('GET', {
      pageSize: 10,
      pageNum: page
    }, `/user/topList`, (resp) => {
      let res = resp.data;
      if (res.code == 1) {
        if (page != 1) {
          this.data.recommendUserList.data.push.apply(this.data.recommendUserList.data, res.data.data);
          this.data.recommendUserList.current = res.data.current;

          that.setData({
            recommendUserList: that.data.recommendUserList
          })
        } else {
          that.setData({
            recommendUserList: res.data
          })
        }
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  not_open_yet(){

    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  goUrl(e) {
    let url = e.currentTarget.dataset.url;
    var token = wx.getStorageSync('token')
    console.log(app.globalData.userInfo);
    console.log(token);
    if (!app.globalData.userInfo) {
      config.mytoast('您还未登录，请先登录', (res) => { });
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/login/index',
        })
      },500)
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
    console.log(url);
    if (url) {
      wx.navigateTo({
        url: url,
      })
    } else {
      config.mytoast('暂未开放，敬请期待...', (res) => { });
    }
  },
  showWx(){

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
      isShow_wx:true
    })
  },
  closeMask() {
    this.setData({
      isShow_wx: false
    })
  },
  swiperChange(e) {
    this.setData({
      currentSwiperNav: e.detail.current
    })
  },
  onPageScroll(e){
    var that = this
    var scrollTop = e.scrollTop
    var backTopValue = scrollTop > 500 ? true : false
    that.setData({
      backTopValue: backTopValue
    })
  },
  backTop(){
    wx.pageScrollTo({
      scrollTop: 0,
    })
  }
})