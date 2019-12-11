const config = require('../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    myimg:{
      imgSrc:''
    },
    upload_list: [{},{},{},{}],
    ver_height: 230,
    educationArray: ['初中', '高中', '大专', '本科', '研究生', '博士', '博士后'],
    annualIncomeArray: ['3-8万', '8-12万', '12-20万', '20-30万', '30-100万', '100万以上'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit(options.id)
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
  getInit(userId) {

    config.ajax('POST', {
      userId: userId
    }, `/user/detail`, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
        this.setData({
          info: res.data
        });
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