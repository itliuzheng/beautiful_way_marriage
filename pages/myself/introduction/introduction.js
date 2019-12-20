
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
    mateChoiseList:[],
    upload_list: [],
    noCode:false
  },
  previewImg(e){
    //预览图片
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list

    let urls = []

    imgList.forEach((value)=>{
      urls.push(value.imgUrl);
    })
    console.log(urls);

    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
      success: function (resp) {
        console.log('success===', resp);
      }, 
      fail: function (resp) {
        console.log('fail===',resp);
      }
    })
  },
  upimg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: 'original',
      sizeType: 'compressed',
      success: function (res) {
        let str = res.tempFilePaths[0];

        let suffix = str.substring(str.lastIndexOf('.'));

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            let json = {
              "image": res.data,
              "imageExt": suffix,

            }
            that.updateUserImage(json, str);


          }
        })

      },
    })

  },
  updateUserImage(json,src) {
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('POST', json, `/user/updateUserImage`, (resp) => {
      let res = resp.data;
      wx.hideLoading();
      if (res.code == 1) {
        let arr = res.data;

        this.setData({
          "myself.imageUrl": src
        })

      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  edit_mate_choice() {
    wx.navigateTo({
      url: '/pages/myself/introduction/mate_choice/mate_choice',
    })

  },
  edit() {
    this.setData({
      noCode: true
    })

  },
  cancel() {
    this.setData({
      noCode: false
    })
  },
  onShow: function () {
    this.getInit()
    this.getPhotos();
    this.getMateChoiseList();
  },
  getMateChoiseList() {

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('GET', {}, `/personal/mate-choice/getMateChoiseList`, (resp) => {
      let res = resp.data;
      wx.hideLoading();
      if (res.code == 1) {
        let arr = res.data;

        this.setData({
          mateChoiseList: arr
        })

      } else {
        config.mytoast(res.msg, (res) => { })
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
  addSelfIntroduce(e){

    console.log(e.detail);
    wx.showLoading({
      title: '数据保存中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('POST', {
      selfIntroduce: e.detail.value.selfIntroduce
    }, `/user/addSelfIntroduce`, (res) => {
      wx.hideLoading();

      if (res.data.code == 1) {

        this.setData({
          "myself.selfIntroduce": e.detail.value.selfIntroduce,
          noCode: false
        })

      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  add_upload() {
    let _this = this;

    wx.chooseImage({
      count: 9,
      // sizeType: 'original',
      sizeType: 'compressed',
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