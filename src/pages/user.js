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
  Menu,
  MenuItem,
  TableSortLabel,
} from '@material-ui/core'
import {useState} from 'react'
import {MoreVertical} from 'react-feather'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useClient} from 'useClient'
import {DeleteModal} from 'components/delete-modal'
import {AddUser} from 'components/add-user'
import {getUserAccess, getUserAvtar} from 'util/app-utill'
import {toast} from 'react-toastify'

function User() {
  const queryClient = useQueryClient()
  const client = useClient()

  const [page, setPage] = useState(0)
  const getRows = JSON.parse(window.localStorage.getItem('userListRow'))
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [anchorEl, setAnchorEl] = useState(null)
  const [addUserModal, setAddUserModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [Sorting, setSorting] = useState('')
  const [nametype, setNameSortingtype] = useState('asc')
  const [emailtype, setEmailtype] = useState('asc')
  const [permissiontype, setPermissiontype] = useState('asc')

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('userListRow', event.target.value)
    setPage(0)
  }

  const {data, isFetching} = useQuery(
    ['userList', page, rowsPerPage, Sorting],
    () => client(`getUserList?limit=${rowsPerPage}&page=${page + 1}${Sorting}`),
    {
      keepPreviousData: true,
    }
  )

  const {mutate: deleteUser, isLoading: deleteIsloading} = useMutation(
    mutateData =>
      client(`deleteUser/${mutateData}`, {
        mutateData,
        method: 'delete',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userList')
        setDeleteModal(false)
        setEditId(null)
        toast.success(`User Deleted`)
      },
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
              Users <span> ({data?.data?.total})</span>
            </Typography>
            <Button color="primary" variant="contained" onClick={() => setAddUserModal(true)}>
              Add user
            </Button>
          </Box>
        </Box>
        <Box sx={{pt: 3}}>
          <Paper>
            <Card>
              <Toolbar>
                <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
                  Current page <span> ({page + 1})</span>
                </Typography>
              </Toolbar>
              <Divider />
              <CardContent style={{padding: '0'}}>
                <TableContainer>
                  <Table size="medium" className="selectTable">
                    <TableHead>
                      <TableRow>
                        <TableCell className="pl-4">#</TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={Sorting.includes('firstName')}
                            direction={nametype === 'asc' ? 'desc' : 'asc'}
                            onClick={() => {
                              setNameSortingtype(nametype === 'asc' ? 'desc' : 'asc')
                              setSorting(`&sort=firstName:${nametype}`)
                            }}
                          >
                            Name
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={Sorting.includes('email')}
                            direction={emailtype === 'asc' ? 'desc' : 'asc'}
                            onClick={() => {
                              setEmailtype(emailtype === 'asc' ? 'desc' : 'asc')
                              setSorting(`&sort=email:${emailtype}`)
                            }}
                          >
                            Email
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={Sorting.includes('permissionLevel')}
                            direction={permissiontype === 'asc' ? 'desc' : 'asc'}
                            onClick={() => {
                              setPermissiontype(permissiontype === 'asc' ? 'desc' : 'asc')
                              setSorting(`&sort=permissionLevel:${permissiontype}`)
                            }}
                          >
                            Permission
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.data?.result?.length === 0 ? (
                        <TableRow hover>
                          <TableCell className="emptyTable" colSpan="6">
                            No Project Available
                          </TableCell>
                        </TableRow>
                      ) : (
                        data?.data?.result?.map((user, index) => (
                          <TableRow hover key={user.id}>
                            <TableCell className="pl-4">{index + 1 + page * rowsPerPage}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex',
                                }}
                              >
                                <Avatar className={getUserAvtar(user?.permissionLevel)} style={{marginRight: 16}}>
                                  {user.firstName.toString().charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography color="textPrimary" variant="body1">
                                  {`${user.firstName}${' '}${user.lastName}`}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getUserAccess(user.permissionLevel)}</TableCell>
                            <TableCell>
                              <>
                                <Button
                                  className="selectTablebtn"
                                  onClick={e => {
                                    setAnchorEl(e.currentTarget)
                                    setEditId(user._id)
                                    e.stopPropagation()
                                  }}
                                >
                                  <MoreVertical />
                                </Button>
                                <Menu
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={anchorEl}
                                  onClose={e => {
                                    setAnchorEl(null)
                                    setEditId(null)
                                    e.stopPropagation()
                                  }}
                                  PaperProps={{
                                    style: {
                                      maxHeight: 220,
                                      width: 120,
                                    },
                                  }}
                                >
                                  <MenuItem
                                    onClick={e => {
                                      e.stopPropagation()
                                      setAddUserModal(true)
                                      setAnchorEl(null)
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={e => {
                                      e.stopPropagation()
                                      setDeleteModal(true)
                                      setAnchorEl(null)
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                </Menu>
                              </>
                            </TableCell>
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
            {deleteModal && (
              <DeleteModal
                deleteProject={() => deleteUser(editId)}
                deleteModal={deleteModal}
                deleteIsloading={deleteIsloading}
                modalFrom="User"
                onClose={() => {
                  setDeleteModal(false)
                  setEditId(null)
                }}
              />
            )}

            {addUserModal && (
              <AddUser
                data={data}
                editId={editId}
                setEditId={setEditId}
                open={addUserModal}
                setOpen={setAddUserModal}
              />
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export {User}
