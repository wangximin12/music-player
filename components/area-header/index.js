// components/area-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认值"
    },
    rightText: {
      type: String,
      value: "更多"
    },
    showRight: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    handleRightClick() {
      this.triggerEvent("click")
    }
  }
})
