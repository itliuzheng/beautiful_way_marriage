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
    commentInfo:null
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
    this.getBanner();
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
  onShareAppMessage: function () {

  },
  getInit(page = 1){

    let that = this;

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
      pageNum:page
    }, `/circle/single-circle/page`, (resp) => {
      wx.hideLoading();
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
    }, (res) => {

    })
  },

  getBanner() {

    config.ajax('POST', {
      type: 2
    }, config.getBanner, (res) => {
      console.log(res.data);
      console.log(res.data.data.data);

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
  clickPraise(e) {
    let id = e.currentTarget.dataset.id;
    let is_praise = e.currentTarget.dataset.is_praise;


    let url = !is_praise ? '/praise/praise/add' : '/praise/praise/cancel';

    config.ajax('POST', {
      singleCircleId: id
    }, url, (res) => {
      console.log(res.data);

      if (res.data.code == 1) {
        this.getInit(1);
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  clickComment(e) {
    let id = e.currentTarget.dataset.id;
    let nickName = app.globalData.userInfo.nickName;
    // is_comment
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
      console.log(res.data);

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
})