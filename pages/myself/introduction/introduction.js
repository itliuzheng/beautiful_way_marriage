
const config = require('../../../utils/config.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myself: null,
    annualIncomeArray: ['3-8万', '8-12万', '12-20万', '20-30万', '30-100万', '100万以上'],
    educationArray: ['初中', '高中', '大专', '本科', '研究生', '博士', '博士后'],
    maritalStatusArray: ['未婚', '丧偶', '离异'],
    hasChildArray: ['无', '1个', '2个', '3个及以上'],
    expectMarriedArray: ['半年内', '一年内', '两年内'],
    ver_height: 130,
    education_height: 0,
    house_height: 0,
    car_height: 0,
    myimg:{
      imgSrc:''
    },
    mateChoiseList:[],
    upload_list: [],
    noCode:false,
    nickName_noCode:false,
    nickName:'',
    buttons: [{ text: '取消' }, { text: '确定' }],
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

        console.log(str);
        wx.redirectTo({
          url: `/pages/myself/introduction/cropper_img/cropper_img?src=${str}`,
        })

      },
    })
  },
  edit_avatar() {
    var that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: 'original',
      sizeType: 'compressed',
      success: function (res) {
        let str = res.tempFilePaths[0];

        console.log(str);
        wx.redirectTo({
          url: `/pages/myself/introduction/avatar/avatar?src=${str}`,
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
  edit_nickName() {
    this.setData({
      nickName_noCode: true
    })

  },
  cancel_nickName() {
    this.setData({
      nickName_noCode: false
    })
  },
  inputName(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  editNickName(e) {
    let _this = this;
    wx.showLoading({
      title: '昵称修改中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    console.log(this.data.nickName);

    config.ajax('POST', {
      nickName: _this.data.nickName
    }, `/user/updateNickName`, (res) => {
      wx.hideLoading();

      if (res.data.code == 1) {

        this.setData({
          "myself.nickName": _this.data.nickName,
          nickName_noCode: false
        })

      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

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
      title: '图片上传中...',
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
      title: '获取图片中...',
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

  },
  closeImg(e) {
    let id = e.currentTarget.dataset.id;

    let _this = this;
    wx.showLoading({
      title: '删除中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
    }, `/personal/photo-album/delete/${id}`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        this.getPhotos();
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })
  },
  /**
   * 分享
   */
  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: `${that.data.myself.realName}的个人资料`,        // 默认是小程序的名称(可以写slogan等)
      path: `/pages/introduction/introduction?id=${that.data.myself.id}`,        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      }
    };
    // 来自页面内的按钮的转发
    //   　　if(options.from == 'button'){
    //   　　　　var eData = options.target.dataset;
    //   　　　　console.log(eData.name);     // shareBtn
    //   　　　　// 此处可以修改 shareObj 中的内容
    //   　　　　shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    // 　　  }
    　　// 返回shareObj
    　　return shareObj;
  },

  clickShow(e) {
    let type = e.currentTarget.dataset.type;

    if (type == 'education') {

      let height = this.data.education_height;
      if (height == 80) {
        this.setData({
          education_height: 0
        })
      } else {
        this.setData({
          education_height: 80
        })
      }
    } else if (type == 'house') {
      let height = this.data.house_height;
      if (height == 80) {
        this.setData({
          house_height: 0
        })
      } else {
        this.setData({
          house_height: 80
        })
      }
    } else if (type == 'car') {
      let height = this.data.car_height;
      if (height == 80) {
        this.setData({
          car_height: 0
        })
      } else {
        this.setData({
          car_height: 80
        })
      }
    } else {

      let height = this.data.ver_height;
      if (height == 130) {

        this.setData({
          ver_height: 0
        })
      } else {
        this.setData({
          ver_height: 130
        })
      }

    }
  },
})