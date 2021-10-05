import React, {useContext, useState} from 'react'
import {
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Toolbar,
  Typography,
  Paper,
  TableSortLabel,
  Card,
  Divider,
  CardContent,
  Box,
  Container,
  Grid,
  LinearProgress,
  Button,
  TextField,
  MenuItem,
  useMediaQuery,
  IconButton,
  Menu,
  Zoom,
  Tooltip,
  Switch,
} from '@material-ui/core'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import AnalyticCard from 'components/analytic-card'
import {AddSubProjectListModal} from 'components/add-sub-project'
import {
  blue,
  blueGrey,
  green,
  indigo,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
} from '@material-ui/core/colors'
import {useHistory, useParams} from 'react-router-dom'
import {MoreVertical} from 'react-feather'
import {DeleteModal} from 'components/delete-modal'
import {useTheme} from '@material-ui/core/styles'
import {downloadResponseCSV, getCompoAccess, getFormetedData, getKeywordFrequency, getLoaction} from 'util/app-utill'
import {ArrowBack, Cached} from '@material-ui/icons'
import {useClient} from 'useClient'
import {GlobalContext} from 'context/global-context'
import {toast} from 'react-toastify'
import axios from 'axios'
import {getToken} from 'auth/auth-utils'

function SubProjectList() {
  const queryClient = useQueryClient()
  const client = useClient()
  const history = useHistory()
  const {projectId: DomainId} = useParams()
  const {permissionLevel} = useContext(GlobalContext)
  const getRows = JSON.parse(window.localStorage.getItem('subprojectlistRow'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 50)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [frequencytype, setFrequencySortingtype] = useState('asc')
  const [prevdatetype, setPrevDatetype] = useState('asc')
  const [nextdatetype, setNedxtDatetype] = useState('asc')
  const [addSubProjectModal, setSubAddProjectModal] = useState(false)
  const [domain, setDomain] = useState([])
  const [editId, setEditId] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorE2, setAnchorE2] = useState(null)
  const open = Boolean(anchorE2)
  const [deleteModal, setDeleteModal] = useState(false)

  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('subprojectlistRow', event.target.value)
    setPage(0)
  }

  const {isLoading, data, isFetching} = useQuery(
    ['singalProject', page, rowsPerPage, Sorting, DomainId],
    () => client(`getSubProjectsList/${DomainId}?limit=${rowsPerPage}&page=${page + 1}${Sorting}`),
    {keepPreviousData: true}
  )

  const {
    data: projectlistData,
    isFetching: projectlistIsFetching,
    isLoading: projectlistIsLoading,
  } = useQuery(['DdList'], () => client(`getProjectsListDrpDwn`))

  const {data: csvData, isLoading: csvisLoading} = useQuery(
    ['csvProjectSublist', DomainId],
    () =>
      axios.get(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/exportSubProjectToCsv/${DomainId}`, {
        headers: {Authorization: `Bearer ${getToken()}`},
      }),
    {
      enabled: getCompoAccess[permissionLevel]?.headBtn,
    }
  )

  const {data: googlesheetData, isLoading: googlesheetisLoading} = useQuery(
    ['exportSubProjectToGoogleSheet', DomainId],
    () => client(`exportSubProjectToGoogleSheet/${DomainId}`),
    {
      enabled: getCompoAccess[permissionLevel]?.headBtn,
    }
  )

  const {
    mutate: deleteProject,
    isLoading: deleteIsloading,
    isFetching: singalProjectlistIsFetching,
  } = useMutation(mutateData => client(`deleteSubProject/${mutateData}`, {mutateData, method: 'delete'}), {
    onSuccess: () => {
      queryClient.invalidateQueries('singalProject')
      queryClient.invalidateQueries('analyticsSingalProject')
      queryClient.invalidateQueries('csvProjectSublist')
      queryClient.invalidateQueries('exportSubProjectToGoogleSheet')
      setDeleteModal(false)
      setEditId(null)
      toast.success(`Sub Project Deleted`)
    },
  })

  const {data: singalAna, isFetching: analyticsSingalProjectisFetching} = useQuery(
    ['analyticsSingalProject', DomainId],
    () => client(`subProjectDashboard/${DomainId}`)
  )
  const analyticsData = singalAna?.data

  const analyticCardList = [
    {
      name: 'Total Keywords',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.totalKeywords,
      color: red,
    },
    {
      name: 'Top Spot',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.topSpot,
      color: green,
    },
    {
      name: 'Top 3',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.topThree,
      color: orange,
    },
    {
      name: '4-10',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.fourToTen,
      color: indigo,
    },
    {
      name: 'Top 10',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.topTen,
      color: blue,
    },
    {
      name: '11-20',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.elevenToTwenty,
      color: purple,
    },
    {
      name: '21-50',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.twentyOneToFifty,
      color: pink,
    },
    {
      name: '51-100',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.fiftyOneToHundred,
      color: teal,
    },
    {
      name: '100+',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.outOfTopHundred,
      color: lime,
    },
    {
      name: 'Improved',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.improvedCount,
      color: lightGreen,
    },
    {
      name: 'Declined',
      analyticsDataFetching: analyticsSingalProjectisFetching,
      value: analyticsData?.declinedCount,
      color: blueGrey,
    },
  ]

  React.useEffect(() => {
    if (projectlistData) {
      const domain = projectlistData?.data?.filter(list => DomainId === list._id)
      setDomain(domain)
    }
  }, [projectlistData, DomainId])

  const {mutate: Emailmutate, isLoading: EmailmutateIsLoading} = useMutation(
    data =>
      client(`enableDisableEmailNotification`, {
        data,
        method: 'put',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('singalProject')
        toast.success(`Email Notification Changed`)
      },
    }
  )

  return (
    <>
      <Box className="d-flex pb-3">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          <IconButton
            className="backbtn"
            style={{color: theme.palette.text.secondary}}
            onClick={() => history.push('/project')}
          >
            <ArrowBack />
          </IconButton>
          Sub Project: {projectlistIsLoading ? '-' : domain && domain[0] && domain[0]?.projectName}
        </Typography>
        <TextField
          select
          className="ProjectDD"
          label="Select Project"
          style={{minWidth: 250}}
          onChange={e => history.push(e.target.value)}
          defaultValue={DomainId}
          disabled={projectlistIsLoading}
        >
          {projectlistData?.data?.map(({_id, projectName}) => (
            <MenuItem key={_id} value={_id}>
              {projectName}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          pb: 3,
        }}
      >
        <Container maxWidth={false} style={{padding: 0}}>
          <Grid container spacing={3}>
            {analyticCardList.map(({name, analyticsDataFetching, value, color}, i) => {
              return (
                <AnalyticCard
                  key={i}
                  name={name}
                  analyticsDataFetching={analyticsDataFetching}
                  value={value}
                  color={color}
                />
              )
            })}
          </Grid>
        </Container>
      </Box>
      <Box className="d-flex pb-3">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Sub Project <span> ({isLoading ? '0' : data?.data?.total})</span>
        </Typography>
        {getCompoAccess[permissionLevel]?.headBtn && (
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
                      downloadResponseCSV(csvData?.data, `${domain && domain[0] && domain[0]?.projectName}_sub_project`)
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
            <Button className="ml-2" color="primary" variant="contained" onClick={() => setSubAddProjectModal(true)}>
              Add Sub Project
            </Button>
          </Box>
        )}
      </Box>
      <Paper>
        <Card>
          <Toolbar className="d-flex ">
            <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
              Current page <span> ({page + 1})</span>
            </Typography>
            {xsScreen && getCompoAccess[permissionLevel]?.headBtn && (
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
                      downloadResponseCSV(csvData?.data, `${domain && domain[0] && domain[0]?.projectName}_sub_project`)
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
                        active={Sorting.includes('keyword')}
                        direction={keySortingtype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setkeySortingtype(keySortingtype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=keyword:${keySortingtype}`)
                        }}
                      >
                        Keyword
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={Sorting.includes('keywordCheckFrequency')}
                        direction={frequencytype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setFrequencySortingtype(frequencytype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=keywordCheckFrequency:${frequencytype}`)
                        }}
                      >
                        Frequency
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={Sorting.includes('prevDate')}
                        direction={prevdatetype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setPrevDatetype(prevdatetype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=prevDate:${prevdatetype}`)
                        }}
                      >
                        Prev Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={Sorting.includes('nextDate')}
                        direction={nextdatetype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setNedxtDatetype(nextdatetype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=nextDate:${nextdatetype}`)
                        }}
                      >
                        Next Date
                      </TableSortLabel>
                    </TableCell>
                    {getCompoAccess[permissionLevel]?.action && (
                      <>
                        <TableCell>Email Notification</TableCell>
                        <TableCell>Action</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.data?.result?.length === 0 ? (
                    <TableRow hover>
                      <TableCell className="emptyTable" colSpan="8">
                        No Sub Project Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.result?.map(
                      (
                        {_id, locationCode, keywordCheckFrequency, prevDate, nextDate, newInserted, enableEmail},
                        index
                      ) => (
                        <TableRow
                          hover
                          key={_id}
                          onClick={() =>
                            history.push({
                              pathname: `/project/${DomainId}/keyword/${_id}`,
                              state: {
                                keywordName: domain && domain[0] && domain[0]?.projectName,
                                keywordlocation: getLoaction(locationCode),
                                rowtoCall: data?.data?.total,
                              },
                            })
                          }
                        >
                          <TableCell className="pl-4">{index + 1 + page * rowsPerPage}</TableCell>
                          <TableCell className="keywordCell">
                            {`${domain && domain[0] && domain[0]?.projectName} - ${getLoaction(locationCode)}`}
                            {newInserted && (
                              <Tooltip TransitionComponent={Zoom} title="Keyword pending" placement="top">
                                <Cached style={{color: orange[500]}} />
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>{getKeywordFrequency(keywordCheckFrequency)}</TableCell>
                          <TableCell>{getFormetedData(prevDate)}</TableCell>
                          <TableCell>{getFormetedData(nextDate)}</TableCell>
                          {getCompoAccess[permissionLevel]?.action && (
                            <>
                              <TableCell>
                                <Switch
                                  color="primary"
                                  checked={enableEmail}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e =>
                                    Emailmutate({
                                      _id,
                                      enableEmail: e.target.checked,
                                    })
                                  }
                                />
                              </TableCell>
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
                                        setSubAddProjectModal(true)
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
                            </>
                          )}
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {(isFetching || projectlistIsFetching || singalProjectlistIsFetching || EmailmutateIsLoading) && (
              <LinearProgress />
            )}
            <TablePagination
              rowsPerPageOptions={[50, 100, 200, 500, 1000, 2000]}
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
            modalFrom="Sub Project"
            onClose={() => {
              setDeleteModal(false)
              setEditId(null)
            }}
          />
        )}
        {addSubProjectModal && (
          <AddSubProjectListModal
            editId={editId}
            data={data}
            setEditId={setEditId}
            _projectId={DomainId}
            domain={domain}
            open={addSubProjectModal}
            setOpen={setSubAddProjectModal}
          />
        )}
      </Paper>
    </>
  )
}

export {SubProjectList}
