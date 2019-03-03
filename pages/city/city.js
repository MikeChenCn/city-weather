// pages/city/city.js
const app = getApp();
const bmap = require('../../libs/bmap-wx.js');
let cityData = require('../../data/cityData.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:null,//搜索框的值
    results: [],//搜索城市的结果
    isNoShow: false,//判断搜索结果是否显示
    hasNoData:true //判断有无搜索结果显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let cityList = cityData.cityData.data;
    let hotCities = cityList.hotCities;
    let cities = cityList.cities;

    //获取存在缓存中的当前城市
    var currentCity=wx.getStorageSync('currentCity');

    this.setData({
      hotCities: hotCities,
      cities: cities,
      currentCity: currentCity
    });

    
  },
  //input的值变化响应事件
  bindKeyInput: function(event) {
    let keyword = event.detail.value; 
    let cities = this.data.cities;

    let results = [];

  //根据input输入值生成搜索的城市结果
    for (let i in cities) {
      cities[i].forEach((value) => {
        if (value.spell.indexOf(keyword) > -1 || value.name.indexOf(keyword) > -1) {
          results.push(value)
        }
      })
    }
    //如果输入值为空时，搜索结果框隐藏，否则打开
    if (!keyword) {
      this.setData({
        isNoShow: false
      })
    }else{
      this.setData({
        isNoShow:true
      })
    }

    //判断是否搜索到城市
    if (!results.length) {
      this.setData({
        hasNoData: true
      })
    }else{
      this.setData({
        hasNoData: false
      })
    }
  //刷新搜索结果
    this.setData({
      results: results
    })
  },
  //取消清空数据
  cancleInput() {
    this.setData({
      inputValue: null,
      isNoShow: false,
      results:[]
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