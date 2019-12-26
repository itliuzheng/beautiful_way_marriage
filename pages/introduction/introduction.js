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
    mateChoiceList: [],
    ver_height: 230,
    education_height: 0,
    house_height: 0,
    car_height: 0,
    educationArray: ['初中', '高中', '大专', '本科', '研究生', '博士', '博士后'],
    annualIncomeArray: ['3-8万', '8-12万', '12-20万', '20-30万', '30-100万', '100万以上'],
    expectMarriedArray: ['半年内', '一年内', '两年内'],
    isShow_wx: false,
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
   * 分享
   */
  onShareAppMessage: function (options ){
    var that = this;
    　　// 设置菜单中的转发按钮触发转发事件时的转发内容
    　　var shareObj = {
              title: `${that.data.info.user.realName}的个人资料`,        // 默认是小程序的名称(可以写slogan等)
              path: `/pages/introduction/introduction?id=${that.data.info.user.id}`,        // 默认是当前页面，必须是以‘/’开头的完整路径
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
    
    if (!this.data.myself.completeInfo) {
      config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/person_info/person_info',
        })
      }, 500)
      return false;
    }
    if (this.data.myself.userAuth != 1) {
      config.mytoast('您尚未实名认证，请前往认证！', (res) => { });
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
        wx.navigateBack({
          
        })
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
  clickShow(e){
    let type = e.currentTarget.dataset.type;

    if (type == 'education'){

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
    }else{

      let height = this.data.ver_height;
      if (height == 230) {

        this.setData({
          ver_height: 0
        })
      } else {
        this.setData({
          ver_height: 230
        })
      }

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

    if (!this.data.myself.completeInfo) {
      config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/person_info/person_info',
        })
      }, 500)
      return false;
    }
    if (this.data.myself.userAuth != 1) {
      config.mytoast('您尚未实名认证，请前往认证！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/my_certification/my_certification',
        })
      }, 500)
      return false;
    }
    if (!this.data.myself.vipLevel) {
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