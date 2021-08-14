/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React, {useState} from 'react'
import {useQuery, useQueryClient} from 'react-query'
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
} from '@material-ui/core'

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: '1 1 100%',
  },
}))

function Home() {
  const classesTool = useToolbarStyles()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // eslint-disable-next-line no-unused-vars
  const {isLoading, error, data, isFetching} = useQuery(['reposData', page, rowsPerPage], () =>
    fetch(`http://localhost:3000/api/v1/serp/getAllTasks?limit=${rowsPerPage}&page=${page + 1}`).then(res => res.json())
  )

  React.useEffect(() => {
    queryClient.prefetchQuery(['reposData', page + 1, rowsPerPage], () =>
      fetch(`http://localhost:3000/api/v1/serp/getAllTasks?limit=${rowsPerPage}&page=${page + 1}`).then(res =>
        res.json()
      )
    )
  }, [data, page, queryClient, rowsPerPage])

  if (isLoading)
    return (
      <div className="spinner table">
        <CircularProgress />
      </div>
    )

  if (error) return `An error has occurred: ${error.message}`

  return (
    <Paper>
      <Toolbar className={classesTool.root}>
        <Typography className={`${classesTool.title} tableHeader`} sty variant="h6" id="tableTitle" component="div">
          Keyword <span> ({data.data?.total})</span>
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size="medium" aria-label="enhanced table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Keyword</TableCell>
              <TableCell>Previous week</TableCell>
              <TableCell>Current week</TableCell>
              <TableCell>Difference</TableCell>
              <TableCell>URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data?.result?.map((keyword, index) => (
              <TableRow hover key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{keyword.keyword}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{keyword.item.rankAbsolute}</TableCell>
                <TableCell>rows</TableCell>
                <Tooltip TransitionComponent={Zoom} title={keyword.item.url} placement="top">
                  <TableCell className="urlEcllips">{keyword.item.url}</TableCell>
                </Tooltip>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
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
