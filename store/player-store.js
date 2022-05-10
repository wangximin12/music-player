import {HYEventStore} from 'hy-event-store'
import {getSongDetail, getSongLyric} from "../service/api_player"
import { parseLyric } from "../utils/parse-lyric"

const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
	state: {
    isFirstPlay: true,
		id: 0,

		currentSong: {},
		durationTime: 0,
		lyricInfos: [],
		
		currentTime: 0,
    currentLyricIndex: 0,
		currentLyricText: "",
		
    playModeIndex: 0, //0:循环播放,1:单曲循环, 2:随机播放
    playListSongs: [],
    playListIndex: 0,

    collect: "",
    newCollect: [],

    isPlaying: false,
    isShow: false
	},
	actions: {
		playMusicWithSongIdAction(ctx, { id }) {
      if (ctx.id === id) return 
      ctx.id = id
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""
			//  修改播放的状态

			//  请求歌曲详情
			getSongDetail(id).then( res => {
				ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
			}),

			// 请求歌词信息
			getSongLyric(id).then( res => {
				const lyricString = res.lrc.lyric
				const lyrics = parseLyric(lyricString)
				ctx.lyricInfos = lyrics
			}),

			// 播放对应id的歌曲
			audioContext.stop()
       audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
       audioContext.title = id
			 audioContext.autoplay = true

      //  监听事件
      if (ctx.isFirstPlay) {
      this.dispatch("setupAudioContextListenerAction")
      }
		},
		
		// 监听
		setupAudioContextListenerAction(ctx) {

      // 监听可以播放
			audioContext.onCanplay( () => {
				audioContext.play()
      })
      
      // 监听时间变化
			audioContext.onTimeUpdate( () => {
				const currentTime = audioContext.currentTime * 1000

				ctx.currentTime = currentTime
	
				// 查找当前歌词
				if(!ctx.lyricInfos.length) return
				let i = 0
				for (; i < ctx.lyricInfos.length; i++) {
					const lyricInfo = ctx.lyricInfos[i]
					if(currentTime < lyricInfo.time) {
						break
					}
				}
	
				// 设置当前歌词的索引和内容
				const currentIndex = i - 1
				if (ctx.currentLyricIndex !== currentIndex){
          if (!ctx.lyricInfos[currentIndex]) return 
				const currentLyricInfo = ctx.lyricInfos[currentIndex]
        ctx.currentLyricIndex = currentIndex
        ctx.currentLyricText = currentLyricInfo.lyricText
        
				}
      })
      
      // 监听歌曲播放完成
      audioContext.onEnded( () => {
        this.dispatch("changeNewMusicAction", true)
      })

      // 监听音乐暂停/播放/停止
      audioContext.onPlay( () => {
        ctx.isPlaying = true
      }),
      audioContext.onPause( () => {
        ctx.isPlaying = false
      }),
      audioContext.onStop( () => {
        ctx.isPlaying = false
      })
		},

		changeMusicPlayStatusAction(ctx) {
			ctx.isPlaying = !ctx.isPlaying
			if (ctx.isPlaying) {
				audioContext.play()
			} else {
				audioContext.pause()
			}
    },
    
    changeNewMusicAction(ctx, isNext = true) {
      // 1获取当前音乐的索引
      let index = ctx.playListIndex

      // 根据不同的播放模式
      switch(ctx.playModeIndex) {
        case 0: //顺序播放
        case 1: //单曲循环
        index = isNext ? index + 1 : index - 1
        if (index === -1) index = ctx.playListSongs.length - 1
        if (index === ctx.playListSongs.length) index = 0
        break
        case 2: //随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }

      // 获取对应歌曲
      let currentSong = ctx.playListSongs[index]    
      // 记录最新的索引
      ctx.playListIndex = index

      // 播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", {id: currentSong.id})
    },

    // 历史记录
    history(ctx) {
      ctx.newCollect.push(ctx.collect)
      ctx.newCollect =  Array.from(new Set(ctx.newCollect))
      // if(ctx.newCollect.length > 0) {
        ctx.isShow = true
      // } else {
      //   ctx.isShow = false
      // }
    },
    delete(ctx,index) {
      ctx.newCollect.splice(index, 1)
      if (ctx.newCollect.length === 0) {
        ctx.isShow = false
      }
    }

	}
})

export {
	audioContext,
	playerStore
}