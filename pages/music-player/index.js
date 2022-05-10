import { audioContext,playerStore } from '../../store/player-store'

const playModeNames = ["order", "repeat", "random"]

Page({

  data: {
    id: 0,

    currentSong: {},
    lyricInfos: [], 
    durationTime: 0,

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    isPlaying: true,
    playingName: "pause",

    playModeIndex: 0,
    playModeName: "order",

    // 记录slider
    sliderValue: 0,
    currentPage: 0,
    contentHeight: 0,
    lyricScrollTop: 0,
    isSliderChaning: false
  },

  onLoad(options) {
    // 获取传入的id
    const id = options.id
    this.setData({ id })
    // 根据id取出歌曲信息
    // this.getPageData(id)
    this.setupPlayerStoreListener()
    // 动态获取高度
    const screenHeight = getApp().globalData.screenHeight
    const statusBarHeight = getApp().globalData.statusBarHeight
    const contentHeight = screenHeight - statusBarHeight - 44
    this.setData( {contentHeight})
  },

  // 事件处理
  handleSwiperChange(event) {
    const currentPage = event.detail.current
    this.setData({ currentPage })
  },

  handleSliderChange(event) {
    // 获取slider变化的值
    const value = event.detail.value
    // 计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100
    // 设置context播放currentTime位置的音乐
    // 跳转之前先暂停
    // 暂停之后在播放,会回调onCanplay()
    audioContext.seek(currentTime / 1000)
    // 将以播放的时间等于进度条
    // 记录最新的sliderValue
    this.setData({sliderValue: value,isSliderChaning: false})
  },

  handleSliderChaning(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChaning: true,currentTime})
  },

  pause() {
    audioContext.pause()
  },

  handleBackClick() {
    wx.navigateBack({
      delta:1
    })
  },

  handleModeBtnClick() {
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    // 设置playStore中的playModeIndex值
    playerStore.setState("playModeIndex", playModeIndex)
  },

  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction")
  },

  handlePrevBtnClick() {
    playerStore.dispatch("changeNewMusicAction", false)
  },

  handleNextBtnClick() {
    playerStore.dispatch("changeNewMusicAction",true)
  },

  setupPlayerStoreListener() {
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    // 监听
    playerStore.onStates(["currentTime",
    "currentLyricIndex","currentLyricText"], ({currentTime,currentLyricIndex,currentLyricText}) => {
      // 时间变化
      if(currentTime && !this.data.isSliderChaning) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({currentTime, sliderValue})
      }
      if (currentLyricIndex) {
        this.setData ({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })

    //监听播放模式相关数据
    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({ playModeIndex,playModeName: playModeNames[playModeIndex] })
      }

      if (isPlaying !== undefined) {
        this.setData({ isPlaying,
        playingName: isPlaying ? "pause" : "resume" })
      }

    })
  }
})