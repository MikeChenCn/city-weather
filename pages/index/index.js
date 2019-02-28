//index.js
//获取应用实例
const app = getApp();
const bmap = require('../../libs/bmap-wx.js');

Page({
  data: {
    coorData: ''
  },
  onLoad: function(options) {
    // if (options.id) {
    //   this.setData({
    //     targetCity: options.id //获取需要查询的城市
    //   });
    //   this.getCityCoordinate(this.data.targetCity); //实现城市坐标查询
    // }

    let that = this;

    let BMap = new bmap.BMapWX({
      ak: '6BvK0e6fxvzYVPN2TPNQP5Iy7g0RHPpV'
    });
    BMap.weather({
      location: that.data.coorData,
      fail: function(data) {
        console.log('查询失败')
      },
      success: function(data) {
        console.log('查询成功');


        var currentWeather = data.currentWeather[0];
        var curDate = currentWeather.date.split(' ');
        var week = curDate[0];
        var date = curDate[1];
        var num = curDate[2].replace(/[^0-9]/ig, ""); //获取实时温度

        var originalData = data.originalData.results[0].weather_data;

        var curCity = currentWeather.currentCity;
        var origData = data.originalData.results[0];
        var curLifeDate = origData.index;
        var curData = {
          week: week,
          date: date,
          curCity: curCity
        }

        that.setData({
          currentWeather: currentWeather,
          curLifeDate: curLifeDate,
          week: week,
          date: date,
          curCity: curCity,
          num: num,
          curData: curData,
          originalData: originalData
        });
      }
    });
  },
  onShow:function(options){
    if (this.data.targetCity){
      console.log(this.data.targetCity)
    }
  },
  onToCityList() {
    wx.navigateTo({
      url: '../city/city',
    })
  },
  //获取城市坐标经纬度
  getCityCoordinate: function(param) {
    let that = this;
    let searchParam = {
      address: param,
      output: 'json',
      key: '6BvK0e6fxvzYVPN2TPNQP5Iy7g0RHPpV'
    };
    wx.request({
      url: 'https://api.map.baidu.com/geocoder',
      data: searchParam,
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success(res) {
        console.log(res);
        let coorDatas = res.data.result.location;
        let coorData = coorDatas.lng + ',' + coorDatas.lat;
        that.setData({
          coorData: coorData
        })
      }
    })
  }
})