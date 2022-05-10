
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
	const lyricInfos = []
	const lyricStrings = lyricString.split("\n")
	for (const lineString of lyricStrings) {
		const timeResult = timeRegExp.exec(lineString)
		if (!timeResult) continue
		// 获取时间
		const minute = timeResult[1] * 60 * 1000 
		const second = timeResult[2] * 1000
		const millsecond = timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1
		const time =  minute + second + millsecond
		// 获取歌词文本
		const lyricText =  lineString.replace(timeRegExp, "")
		lyricInfos.push({time,lyricText})
	}
	return lyricInfos
}