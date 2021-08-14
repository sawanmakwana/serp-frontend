/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import {useQuery} from 'react-query'
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
  const {isLoading, error, data, isFetching} = useQuery('reposData', () =>
    fetch('http://localhost:3000/api/v1/serp/getAllTasks?limit=10&page=1').then(res => res.json())
  )

  if (isLoading || isFetching)
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
        rowsPerPage={10}
        page={0}

        // page={data.data?.page}
        // onPageChange={handleChangePage}
        // onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export {Home}
