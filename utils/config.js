//注册或登录
const getUid = '/wx/user/login',
  //主域名
  https = "http://192.168.11.121:8008",

  //存微信头像
  saveInfo = '/wx/user/saveInfo',
  //活动预约
  activity = '/activity/activity/page',
  //我的活动预约
  my_activity = '/activity/activity/my',
  // 预约操作
  activity_book = '/activity/activity/book',

  //获取微信手机号
  getWXPhone = '/wx/user/getWXPhone',
  //用户登录
  userlogin = '/user/login',
  //注册
  register = '/wx/user/register',

  //获取banner
  getBanner = '/allocation/banner-config/page',
  //获取 咨询管理
  getNews = '/allocation/news/page'

  
/**
 * 封装本地存储
 */
function setStorage(key, value, successData) {
  wx.setStorage({
    key: key,
    data: value,
    success: function (res) {
      successData(res)
    }
  })
}

function rem(height, successData) {
  wx.getSystemInfo({
    success: (res) => {
      if (height != null && height != undefined && height != '') {
        var myheight = res.windowHeight - res.windowWidth / 750 * height
      } else {
        var myheight = res.windowHeight
      }
      successData(myheight)
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}

/**
 * 使用微信内置地图查看位置
 */
function chooseLocation() {
  wx.openLocation({
    latitude: '',
    longitude: '',
    scale: '',
    name: '',
    address: '',
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
}
/**
 * 选择图片
 */
function chooseImage(successData) {
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: (res) => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      // var tempFilePaths = res.tempFilePaths
      successData(res)
    }
  })
}
/**
 * 封装获取uid
 */
function getuid(successData, errorData) {
  // 获取用户信息
  wx.login({
    success: (res) => {
      ajax('POST', {
        js_code: res.code
      }, getUid, (res) => {
        successData(res)
      }, (res) => {
        errorData(res)
      })
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}
/**
 * 封装自定义优美的toast
 */
function mytoast(main, successData) {
  wx.showToast({
    title: main,
    icon: 'none',
    mask: true,
    success: function (res) {
      setTimeout((res) => {
        successData(res)
      }, 1500)
    },
    fail: function (res) { },
    complete: function (res) { },
  })
}
/**
 * 读取本地存储
 */
function getStorage(key, successData, faildata) {
  wx.getStorage({
    key: key,
    success: function (res) {
      successData(res)
    },
    fail: function (res) {
      faildata(res)
    }
  })
}
/**
 * 获取自定义data变量
 */
function getData(e, name) {
  return e.currentTarget.dataset[name]
}
/**
 * 自定义封装支付函数
 */
function pay(res, successData, errorData) {
  wx.requestPayment({
    "timeStamp": res.data.data.timeStamp,
    "nonceStr": res.data.data.nonceStr,
    "package": res.data.data.package,
    "signType": "MD5",
    "paySign": res.data.data.paySign,
    "success": function (res) {
      wx.showToast({
        title: '支付完成',
        icon: "success",
        duration: 1500,
        success: function (data) {
          successData(data)
        }
      })
    },
    "fail": function (res) {
      if (errorData) {
        errorData(res)
      }
      wx.showToast({
        title: '取消支付成功！',
        icon: "success",
        duration: 1500,
      })
    }
  })
}
/**
 * 自定义request请求基类
 */
function ajax(Type, params, url, successData, errorData, completeData) {
  var methonType = "application/json";
  var token = wx.getStorageSync('token') || null;
  //访问的主域名
  if (Type === 'GET') {
    var p = Object.keys(params).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    }).join("&");
    url += '?' + p;
    params = {}
  }
  // if (Type == "POST") {
  //   methonType = "application/x-www-form-urlencoded;charset=UTF-8"
  // }
  
  let header = {};
  if(token){
    header = {
      'content-type': methonType,
      'Authorization': token
    }
  }else{

    header = {
      'content-type': methonType
    }
  }
  
  
  wx.request({
    url: https + url,
    method: Type,
    header: header,
    data: params,
    success: (res) => {
      successData(res)
    },
    error(res) {
      if (errorData) {
        errorData(res)
      }
    },
    complete(res) {
      if (completeData) {
        completeData(res)
      }
    }
  })
};

//导出模块
module.exports = {
  ajax: ajax,
  getUid: getUid,
  getuid: getuid,
  mytoast: mytoast,
  saveInfo: saveInfo,
  activity: activity,
  my_activity: my_activity,
  activity_book: activity_book,
  getWXPhone: getWXPhone,
  register: register,
  userlogin: userlogin,
  setStorage: setStorage,
  getStorage: getStorage,
  getBanner: getBanner,
  getNews: getNews
} 