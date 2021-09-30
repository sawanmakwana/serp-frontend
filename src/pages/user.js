import {
  Box,
  Container,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Avatar,
  TableContainer,
  CardContent,
  Paper,
  Toolbar,
  Divider,
  LinearProgress,
} from '@material-ui/core'
import {useState} from 'react'
import {useQuery, useQueryClient} from 'react-query'
import {useClient} from 'useClient'

function User() {
  const queryClient = useQueryClient()
  const client = useClient()

  const [page, setPage] = useState(0)
  const getRows = JSON.parse(window.localStorage.getItem('userListRow'))
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 50)
  // const [Sorting, setSorting] = useState('')

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('userListRow', event.target.value)
    setPage(0)
  }

  const {data, isFetching} = useQuery(
    ['reposData', page, rowsPerPage],
    () => client(`getUserList?limit=${rowsPerPage}&page=${page + 1}`),
    {
      keepPreviousData: true,
    }
  )

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
      }}
    >
      <Container maxWidth={false} style={{padding: 0}}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
              Users (2)
            </Typography>
            <Button color="primary" variant="contained">
              Add user
            </Button>
          </Box>
        </Box>
        <Box sx={{pt: 3}}>
          <Paper>
            <Card>
              <Toolbar>
                <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
                  Current page <span> (1)</span>
                </Typography>
              </Toolbar>
              <Divider />
              <CardContent style={{padding: '0'}}>
                <TableContainer>
                  <Table size="medium" className="selectTable">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Permission</TableCell>
                        <TableCell>Registration date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.data?.result?.length === 0 ? (
                        <TableRow hover>
                          <TableCell className="emptyTable" colSpan="4">
                            No Project Available
                          </TableCell>
                        </TableRow>
                      ) : (
                        data?.data?.result?.map((user, index) => (
                          <TableRow hover key={user.id}>
                            <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Avatar style={{marginRight: 16}}>T</Avatar>
                                <Typography color="textPrimary" variant="body1">
                                  {`${user.firstName}${' '}${user.lastName}`}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>

                            <TableCell>{user.permissionLevel}</TableCell>
                            <TableCell>11</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {isFetching && <LinearProgress />}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 50, 100, 500]}
                  component="div"
                  count={data?.data?.total}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export {User}
