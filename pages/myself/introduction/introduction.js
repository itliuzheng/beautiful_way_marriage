
const config = require('../../../utils/config.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myself: null,
    annualIncomeArray: ['3-8万', '8-12万', '12-20万', '20-30万', '30-100万', '100万以上'],
    myimg:{
      imgSrc:''
    },
    
    upload_list: [],
    noCode:false
  },

  upimg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'original',
      success: function (res) {
        let str = res.tempFilePaths[0];
        _this.setData({
          "img.backImgSrc": str
        })

        let suffix = str.substring(str.lastIndexOf('.'));

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调

            _this.setData({
              "img.backImg": res.data,
              "img.backImgExt": suffix,
            })
          }
        })

      },
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  edit(){
    this.setData({
      noCode:true
    })
  },
  cancel() {
    this.setData({
      noCode: false
    })
  },
  onShow: function () {
    this.getInit()
    this.getPhotos()
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

    config.ajax('GET', {
    }, `/user/`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          myself: res.data
        })

      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  add_upload() {
    let _this = this;

    wx.chooseImage({
      count: 9,
      sizeType: 'original',
      success: function (res) {
        let arrImg = res.tempFilePaths;
        let photos = [];
        arrImg.forEach((value,index)=>{
          wx.getFileSystemManager().readFile({
            filePath: value, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              photos.push({
                img: res.data,
                imgExt: value.substring(value.lastIndexOf('.'))
              })
              if (index == arrImg.length -1){
                _this.uploadImg(photos)
              }
            }
          })
        })
      },
    })
  },
  uploadImg(photos){

    let _this = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
      photos: photos
    }, `/personal/photo-album/add`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        _this.getPhotos();
        config.mytoast(res.msg, (res) => { });
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })
  },
  getPhotos() {
    let _this = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
    }, `/personal/photo-album/page`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          upload_list:res.data.data
        })
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  }
})