import wmRequest from './index'
// 获取轮播图数据
export function getBanners() {
  return wmRequest.get("/banner", {
    type : 1
  })
}

// 获取飙升/热门/新歌等数据
export function getRankings(idx) {
  return wmRequest.get("/top/list", {
    idx
  })
}

export function getSongMenu(cat="全部", limit=10, offset=0){
  return wmRequest.get("/top/playlist", {
    cat,limit,offset
  })
}

// 请求歌单详情
export function getSongMenuDetail(id) {
  return wmRequest.get("/playlist/detail/dynamic", {
    id
  })
}
