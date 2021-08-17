import React, {useState} from 'react'
import {
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Zoom,
  Toolbar,
  Typography,
  Paper,
  Tooltip,
  CircularProgress,
  makeStyles,
  TableSortLabel,
} from '@material-ui/core'
import axios from 'axios'
import {useQuery} from 'react-query'
import CallMadeIcon from '@material-ui/icons/CallMade'
import CallReceivedIcon from '@material-ui/icons/CallReceived'
import RemoveIcon from '@material-ui/icons/Remove'
import CheckIcon from '@material-ui/icons/Check'

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))

function Home() {
  const classesTool = useToolbarStyles()
  const getRows = JSON.parse(window.localStorage.getItem('Rowsperpage'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [weekSortingtype, setweekSortingtype] = useState('asc')

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('Rowsperpage', event.target.value)
    setPage(0)
  }

  async function fetchTable(page = 0, Sorting) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/getAllTasks?limit=${rowsPerPage}&page=${
      page + 1
    }${Sorting}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {isLoading, error, data} = useQuery(
    ['reposData', page, rowsPerPage, Sorting],
    () => fetchTable(page, Sorting),
    {keepPreviousData: true}
  )

  if (isLoading)
    return (
      <div className="spinner table">
        <CircularProgress />
      </div>
    )

  if (error) return `An error has occurred: ${error.message}`

  const getDifference = (prevRank, currentRank, type = '') => {
    let diff
    switch (type) {
      case 'GET_NUM':
        diff = currentRank - prevRank
        return diff.toString().replace('-', '')

      case 'GET_ClASS':
        if (!prevRank) return 'noprevRank'
        if (currentRank === prevRank) return 'sameRank'
        if (currentRank > prevRank) return 'decRank'
        if (currentRank < prevRank) return 'incRank'
        break

      case 'GET_ICON':
        if (!prevRank) return <RemoveIcon />
        if (currentRank === prevRank) return <CheckIcon />
        if (currentRank > prevRank) return <CallReceivedIcon />
        if (currentRank < prevRank) return <CallMadeIcon />
        break

      default:
        break
    }
  }

  return (
    <Paper>
      <Toolbar className={classesTool.root}>
        <Typography className={`${classesTool.title} tableHeader`} sty variant="h6" id="tableTitle" component="div">
          Keyword <span> ({data.data?.total})</span>
        </Typography>
        <Typography className={`${classesTool.title} tableHeader`} sty variant="h6" id="tableTitle" component="div">
          Current page <span> ({page + 1})</span>
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium" aria-label="enhanced table">
          <TableHead>
            <TableRow>
              <TableCell className="pl-4">#</TableCell>
              <TableCell sortDirection={false}>
                <TableSortLabel
                  active={Sorting.includes('keyword')}
                  direction={keySortingtype === 'asc' ? 'desc' : 'asc'}
                  onClick={() => {
                    setkeySortingtype(keySortingtype === 'asc' ? 'desc' : 'asc')
                    setSorting(`&sort=keyword:${keySortingtype}`)
                  }}
                >
                  Keyword
                </TableSortLabel>
              </TableCell>
              <TableCell>Previous week</TableCell>
              <TableCell sortDirection={false}>
                <TableSortLabel
                  active={Sorting.includes('rankAbsolute')}
                  direction={weekSortingtype === 'asc' ? 'desc' : 'asc'}
                  onClick={() => {
                    setweekSortingtype(weekSortingtype === 'asc' ? 'desc' : 'asc')
                    setSorting(`&sort=rankAbsolute:${weekSortingtype}`)
                  }}
                >
                  Current week
                </TableSortLabel>
              </TableCell>
              <TableCell>Difference</TableCell>
              <TableCell>URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data?.result?.map(({_id, keyword, prevRankAbsolute, rankAbsolute, url}, index) => (
              <TableRow hover key={_id}>
                <TableCell className="pl-4">{index + 1}</TableCell>
                <TableCell>{keyword}</TableCell>
                <TableCell>{prevRankAbsolute || '-'}</TableCell>
                <TableCell>{rankAbsolute || '-'}</TableCell>
                <TableCell className={getDifference(prevRankAbsolute, rankAbsolute, 'GET_ClASS')}>
                  {getDifference(prevRankAbsolute, rankAbsolute, 'GET_NUM')}
                  {getDifference(prevRankAbsolute, rankAbsolute, 'GET_ICON')}
                </TableCell>
                <Tooltip TransitionComponent={Zoom} title={url} placement="top">
                  <TableCell className="urlEcllips">{url}</TableCell>
                </Tooltip>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={data.data?.total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export {Home}
