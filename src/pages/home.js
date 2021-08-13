/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import {TableHead, TablePagination} from '@material-ui/core'
import {useQuery} from 'react-query'

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

  // console.log(`isLoading ${isLoading}`)
  // console.log(`isFetching ${isFetching}`)

  if (isLoading || isFetching) return 'loding'

  if (error) return `An error has occurred: ${error.message}`

  return (
    <Paper>
      <Toolbar className={classesTool.root}>
        <Typography className={classesTool.title} variant="h6" id="tableTitle" component="div">
          Keyword ({data.data?.total})
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
              <TableRow hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{keyword.keyword}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{keyword.item.rankAbsolute}</TableCell>
                <TableCell>rows</TableCell>
                <TableCell>{keyword.item.url}</TableCell>
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
