import {rankingStore, rankingMap} from "../../store/index"
import {playerStore} from "../../store/player-store"
import { getBanners,getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
// pages/home-music/index.js
Page({

  data: {
    swiperHeight: 0,
    banners: [],
    recommendSongs: [],
    songMenus: [],
    recommendSongMenu: [],
    rankings: { 0: {}, 2: {}, 3: {} },
    currentSong: {},
    isPlaying: false,
    playAnimState: "paused"
  },

  onLoad: function (options) {
    // 获取数据
    this.getPageData()

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction")

    // 获取共享的数据
    this.setupPlayerStoreListener()
  },

  // 事件处理
  handleSearchClick() {
    wx.navigateTo({
      url: '../detail-search/index',
    })
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.recommendSongs)
    playerStore.setState("playListIndex", index)
  },

  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction")
  },

  handlePlayBarClick() {
    wx.navigateTo({
      url: '/pages/music-player/index',
    })
  },
  
  // 获取图片高度
  ImageLoaded() {
    queryRect(".image").then( res => {
      const rect = res[0] 
      this.setData({swiperHeight:rect.height})
    })
  },

  handleMoreClick() {
    this.navigateToDetailSongsPage("hotRanking")
  },

  handeleRankingItemClick(event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },

  // 网络请求
  getPageData() {
    getBanners().then( res => {
      this.setData({banners:res.banners})
    })

    getSongMenu().then ( res => {
      this.setData({songMenus: res.playlists})
    })

    getSongMenu("华语").then( res => {
      this.setData({ recommendSongMenu: res.playlists})
    })


  },

// 获取共享数据的函数
  getRankingHandler (idx) {
    return (res) => {
        if(Object.keys(res).length !== 0){
        const name = res.name
        const coverImgUrl = res.coverImgUrl
        const playCount = res.playCount
        const songList = res.tracks.slice(0,3)
        const rankingObj = {name,coverImgUrl,playCount,songList}
        const newRankings = {...this.data.rankings, [idx]: rankingObj}
        this.setData({
          rankings: newRankings
        })
        }
      }
  },

  setupPlayerStoreListener() {
    rankingStore.onState("hotRanking", res => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(20,26)
      this.setData({ recommendSongs})
    })

    rankingStore.onState("newRanking", 
    this.getRankingHandler(0) )
    rankingStore.onState("originRanking", 
    this.getRankingHandler(2) )
    rankingStore.onState("upRanking", 
    this.getRankingHandler(3) )

    // 播放器监听
    playerStore.onStates(["currentSong","isPlaying"], ({currentSong, isPlaying}) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined)
      this.setData({ isPlaying, playAnimState: isPlaying ? 'running' : 'paused' })
    })
  }
})