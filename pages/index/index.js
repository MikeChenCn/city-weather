//获取应用实例
const app = getApp();
const globalData = app.globalData;
const key = globalData.key;
const bmap = require('../../libs/bmap-wx.min.js');

Page({
  data: {
    coorData: ''
  },
  onLoad: function(options) {
    var that=this;
    //用户拒绝访问位置后，引导用户重新设置访问位置权限
    wx.getLocation({
      success: function(res) {
        console.log(res)
        that.getCurWeather();
      },
      fail:function(){
        wx.getSetting({
          success(res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']){
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则本地天气功能将无法使用',
                success: function (tip){
                  if (tip.confirm){
                    wx.openSetting({
                      success: function (data){
                        if (data.authSetting["scope.userLocation"] === true){
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          that.getCurWeather();
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'success',
                      duration: 1000
                    })
                  }
                },
                fail: function (res){
                  wx.showToast({
                    title: '调用授权窗口失败',
                    icon: 'success',
                    duration: 1000
                  })
                }
              })
            }

          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '出行天气早知道',
      path: '/index/index?id=123'
    }
  },
  onUnload:function(){
    wx.removeStorageSync('currentCity')
  },
  //获取当前天气
  getCurWeather(){
    let that = this;

    let BMap = new bmap.BMapWX({
      ak: key
    });
    BMap.weather({
      location: that.data.coorData,
      fail: function (data) {
        console.log('查询失败')
      },
      success: (data) => {
        this.success(data);
        //获取当前城市，并存入缓存
        let currentCity=data.currentWeather[0].currentCity;
        wx.setStorageSync('currentCity', currentCity)
      }
    });
  },
  //获取天气成功后，渲染数据
  success(data) {
    var currentWeather = data.currentWeather[0];
    var curDates = currentWeather.date.split(' ');

    var originalData = data.originalData.results[0].weather_data;

    var origData = data.originalData.results[0];
    var curLifeDate = origData.index;
    var dayImg = originalData[0].dayPictureUrl;

    //header头部数据
    var curData = {
      week: curDates[0],
      date: curDates[1],
      curCity: currentWeather.currentCity
    }
    originalData[0].date = '今天';

  //刷新数据
    this.setData({
      curData: curData,
      currentWeather: currentWeather,
      curLifeDate: curLifeDate,
      num: curDates[2].replace(/[^0-9]/ig, ""), //获取实时温度
      originalData: originalData,
      dayImg: dayImg
    });
  }
  ,
  onShow: function(options) {
    if (this.data.targetCity) {
      console.log(this.data.targetCity)
      var that = this;
      this.getCityCoordinate(this.data.targetCity); //实现城市坐标查询
    }
  }, 
  onToCityList() {
    wx.navigateTo({
      url: '../city/city',
    })
  },
  failShowToast() {
    wx.showToast({
      title: '查询失败',
      icon: 'none',
      duration: 2000
    })
  },
  //获取城市坐标经纬度
  getCityCoordinate(param) {
    let that = this;
    let searchParam = {
      address: param,
      output: 'json',
      ak: key
    };

    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/',
      data: searchParam,
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success(res) {
        if (res.data.status === 0) {
          if (res.data.result.length===0){
            that.failShowToast()
          } else {
            let coorDatas = res.data.result.location;
            let coorData = coorDatas.lng + ',' + coorDatas.lat;
            that.setData({
              coorData: coorData
            })

            let BMap = new bmap.BMapWX({
              ak: key
            });
            //根据经纬度查询对应的城市天气
            BMap.weather({
              location: that.data.coorData,
              fail: function (data) {
                console.log('查询失败')
              },
              success:(data)=>{
                that.success(data)
              }
            });
          }
        } else {
          that.failShowToast()
        }
      },
      fail(data){
        console.log(data)
      }
    })
  }
})