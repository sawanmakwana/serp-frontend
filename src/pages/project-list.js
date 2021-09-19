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
  TableSortLabel,
  Card,
  Divider,
  CardContent,
  LinearProgress,
  Button,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
} from '@material-ui/core'

import axios from 'axios'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {MoreVertical} from 'react-feather'
import {useHistory} from 'react-router-dom'
import {AddProjectListModal} from 'components/add-project-list'
import {DeleteModal} from 'components/delete-modal'
import {useTheme} from '@material-ui/core/styles'
import {downloadResponseCSV} from 'util/app-utill'

function PorjectList() {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))
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
  const [anchorE2, setAnchorE2] = useState(null)
  const open = Boolean(anchorE2)

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

  const {data, isFetching} = useQuery(['reposData', page, rowsPerPage, Sorting], () => fetchTable(page, Sorting), {
    keepPreviousData: true,
  })

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

  async function fetchCSV() {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/exportProjectToCsv`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {data: csvData, isLoading: csvisLoading} = useQuery(['csvProjectlist'], () => fetchCSV())

  async function fetchGooglesheet() {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/exportProjectToGoogleSheet`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {data: googlesheetData, isLoading: googlesheetisLoading} = useQuery(['exportProjectToGoogleSheet'], () =>
    fetchGooglesheet()
  )

  return (
    <>
      <Box className="d-flex pb-3">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Projects <span> ({data?.data?.total})</span>
        </Typography>
        <Box>
          {!xsScreen && (
            <>
              <Button
                style={{
                  color:
                    googlesheetisLoading || csvisLoading || data?.data?.result?.length === 0
                      ? theme.palette.text.secondary
                      : theme.palette.primary.main,
                }}
                disabled={googlesheetisLoading || csvisLoading || data?.data?.result?.length === 0}
                onClick={e => setAnchorE2(e.currentTarget)}
              >
                Export
              </Button>
              <Menu anchorEl={anchorE2} open={open} onClose={() => setAnchorE2(null)}>
                <MenuItem
                  onClick={() => {
                    downloadResponseCSV(csvData, 'main_project')
                    setAnchorE2(null)
                  }}
                >
                  Export CSV
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    const win = window.open(googlesheetData?.data?.sheetURL, '_blank')
                    win.focus()
                    setAnchorE2(null)
                  }}
                >
                  Export Google Sheet
                </MenuItem>
              </Menu>
            </>
          )}
          <Button className="ml-2" color="primary" variant="contained" onClick={() => setAddProjectModal(true)}>
            Add Project
          </Button>
        </Box>
      </Box>
      <Paper style={{padding: '0'}}>
        <Card>
          <Toolbar className="d-flex">
            <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
              Current page <span> ({page + 1})</span>
            </Typography>
            {xsScreen && (
              <>
                <Button
                  style={{
                    color:
                      googlesheetisLoading || csvisLoading || data?.data?.result?.length === 0
                        ? theme.palette.text.secondary
                        : theme.palette.primary.main,
                  }}
                  disabled={googlesheetisLoading || csvisLoading || data?.data?.result?.length === 0}
                  onClick={e => setAnchorE2(e.currentTarget)}
                >
                  Export
                </Button>
                <Menu anchorEl={anchorE2} open={open} onClose={() => setAnchorE2(null)}>
                  <MenuItem
                    onClick={() => {
                      downloadResponseCSV(csvData, 'main_project')
                      setAnchorE2(null)
                    }}
                  >
                    Export CSV
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      const win = window.open(googlesheetData?.data?.sheetURL, '_blank')
                      win.focus()
                      setAnchorE2(null)
                    }}
                  >
                    Export Google Sheet
                  </MenuItem>
                </Menu>
              </>
            )}
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
                  {data?.data?.result?.length === 0 ? (
                    <TableRow hover>
                      <TableCell className="emptyTable" colSpan="4">
                        No Project Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.result?.map(({_id, projectName, domain}, index) => (
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
            deleteProject={() => deleteProject(editId)}
            deleteModal={deleteModal}
            deleteIsloading={deleteIsloading}
            modalFrom="Project"
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
