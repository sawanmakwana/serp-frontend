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
import {useQuery, useQueryClient} from 'react-query'
import axios from 'axios'

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

  console.log(data)

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
            {data.data?.result?.map((keyword, index) => (
              <TableRow hover key={index}>
                <TableCell className="pl-4">{index + 1}</TableCell>
                <TableCell>{keyword.keyword}</TableCell>
                <TableCell>{keyword.prevRankAbsolute ? keyword.prevRankAbsolute : '-'}</TableCell>
                <TableCell>{keyword.rankAbsolute || '-'}</TableCell>
                <TableCell>{keyword.rankAbsolute - keyword.prevRankAbsolute}</TableCell>
                <Tooltip TransitionComponent={Zoom} title={keyword.url} placement="top">
                  <TableCell className="urlEcllips">{keyword.url}</TableCell>
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
