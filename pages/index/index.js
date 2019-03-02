//获取应用实例
const app = getApp();
const globalData = app.globalData;
const key = globalData.key;
const bmap = require('../../libs/bmap-wx.js');

Page({
  data: {
    coorData: ''
  },
  onLoad: function(options) {
    this.getCurWeather()
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
        this.success(data)
      }
    });
  },
  //获取天气成功后，渲染数据
  success(data) {
    console.log(data);
    var currentWeather = data.currentWeather[0];
    var curDates = currentWeather.date.split(' ');

    var originalData = data.originalData.results[0].weather_data;
    console.log(originalData)


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

      let BMap = new bmap.BMapWX({
        ak: key
      });
      //根据经纬度查询对应的城市天气
      BMap.weather({
        // location: that.data.coorData,
        fail: function(data) {
          console.log('查询失败')
        },
        success: (data) => {
          this.success(data)
        }
      });
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
      key: key
    };
    wx.request({
      url: 'https://api.map.baidu.com/geocoder',
      data: searchParam,
      header: {
        "content-type": "application/json"
      },
      method: 'post',
      success(res) {
        if (res.data.status === 'OK') {
          if (res.data.result.length===0){
            that.failShowToast()
          } else {
            let coorDatas = res.data.result.location;
            let coorData = coorDatas.lng + ',' + coorDatas.lat;
            that.setData({
              coorData: coorData
            })
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