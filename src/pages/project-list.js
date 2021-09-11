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
  Button,
  Menu,
  MenuItem,
  Box,
} from '@material-ui/core'
import axios from 'axios'
import {makeStyles} from '@material-ui/styles'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {MoreVertical} from 'react-feather'
import {useHistory} from 'react-router-dom'
import {AddProjectListModal} from 'components/add-project-list'
import {DeleteModal} from 'components/delete-modal'

const useToolbarStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))
function PorjectList() {
  const classesTool = useToolbarStyles()
  const history = useHistory()
  const queryClient = useQueryClient()
  const getRows = JSON.parse(window.localStorage.getItem('Rowsperpage'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [Sorting, setSorting] = useState('')
  const [projectSortingtype, setprojectSortingtype] = useState('asc')
  const [anchorEl, setAnchorEl] = useState(null)
  const [addProjectModal, setAddProjectModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

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

  const {mutate: deleteProject, isLoading: deleteIsloading} = useMutation(
    mutateData => axios.delete(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/deleteProject/${mutateData}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reposData')
        setDeleteModal(false)
        setEditId(null)
      },
    }
  )

  if (isLoading)
    return (
      <div className="spinner table">
        <CircularProgress />
      </div>
    )

  if (error) return `An error has occurred: ${error.message}`

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 3,
        }}
      >
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Main Project <span> ({data.data?.total})</span>
        </Typography>
        <Box>
          <Button style={{color: '#5664D2'}}>Export</Button>
          <Button className="ml-2" color="primary" variant="contained" onClick={() => setAddProjectModal(true)}>
            Add Project
          </Button>
        </Box>
      </Box>
      <Paper style={{padding: '0'}}>
        <Card>
          <Toolbar className={classesTool.root}>
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
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.data?.result?.length === 0 ? (
                    <TableRow hover>
                      <TableCell className="emptyTable" colSpan="4">
                        No Project Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data?.result?.map(({_id, projectName, domain}, index) => (
                      <TableRow hover key={_id} onClick={() => history.push(`/project/${_id}`)}>
                        <TableCell className="pl-4">{index + 1 + page * rowsPerPage}</TableCell>
                        <TableCell>{projectName}</TableCell>
                        <Tooltip TransitionComponent={Zoom} title={domain} placement="top">
                          <TableCell className="urlEcllips">{domain}</TableCell>
                        </Tooltip>
                        <TableCell>
                          <>
                            <Button
                              className="selectTablebtn"
                              onClick={e => {
                                setAnchorEl(e.currentTarget)
                                setEditId(_id)
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
                                  setAddProjectModal(true)
                                  setAnchorEl(null)
                                }}
                              >
                                Edite
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
        {deleteModal && (
          <DeleteModal
            deleteProject={() => deleteProject(editId)}
            deleteModal={deleteModal}
            deleteIsloading={deleteIsloading}
            onClose={() => {
              setDeleteModal(false)
              setEditId(null)
            }}
          />
        )}
        {addProjectModal && (
          <AddProjectListModal
            editId={editId}
            setEditId={setEditId}
            open={addProjectModal}
            setOpen={setAddProjectModal}
          />
        )}
      </Paper>
    </>
  )
}

export {PorjectList}
