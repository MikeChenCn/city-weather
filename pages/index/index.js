//index.js
//获取应用实例
const app = getApp();
const bmap = require('../../libs/bmap-wx.js');

Page({
  data:{
    currentWeather:''
  },
  onLoad: function () {
    let BMap = new bmap.BMapWX({
      ak: '6BvK0e6fxvzYVPN2TPNQP5Iy7g0RHPpV'
    });
    let that=this;
    BMap.weather({
      fail: function (data) {
        console.log('查询失败')
      },
      success: function (data) {
        console.log('查询成功');
        var currentWeather = data;
        console.log(currentWeather);

        that.setData({
          currentWeather: currentWeather
        });
      }
    });
  }
})