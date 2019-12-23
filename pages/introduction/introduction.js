const config = require('../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    myself:null,
    other_id:null,
    my_id:null,
    myimg:{
      imgSrc:''
    },
    upload_list: [{},{},{},{}],
    mateChoiceList:[],
    ver_height: 230,
    educationArray: ['初中', '高中', '大专', '本科', '研究生', '博士', '博士后'],
    annualIncomeArray: ['3-8万', '8-12万', '12-20万', '20-30万', '30-100万', '100万以上'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      other_id: Number(options.id)
    })
    this.getUserId();
    this.getInit(options.id)
  },

  not_open_yet() {
    config.mytoast('暂未开放，敬请期待...', (res) => { });
  },
  previewImg(e) {
    //预览图片
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list

    let urls = []

    imgList.forEach((value) => {
      urls.push(value.imgUrl);
    })

    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  clickLike(e) {
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
    
    if (!this.data.myself.realName) {
      config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/my_certification/my_certification',
        })
      }, 500)
      return false;
    }


    let is_like = e.currentTarget.dataset.is_like;
    let url = '/like/add'

    if (is_like){
      url = '/like/cancel'
    }
    
    if (this.data.my_id == this.data.other_id) {
      config.mytoast('亲，太自恋可不太好喔~', (res) => { })
      return false;
    }

    config.ajax('POST', {
      likeUserId:this.data.my_id,
      likedUserId:this.data.other_id
    }, url, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
        this.getInit(this.data.other_id);
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  getUserId() {

    config.ajax('GET', {
    }, `/user/`, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
        this.setData({
          my_id: res.data.id,
          myself:res.data
        });
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  // json转map
  _objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  },
  getInit(userId) {

    config.ajax('POST', {
      userId: userId
    }, `/user/detail`, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
        if (res.data) {
          let arr = this._objToStrMap(res.data.mateChoice)
          let list = [];

          arr.forEach(function (value, key, map) {
            list.push({
              name: key,
              value: value
            });
          });

          this.setData({
            info: res.data,
            mateChoiceList: list
          });
        }else{
          wx.navigateBack({})
        }

      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  goMorePhoto() {
    let dom = {
      img: 1,
      choose: false
    };
    let _this = this;
    let arr = _this.data.upload_list;

    arr.push(dom);
    arr.push(dom);
    arr.push(dom);
    this.setData({
      upload_list: arr
    })
  },
  clickShow(){
    let height = this.data.ver_height;
    if (height == 230){

      this.setData({
        ver_height: 0
      })
    } else {
      this.setData({
        ver_height: 230
      })

    }
  }
})