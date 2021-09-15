import CallMadeIcon from '@material-ui/icons/CallMade'
import CallReceivedIcon from '@material-ui/icons/CallReceived'
import CheckIcon from '@material-ui/icons/Check'

export const downloadResponseCSV = (data, name) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${name}.csv`) // or any other extension
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getDifference = (prevRank, currentRank, type = '') => {
  let diff
  switch (type) {
    case 'GET_NUM':
      diff = currentRank - prevRank
      return diff.toString().replace('-', '')

    case 'GET_ClASS':
      if (!prevRank) return 'incRank'
      if (currentRank === prevRank) return 'sameRank'
      if (currentRank > prevRank) return 'decRank'
      if (currentRank < prevRank) return 'incRank'
      break

    case 'GET_ICON':
      if (!prevRank) return <CallMadeIcon />
      if (currentRank === prevRank) return <CheckIcon />
      if (currentRank > prevRank) return <CallReceivedIcon />
      if (currentRank < prevRank) return <CallMadeIcon />
      break

    default:
      break
  }
}

export const getKeywordFrequency = data => {
  if (data === 0) return 'Weekly'
  if (data === 1) return 'Fortnightly'
  if (data === 2) return 'Monthly'
  return 'keyword Frequency'
}

export const getFormetedData = data => {
  if (data) {
    const newDate = new Date(data).toLocaleDateString()
    return newDate
  }
  return '-'
}
