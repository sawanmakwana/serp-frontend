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
  TableSortLabel,
  Card,
  Divider,
  CardContent,
  LinearProgress,
} from '@material-ui/core'
import axios from 'axios'
import {makeStyles} from '@material-ui/styles'
import {useQuery} from 'react-query'

const useToolbarStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))
function PorjectList() {
  const classesTool = useToolbarStyles()
  const getRows = JSON.parse(window.localStorage.getItem('Rowsperpage'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [Sorting, setSorting] = useState('')
  const [projectSortingtype, setprojectSortingtype] = useState('asc')

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('Rowsperpage', event.target.value)
    setPage(0)
  }

  async function fetchTable(page = 0, Sorting) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/projectList?page=${
      page + 1
    }&limit=${rowsPerPage}${Sorting}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {isLoading, error, data, isFetching} = useQuery(
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

  return (
    <Paper>
      <Card>
        <Toolbar className={classesTool.root}>
          <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
            Main Project List <span> ({data.data?.total})</span>
          </Typography>
          <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
            Current page <span> ({page + 1})</span>
          </Typography>
        </Toolbar>
        <Divider />
        <CardContent style={{padding: '0'}}>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell className="pl-4">#</TableCell>
                  <TableCell sortDirection={false}>
                    <TableSortLabel
                      active={Sorting.includes('projectName')}
                      direction={projectSortingtype === 'asc' ? 'desc' : 'asc'}
                      onClick={() => {
                        setprojectSortingtype(projectSortingtype === 'asc' ? 'desc' : 'asc')
                        setSorting(`&sort=projectName:${projectSortingtype}`)
                      }}
                    >
                      Project Name
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data?.result?.map(({_id, projectName, domain}, index) => (
                  <TableRow hover key={_id}>
                    <TableCell className="pl-4">{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{projectName}</TableCell>
                    <Tooltip TransitionComponent={Zoom} title={domain} placement="top">
                      <TableCell className="urlEcllips">{domain}</TableCell>
                    </Tooltip>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {isFetching && <LinearProgress />}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={data.data?.total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Paper>
  )
}

export {PorjectList}
