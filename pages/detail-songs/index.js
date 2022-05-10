import { rankingStore } from "../../store/index"

import {playerStore} from "../../store/player-store"

import { getSongMenuDetail } from "../../service/api_music"
Page({

  data: {
    ranking: "",
    songInfo: {},
    type: ""
  },

  onLoad(options) {
    const type = options.type
    this.setData({ type })
    if(type === "menu") {
      const id = options.id
      getSongMenuDetail(id).then( res=> {
        this.setData({ songInfo: res.playlist})
      })
    }else if (type === "rank") {
      const ranking = options.ranking
      this.setData({ranking})
      rankingStore.onState(ranking, this.getRankingData)
    }

  },

  onUnload() {
    if (this.data.ranking){
    rankingStore.offState(this.data.ranking, this.getRankingData)
    }
  },

  getRankingData(res) {
    this.setData({ songInfo: res })
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)
  }
})