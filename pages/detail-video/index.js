// pages/detail-video/index.js
import {getMVURL,getMVDeail,getRelatedVideo} from "../../service/api_video"

Page({

  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: [],
    danmuList:[
      {text: "第1s出现的弹幕",
      color: '#ff0000',
      time: 1},
      {text: "第3s出现的弹幕",
      color: '#ff0000',
      time: 3}
    ]
  },

  onLoad(options) {
  const id = options.id
  this.getpageData(id)
  },

  getpageData(id) {
        // 1请求播放地址
        getMVURL(id).then(res => {
          this.setData({mvURLInfo: res.data})
        })
        // 2请求视频信息
        getMVDeail(id).then(res => {
          this.setData({mvDetail: res.data})
        })
        // 3请求相关视频
        getRelatedVideo(id).then(res => {
          this.setData({relatedVideos: res.data})
        })
  }
})