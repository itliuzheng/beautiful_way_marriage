// pages/index/exact_match/exact_match.js
const config = require('../../../../utils/config.js');
let app = getApp()

Page({
  data: {
    mate:null,
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInit();


    
  },

  getArrayIndex(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i].name === obj) {
        return i;
      }
    }
    return -1;
  },
  getInit() {

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('GET', {}, `/personal/mate-choice/initMateChoise`, (resp) => {
      let res = resp.data;
      wx.hideLoading();
      if (res.code == 1) {
        this.setData({
          mate:res.data
        })

        this.getDetail()
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },

  getDetail() {

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
        let json = {};

        arr.forEach((value)=>{
          json[value.ruleName] = {
            ruleName: value.ruleName,
            ruleDesc: value.ruleDesc,
            ruleValue: value.ruleValue
          }
        })

      this.setData({
        info: json
      })

      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e)

    let _index = e.detail.value;
    let type = e.currentTarget.dataset.value;
    //获取数组下标
    let mate_index = this.getArrayIndex(this.data.mate,type);

    //获取已选择的参数
    let _name = this.data.mate[mate_index].value
    let _value = this.data.mate[mate_index].properties[_index].value
    let _desc = this.data.mate[mate_index].properties[_index].desc
    let _ruleType = this.data.mate[mate_index].properties[_index].type

    let info = {};
    info[type] = {
      ruleNameZh:_name,
      ruleName: type,
      ruleValue: _value,
      ruleDesc: _desc,
      ruleType: _ruleType
    };
    let _info = Object.assign({}, this.data.info,info)

    this.add(info[type]);

    this.setData({
      info: _info
    })



    // console.log(this.data.info);


  },
  add(json) {

    let info = this.data.info;

    wx.showLoading({
      title: '数据保存中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })


    config.ajax('POST', json, `/personal/mate-choice/add`, (res) => {
      wx.hideLoading();

      if (res.data.code == 1) {
        

      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },

  btn() {

    let info = this.data.info;


    wx.navigateBack({})

    // wx.showLoading({
    //   title: '数据保存中...',
    //   mask: true,
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })


    // config.ajax('POST', info, `/personal/mate-choice/add`, (res) => {
    //   wx.hideLoading();

    //   if (res.data.code == 1) {
    //     config.mytoast('保存成功，正在跳转...', (res) => { })
    //     wx.navigateBack({})

    //   } else {
    //     config.mytoast(res.data.msg, (res) => { })
    //   }
    // }, (res) => {

    // })
  }
})