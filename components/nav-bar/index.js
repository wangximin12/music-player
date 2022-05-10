// components/nav-bar/index.js
Component({
  options: {
    // 设置可以使用多个插槽
    multipleSlots:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value:"默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:getApp().globalData.statusBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLeftClick(){
      this.triggerEvent('click')
  },
    navToHome() {
      wx.switchTab({
        url: '/pages/home-music/index',
      })
  }

  }
})
