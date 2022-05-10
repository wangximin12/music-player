
Page({

  data: {
    arrow: "down-arrow",
    bel: true
  },

  onLoad(options) {

  },

  handleArrowAction() {
    this.setData({ arrow: this.data.bel ? "up-arrow" : "down-arrow" })
    this.setData({ bel: !this.data.bel })
  }

})