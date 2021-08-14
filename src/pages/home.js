/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React, {useState, useEffect} from 'react'
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
  lighten,
} from '@material-ui/core'
import axios from 'axios'
import {useQuery, useQueryClient} from 'react-query'
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

const useToolbarStyles11 = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}))

function Home() {
  const classesTool = useToolbarStyles()
  const classes = useToolbarStyles11()
  const queryClient = useQueryClient()
  const getRows = JSON.parse(window.localStorage.getItem('Rowsperpage'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [currentSortingParams, setCurrentSortingParams] = useState({
    sortBy: '',
    sortType: '',
  })

  const handleSort = (clickedColumn, type) => () => {
    setCurrentSortingParams({
      ...currentSortingParams,
      sortBy: clickedColumn,
      sortType: type,
    })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('Rowsperpage', event.target.value)
    setPage(0)
  }

  async function fetchTable(page = 0) {
    // let URL = `http://localhost:3000/api/v1/serp/getAllTasks?limit=${rowsPerPage}&page=${
    //   page + 1
    // }`
    // if (currentSortingParams.sortBy)
    //   URL = `${URL}&sort=:${currentSortingParams.sortBy}`
    // const {data} = await axios.get(`${URL}`)

    const {data} = await axios.get(
      `http://localhost:3000/api/v1/serp/getAllTasks?limit=${rowsPerPage}&page=${page + 1}`
    )
    return data
  }

  const {isLoading, error, data} = useQuery(['reposData', page, rowsPerPage], () => fetchTable(page))

  useEffect(() => {
    queryClient.prefetchQuery(['reposData', page + 1, rowsPerPage], () => fetchTable(page + 1), {
      keepPreviousData: true,
      staleTime: 5000,
    })
  }, [data, page, queryClient, rowsPerPage])

  if (isLoading)
    return (
      <div className="spinner table">
        <CircularProgress />
      </div>
    )

  if (error) return `An error has occurred: ${error.message}`

  const getDifference = (prevRank, currentRank, type = '') => {
    console.log(prevRank)
    let diff
    switch (type) {
      case 'GET_NUM':
        diff = currentRank - prevRank
        return diff

      case 'GET_ClASS':
        if (!prevRank) return 'noprevRank'
        if (currentRank === prevRank) return 'sameRank'
        if (currentRank > prevRank) return 'incRank'
        if (currentRank < prevRank) return 'decRank'
        break

      case 'GET_ICON':
        if (!prevRank) return <RemoveIcon />
        if (currentRank === prevRank) return <CheckIcon />
        if (currentRank > prevRank) return <CallMadeIcon />
        if (currentRank < prevRank) return <CallReceivedIcon />
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
                <TableSortLabel onClick={handleSort('keyword', 'asc')}>
                  Keyword
                  {/* <span className={classes.visuallyHidden}>sorted descending</span> */}
                </TableSortLabel>
              </TableCell>
              {/* <TableCell sortDirection={orderBy === headCell.id ? order : false}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  Keyword
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell> */}
              <TableCell>Previous week</TableCell>
              <TableCell>Current week</TableCell>
              <TableCell>Difference</TableCell>
              <TableCell>URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data?.result?.map(({keyword, prevRankAbsolute, rankAbsolute, url}, index) => (
              <TableRow hover key={index}>
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
