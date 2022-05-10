import { getSearchHot,getSearchSuggest,getSearchResult } from "../../service/api_search"
import { stringToNodes } from "../../utils/string2nodes"
import { playerStore } from '../../store/player-store'
Page({

  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    collect: "",
    newCollect: [],
    searchValue: "",
    isShow: true
  },

  onLoad(options) {
    // 获取页面数据
    this.getPageData()

    // 获取历史记录
    this.setData({ newCollect: playerStore.state.newCollect })

    this.setData({ isShow: playerStore.state.isShow })
  },

  // 网络请求
  getPageData(){
    getSearchHot().then( res => {
      this.setData({ hotKeywords: res.result.hots})
    })
  },

  // 事件处理
  handleSearch(event) {
    // 拿到输入框输入的内容
    const searchValue = event.detail
    // 保存输入的内容
    this.setData({searchValue})
    // 判断输入的内容是否为空
    if(!searchValue.length) {
      this.setData({ suggestSongs: [] })
      this.setData({ resultSongs: []})
      return}
    // 根据关键字进行搜索并保存
    getSearchSuggest(searchValue).then( res => {
      if (!this.data.searchValue.length) {
        return 
      }
      // 获取建议的关键字
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs})

      // 转成nodes节点
      if (!suggestSongs) return 
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },

  handleSearchAction(event) {
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then( res=> {
      this.setData({ resultSongs: res.result.songs})
    })
    playerStore.setState("collect", searchValue)
    playerStore.dispatch("history")
    this.setData({ newCollect: playerStore.state.newCollect })
    this.setData({ isShow: playerStore.state.isShow })
  },

  delete (event) {
    const index =event.currentTarget.dataset.index
    playerStore.dispatch("delete",index)
    playerStore.onStates(["newCollect","isShow"], ({newCollect,isShow}) => {
      this.setData({ newCollect, isShow })
    })
  },

  handleKeyworldItemClick(event) {
    // 获取关键字
    const keyword = event.currentTarget.dataset.keyword
    // 设置关键字
    this.setData({ searchValue: keyword})
    // 发送网络请求
    this.handleSearchAction()
  }

})