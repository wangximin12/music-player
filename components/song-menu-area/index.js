// components/song-menu-area/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songMenu: {
      type: Array,
      value: []
    },
    title: {
      type: String,
      value: "默认歌单"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 拿到全局的app,js中的数据
    // 拿到屏幕的宽度
    screenWidth: app.globalData.screenWidth
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMenuClick(event) {
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/detail-songs/index?id=${item.id}&type=menu`
      })

    }
  }
})
