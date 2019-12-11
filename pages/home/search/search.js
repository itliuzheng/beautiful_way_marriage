// pages/index/exact_match/exact_match.js
const config = require('../../../utils/config.js');
let app = getApp()

Page({
  data: {
    mate: null,
    nowResidence: [],
    nowResidence2:[],
    info: {}
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


    config.ajax('GET', {}, `/home/initHomeFilter`, (resp) => {
      let res = resp.data;
      wx.hideLoading();
      if (res.code == 1) {
        this.setData({
          mate: res.data
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


    config.ajax('GET', {}, `/home/getHomeFilterList`, (resp) => {
      let res = resp.data;
      wx.hideLoading();
      if (res.code == 1) {
        let arr = res.data;
        // let advanced = arr.advanced;
        // let arbaseInfor = arr.baseInfo;
        let json = {};

        arr.forEach((value) => {
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

  bindPickerChangeAddress: function (e) {
    let address = e.detail.value.join('-');

    console.log(address);
    let type = e.currentTarget.dataset.value;
    //获取数组下标
    let mate_index = this.getArrayIndex(this.data.mate.advanced, type);

    //获取已选择的参数
    let _name = this.data.mate.advanced[mate_index].value
    let _value = address
    let _desc = address
    let _ruleType = '='

    let info = {};
    info[type] = {
      ruleNameZh: _name,
      ruleName: type,
      ruleValue: _value,
      ruleDesc: _desc,
      ruleType: _ruleType
    };
    let _info = Object.assign({}, this.data.info, info)

    this.add(info[type]);

    this.setData({
      info: _info
    })

  },
  bindPickerChangeAddress2: function (e) {
    let address = e.detail.value.join('-');
    this.setData({
      "nowResidence2": e.detail.value,
      "info.nowResidence2": address
    })
  },
  bindPickerChangeBaseInfo: function(e) {
    // console.log('picker发送选择改变，携带值为', e)

    let _index = e.detail.value;
    let type = e.currentTarget.dataset.value;
    //获取数组下标
    let mate_index = this.getArrayIndex(this.data.mate.baseInfo, type);

    //获取已选择的参数
    let _name = this.data.mate.baseInfo[mate_index].value
    let _value = this.data.mate.baseInfo[mate_index].properties[_index].value
    let _desc = this.data.mate.baseInfo[mate_index].properties[_index].desc
    let _ruleType = this.data.mate.baseInfo[mate_index].properties[_index].type

    let info = {};
    info[type] = {
      ruleNameZh: _name,
      ruleName: type,
      ruleValue: _value,
      ruleDesc: _desc,
      ruleType: _ruleType
    };
    let _info = Object.assign({}, this.data.info, info)

    this.add(info[type]);

    this.setData({
      info: _info
    })

    // console.log(this.data.info);
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e)

    let _index = e.detail.value;
    let type = e.currentTarget.dataset.value;
    //获取数组下标
    let mate_index = this.getArrayIndex(this.data.mate.advanced, type);

    //获取已选择的参数
    let _name = this.data.mate.advanced[mate_index].value
    let _value = this.data.mate.advanced[mate_index].properties[_index].value
    let _desc = this.data.mate.advanced[mate_index].properties[_index].desc
    let _ruleType = this.data.mate.advanced[mate_index].properties[_index].type

    let info = {};
    info[type] = {
      ruleNameZh: _name,
      ruleName: type,
      ruleValue: _value,
      ruleDesc: _desc,
      ruleType: _ruleType
    };
    let _info = Object.assign({}, this.data.info, info)

    this.add(info[type]);

    this.setData({
      info: _info
    })

    // console.log(this.data.info);
  },
  add(json) {

    let info = this.data.info;

    // wx.showLoading({
    //   title: '数据保存中...',
    //   mask: true,
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    
    console.log(info);

    config.ajax('POST', json, `/home/addHomeFilter`, (res) => {
      // wx.hideLoading();

      if (res.data.code == 1) {

      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },

  btn() {

    let info = this.data.info;


    // wx.navigateBack({})
    console.log(info);
    wx.navigateTo({
      url: '/pages/index/list/list',
    })
  }
})