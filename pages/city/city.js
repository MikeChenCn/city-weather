// pages/city/city.js
const app = getApp();
const bmap = require('../../libs/bmap-wx.js');
let cityData = require('../../data/cityData.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sugData: '',
    inputValue:null,
    results: [],
    isShow: true,
    hasNoData:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let cityList = cityData.cityData.data;
    let hotCities = cityList.hotCities;
    let cities = cityList.cities;

    this.setData({
      hotCities: hotCities,
      cities: cities
    });
  },
  bindKeyInput: function(event) {
    let keyword = event.detail.value;
    let cities = this.data.cities;

    let results = [];

    for (let i in cities) {
      cities[i].forEach((value) => {
        if (value.spell.indexOf(keyword) > -1 || value.name.indexOf(keyword) > -1) {
          results.push(value)
        }
      })
    }
    if (!keyword) {
      results = []
    }

    this.setData({
      results: results
    })

    if(this.data.results.length){
      this.setData({
        hasNoData:false
      })
    }
    console.log(results)
  },
  cancleInput() {
    this.setData({
      inputValue: null,
      isShow: true
    })
  },
  onTapCity: function(event) {
    let targetCity = event._relatedInfo.anchorTargetText;
    wx.navigateBack({
      url: '../index/index?id=' + targetCity
    });
    //将查询的城市传到首页
    var pages = getCurrentPages(); //获取页面栈
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      targetCity: targetCity
    })
  },
  onShareAppMessage: function() {

  }
})