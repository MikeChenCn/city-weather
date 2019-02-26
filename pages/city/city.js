// pages/city/city.js
const app = getApp();
const bmap = require('../../libs/bmap-wx.js');
let cityData=require('../../data/cityData.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
      sugData: '' ,
      // hotCities:[]
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
    })
  },
  bindKeyInput: function (e) {

  },
  onTapCity:function(event){
    
    console.log(event._relatedInfo.anchorTargetText
);

    wx.redirectTo({
      url: '../index/index?id=1'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})