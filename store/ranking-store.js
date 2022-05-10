// 响应式状态管理
import { HYEventStore } from 'hy-event-store'

import { getRankings } from "../service/api_music" 

const rankingMap = {0: "newRanking",1: "hotRanking", 2:"originRanking", 3: "upRanking"}

const rankingStore = new HYEventStore({
	state: {
		newRanking: {},//新歌榜
		hotRanking: {},//热歌榜
		originRanking: {},//原创榜
		upRanking: {},//飙升榜
	},
	actions: {
		getRankingDataAction(ctx) {
			for (let i = 0; i < 4; i++) {
				getRankings(i).then(res => {
					let rankingName = rankingMap[i]
					ctx[rankingName] = res.playlist
					//上面是下面的优化
					// switch(i) {
					// 	case 0:
					// 		ctx.newRanking = res.playlist
					// 		break;
					// 	case 1:
					// 		ctx.hotRanking = res.playlist
					// 		break;
					// 	case 2:
					// 		ctx.originRanking = res.playlist
					// 		break;
					// 	case 3:
					// 		ctx.upRanking = res.playlist
					// 		break;
					// }
				})
			}
		}
	}
})

export {
	rankingStore,
	rankingMap
}