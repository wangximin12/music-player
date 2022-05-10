import WMRequest from "./index"

// 请求video页面
export function getTopMV(offset,limit = 16) {
  return WMRequest.get("/top/mv", {
    offset,
    limit
  })
}

// 请求video详情页
export function getMVURL (id) {
  return WMRequest.get("/mv/url", {
    id
  })
}

export function getMVDeail (mvid) {
  return WMRequest.get("/mv/detail", {
    mvid
  })
}

export function getRelatedVideo (id) {
  return WMRequest.get("/related/allvideo", {
    id
  })
}