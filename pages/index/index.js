//index.js
//获取应用实例
const app = getApp();
const bmap = require('../../libs/bmap-wx.js');

Page({
  data: {
    // currentWeather: '',
    // originalData:'',
    // curLifeDate:[]
  },
  onLoad: function() {
    let BMap = new bmap.BMapWX({
      ak: '6BvK0e6fxvzYVPN2TPNQP5Iy7g0RHPpV'
    });
    let that = this;
    BMap.weather({
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
        console.log(originalData);

        var curCity = currentWeather.currentCity;
        var origData = data.originalData.results[0];
        var curLifeDate = origData.index;
        var curData = {
          week: week,
          date: date,
          curCity: curCity
        }

        console.log(curLifeDate);
        console.log(curDate);

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
  }
})