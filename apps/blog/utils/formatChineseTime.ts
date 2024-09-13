function formatChineseTime(originalTime: string) {
  const currentTime = new Date()
  const targetTime = new Date(originalTime)
  const timeDifference = currentTime.getTime() - targetTime.getTime()
  const oneMinuteMilliseconds = 60 * 1000
  const oneHourMilliseconds = 60 * oneMinuteMilliseconds
  const oneDayMilliseconds = 24 * oneHourMilliseconds

  if (timeDifference < oneMinuteMilliseconds) {
    return '刚刚'
  }
  else if (timeDifference < oneHourMilliseconds) {
    const minutes = Math.floor(timeDifference / oneMinuteMilliseconds)
    return `${minutes}分钟前`
  }
  else if (timeDifference < oneDayMilliseconds) {
    const hours = Math.floor(timeDifference / oneHourMilliseconds)
    return `${hours}小时前`
  }
  else if (timeDifference < 2 * oneDayMilliseconds) {
    return '昨天'
  }
  else if (timeDifference < 3 * oneDayMilliseconds) {
    return '前天'
  }
  else if (timeDifference < 7 * oneDayMilliseconds) {
    const days = Math.floor(timeDifference / oneDayMilliseconds)
    return `${days}天前`
  }
  else {
    const formattedDate = targetTime.toLocaleDateString('zh-CN')
    return formattedDate
  }
}
export default formatChineseTime
