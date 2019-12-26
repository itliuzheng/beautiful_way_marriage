// pages/single/my_single/my_single.js
const config = require('../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background:[],
    list:[],
    is_comment:false,
    commentInfo:null,
    STATUS:null,
    user_id:null,
    show:true
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
    this.getBanner();
    this.getStatus();
    this.getUserId();
  },

  previewImg(e) {
    //预览图片
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list

    let urls = []

    imgList.forEach((value) => {
      urls.push(value.url);
    })

    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.getInit();
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
   * 页面下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.getInit();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.list.current < this.data.list.pages) {
      let page = this.data.list.current + 1;
      this.getInit(page);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options ){
    var that = this;
　　// 设置菜单中的转发按钮触发转发事件时的转发内容
　　var shareObj = {
          title: `单身圈`,        // 默认是小程序的名称(可以写slogan等)
          path: `/pages/single/index`,        // 默认是当前页面，必须是以‘/’开头的完整路径
          imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
          success: function (res) {
            // 转发成功之后的回调
            if (res.errMsg == 'shareAppMessage:ok') {}
  　　　　},
          fail: function (res) {
            // 转发失败之后的回调
            if (res.errMsg == 'shareAppMessage:fail cancel') {
            // 用户取消转发
            } else if (res.errMsg == 'shareAppMessage:fail') {
            // 转发失败，其中 detail message 为详细失败信息
            }
  　　　　}
　　};
　　// 来自页面内的按钮的转发
　　if(options.from == 'button'){
      var eData = options.target.dataset;
      shareObj = {
        title: `${eData.name}的单身圈`,       
        path: `/pages/single/user_single/user_single?id=${eData.id}`,
        imageUrl: '',
      };
      that.shareData(eData);
　　}
　　// 返回shareObj
　　return shareObj;
  },

  getInit(page = 1){

    let that = this;

    this.setData({
      show:true
    })
    config.ajax('POST', {
      pageNum:page
    }, `/circle/single-circle/page`, (resp) => {
      let res = resp.data;
      if (page != 1) {
        this.data.list.data.push.apply(this.data.list.data, res.data.data);
        this.data.list.current = res.data.current;

        that.setData({
          list: that.data.list
        })
      } else {
        that.setData({
          list: res.data
        })
      }
      that.setData({
        show: false
      })
    }, (res) => {
      that.setData({
        show: false
      })
    })
  },
  getBanner() {
    config.ajax('POST', {
      type: 2
    }, config.getBanner, (res) => {
      if (res.data.code == 1) {
        if (res.data.data){
          this.setData({
            background: res.data.data.data
          });
        }
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  clickShare(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;

    config.ajax('POST', {
    }, `/circle/single-circle/addForwardCount/${id}`, (res) => {
      console.log(res.data);

      if (res.data.code == 1) {
        this.getInit(1);
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  shareData(data) {
    let id = data.id;
    let index = data.index;

    config.ajax('POST', {
    }, `/circle/single-circle/addForwardCount/${id}`, (res) => {
      console.log(res.data);

      if (res.data.code == 1) {
        this.getInit(1);
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  clickPraise(e) {

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



    let id = e.currentTarget.dataset.id;
    let is_praise = e.currentTarget.dataset.is_praise;


    let url = !is_praise ? '/praise/praise/add' : '/praise/praise/cancel';

    config.ajax('POST', {
      singleCircleId: id
    }, url, (res) => {

      if (res.data.code == 1) {
        this.getInit(1);
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
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
    let nickName = app.globalData.userInfo.nickName;
    this.setData({
      is_comment:true,
      commentInfo:{
        id:id,
        nickName: nickName
      }
    })
  },
  commentBlur() {
    this.setData({
      is_comment: false,
    })
  },
  commentMore(e){

    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let is_show_more = e.currentTarget.dataset.is_show_more;  

    if (is_show_more) {
      this.getInit(1);
      return false;
    }
  
    config.ajax('GET', {}, `/comment/comment/all/${id}`, (res) => {

      if (res.data.code == 1) {
        let commentList = res.data.data;

        let list = this.data.list;

        list.data[index].commentList = commentList;
        list.data[index].is_show_more = true;
        this.setData({
          list: list
        })

      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })


  },
  formSubmitComment(e) {
    let content = e.detail.value.content

    console.log(
      'singleCircleId:' + this.data.commentInfo.id,
      "nickName:" + this.data.commentInfo.nickName,
      "content:"+ content);

    config.ajax('POST', {
      singleCircleId: this.data.commentInfo.id,
      nickName: this.data.commentInfo.nickName,
      content: content
    }, `/comment/comment/add`, (res) => {
      console.log(res.data);

      if (res.data.code == 1) {
        this.getInit(1);
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
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
  goUrl(e) {
    let url = e.currentTarget.dataset.url;
    var token = wx.getStorageSync('token')

    console.log(app.globalData.userInfo);
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
          url: '/pages/login/login/login?back_url=single',
        })
      }, 500)
      return false;
    }

    if (url) {
      wx.navigateTo({
        url: url,
      })
    } else {
      config.mytoast('暂未开放，敬请期待...', (res) => { });
    }
  },
  deleteSingle(e) {

    let id = e.currentTarget.dataset.id;
    let _this = this;
    console.log(e);
    console.log(id);
    wx.showLoading({
      title: '删除中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
    }, `/circle/single-circle/delete/${id}`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        this.getInit();
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })
  },
  getUserId() {
    let _this = this;

    config.ajax('GET', {
    }, `/user/`, (resp) => {
      let res = resp.data;
      if (res.code == 1) {
        if (res.data){
          this.setData({
            user_id: res.data.id
          })
        }
      } else {
        // config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
})