// pages/index/exact_match/exact_match.js
const config = require('../../../utils/config.js');
let app = getApp()

Page({
  data: {
    sexArray: ['女', '男'],
    ageArray: [],
    heightArray: [],
    educationArray: ['初中', '高中', '大专', '本科', '研究生', '博士', '博士后'],
    maritalStatusArray: ['未婚','已婚','离异'],
    annualIncomeArray: ['3-8万', '8-12万', '12-20万', '20-30万', '30-100万', '100万以上'],
    // constellationArray: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    constellationArray: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    age: null,
    height: null,
    education:null,
    maritalStatus:null,
    nowResidence:[],
    annualIncome:null,
    constellation:null,
    info:{
      sex: null,
      age:null,
      height:null,
      education: null,
      maritalStatus: null,
      nowResidence: null,
      annualIncome: null,
      constellation:null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ageArray = [];
    let heightArray = [];
    for (let i = 18; i <= 60; i++) {
      ageArray.push(i);
    }
    for (let i = 140; i <= 240; i++) {
      heightArray.push(i);
    }

    this.setData({
      "ageArray": ageArray,
      "heightArray": heightArray,
    })
    this.getInit();
  },

  switch1Change() {

  },
  getArrayIndex(arr, obj) {
      var i = arr.length;
      while(i--) {
    if (arr[i] === obj) {
      return i;
    }
  }
  return -1;
  },
  getInit(){

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('GET', {}, `/user/`, (res) => {
      wx.hideLoading();
      if (res.data.code == 1) {
        let date = res.data.data
        let _age = this.getArrayIndex(this.data.ageArray, date.age)
        let _height = this.getArrayIndex(this.data.heightArray, Number(date.height))
        let _constellation = this.getArrayIndex(this.data.constellationArray, date.constellation)
        
        this.setData({
          info: date,
          age: _age,
          height: _height,
          education: Number(date.education) - 1,
          maritalStatus: date.maritalStatus,
          nowResidence: date.nowResidence.split('-'),
          annualIncome: date.annualIncome,
          constellation: _constellation
        })
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  bindPickerChangeSex: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      "info.sex": e.detail.value
    })
  },
  bindPickerChangeAge: function (e) {
    let age = this.data.ageArray[e.detail.value];

    console.log(age)

    this.setData({
      "age": e.detail.value,
      "info.age": age
    })
  },
  bindPickerChangeHeight: function (e) {
    let value = this.data.heightArray[e.detail.value];
    this.setData({
      "height": e.detail.value,
      "info.height": value
    })
  },
  bindPickerChangeEducation: function (e) {
    this.setData({
      "education": e.detail.value,
      "info.education": Number(e.detail.value)+1
    })
  },
  bindPickerChangeMaritalStatus: function (e) {
    this.setData({
      "maritalStatus": e.detail.value,
      "info.maritalStatus": Number(e.detail.value)
    })
  },
  bindPickerChangeAddress: function (e) {
    let address = e.detail.value.join('-');
    this.setData({
      "nowResidence": e.detail.value,
      "info.nowResidence": address
    })
  },
  bindPickerChangeAnnualIncome: function (e) {
    this.setData({
      "annualIncome": e.detail.value,
      "info.annualIncome": Number(e.detail.value)
    })
  },
  bindPickerChangeConstellation: function (e) {
    let value = this.data.constellationArray[e.detail.value];
    this.setData({
      "constellation": e.detail.value,
      "info.constellation": value
    })
  },
  btn(){

    let info = this.data.info;

    if (!info.sex) {
      config.mytoast('性别不能为空', (res) => { })
      return false;
    }
    if (!info.age) {
      config.mytoast('年龄不能为空', (res) => { })
      return false;
    }
    if (!info.height) {
      config.mytoast('身高不能为空', (res) => { })
      return false;
    }
    if (!info.education) {
      config.mytoast('学历不能为空', (res) => { })
      return false;
    }
    if (info.maritalStatus == null) {
      config.mytoast('婚况不能为空', (res) => { })
      return false;
    }
    if (!info.nowResidence) {
      config.mytoast('现居住地不能为空', (res) => { })
      return false;
    }
    if (info.annualIncome == null) {
      config.mytoast('年收入不能为空', (res) => { })
      return false;
    }
    if (!info.constellation) {
      config.mytoast('星座不能为空', (res) => { })
      return false;
    }

    wx.showLoading({
      title: '数据保存中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('POST', info, `/user/user/update`, (res) => {
      wx.hideLoading();

      if (res.data.code == 1) {
        config.mytoast('保存成功，正在跳转...', (res) => { })
        wx.switchTab({
          url: '/pages/home/index',
        })

      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  }
})