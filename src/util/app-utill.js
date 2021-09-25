/* eslint-disable eqeqeq */
import CallMadeIcon from '@material-ui/icons/CallMade'
import CallReceivedIcon from '@material-ui/icons/CallReceived'
import CheckIcon from '@material-ui/icons/Check'
import {currencies, keywordFrequency} from 'constants/constants'

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
  // let diff
  switch (type) {
    // case 'GET_NUM':
    //   diff = currentRank - prevRank
    //   return diff.toString().replace('-', '')

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

export const getFormetedData = data => {
  if (data) {
    const newDate = new Date(data).toLocaleDateString()
    return newDate
  }
  return '-'
}

export const getLoaction = loactionCode => {
  const obj = currencies.find(item => item.value == loactionCode)
  if (obj) {
    return obj.label
  }
  return 'Location does not exist'
}

export const getKeywordFrequency = frequencyValue => {
  const obj = keywordFrequency.find(item => item.value == frequencyValue)
  if (obj) {
    return obj.label
  }
  return 'keyword does not exist'
}

// export const getStatus = (error, errorMessage, newInserted, type = '') => {
//   switch (type) {
//     case 'GET_TOOLTIP':
//       if (newInserted) return 'Panding'
//       if (error) return errorMessage
//       if (!error) return 'Keyword successfully added'
//       break

//     case 'GET_VALUE':
//       if (newInserted) return <Cached style={{color: orange[500]}} />
//       if (error) return <ErrorOutline style={{color: red[500]}} />
//       if (!error) return <DoneAll color="primary" />
//       break

//     default:
//       break
//   }
// }
