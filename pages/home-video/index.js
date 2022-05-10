import {getTopMV} from "../../service/api_video"
Page({
  data: {
    topMVs:[],
    hasMore: true
  },
  onLoad: function (options) {
    this.getTopMVData(0)
  },

  // 封装网络请求的方法
  getTopMVData(offset) {
    if (offset === 0){
    getTopMV(offset).then(res => {
      this.setData({topMVs:res.data})
      })
  }else {
    getTopMV(offset).then(res => {
      this.setData({topMVs: this.data.topMVs.concat(res.data)})
      this.setData({hasMore: res.hasMore})
    })
  }
  },

  onReachBottom: function () {
    wx.showNavigationBarLoading()
    if (!this.data.hasMore) {
      wx.hideNavigationBarLoading()
      return} 
    else this.getTopMVData(this.data.topMVs.length)
    wx.hideNavigationBarLoading()
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getTopMVData(0)
    this.setData({hasMore: true})
    wx.hideNavigationBarLoading()
  },

  // 事件处理
  handleVideoItemClick(event) {
    // 获取id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: "/pages/detail-video/index?id=" + id,
    })
  }
})