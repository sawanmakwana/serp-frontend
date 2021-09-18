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
  Box,
  Container,
  Grid,
  LinearProgress,
  Button,
  TextField,
  MenuItem,
  useMediaQuery,
  IconButton,
} from '@material-ui/core'
import axios from 'axios'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import AnalyticCard from 'components/analytic-card'
import {AddSubProjectListModal} from 'components/add-sub-project'
import {green, indigo, lime, orange, pink, purple, red, teal} from '@material-ui/core/colors'
import {useHistory, useParams} from 'react-router-dom'
import {Trash2} from 'react-feather'
import {DeleteModal} from 'components/delete-modal'
import {useTheme} from '@material-ui/core/styles'
import {downloadResponseCSV, getDifference, getFormetedData, getKeywordFrequency, getStatus} from 'app-utill'
import {ArrowBack} from '@material-ui/icons'

function Project() {
  const queryClient = useQueryClient()
  const history = useHistory()
  const {id: DomainId} = useParams()
  const getRows = JSON.parse(window.localStorage.getItem('Rowsperpage'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [weekSortingtype, setweekSortingtype] = useState('asc')
  const [addSubProjectModal, setSubAddProjectModal] = useState(false)
  const [listProject, setListProject] = useState([])
  const [domain, setDomain] = useState([])
  const [editId, setEditId] = useState(null)

  const [deleteModal, setDeleteModal] = useState(false)
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))

  React.useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    window.onpopstate = () => {
      history.push('/project')
    }
    return () => (window.onpopstate = () => {})
  }, [history])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('Rowsperpage', event.target.value)
    setPage(0)
  }

  async function fetchTable(page = 0, Sorting, DomainId) {
    const fetchURL = `${
      process.env.REACT_APP_PLATFORM_ENDPOINT
    }/getSubProjectsList/${DomainId}?limit=${rowsPerPage}?page=${page + 1}${Sorting}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {isLoading, data, isFetching} = useQuery(
    ['singalProject', page, rowsPerPage, Sorting, DomainId],
    () => fetchTable(page, Sorting, DomainId),
    {keepPreviousData: true}
  )

  async function fetchprojectlistAPI() {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/getProjectsListDrpDwn`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {
    isLoading: projectlistisLoading,
    data: projectlistData,
    isFetching: projectlistIsFetching,
  } = useQuery(['DdList'], () => fetchprojectlistAPI())

  async function fetchCSV(DomainId) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/exportSubProjectToCsv/${DomainId}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {data: csvData, isLoading: csvisLoading} = useQuery(['csvProjectSublist', DomainId], () => fetchCSV(DomainId))

  const {
    mutate: deleteProject,
    isLoading: deleteIsloading,
    isFetching: singalProjectlistIsFetching,
  } = useMutation(
    mutateData => axios.delete(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/deleteSubProject/${mutateData}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('singalProject')
        queryClient.invalidateQueries('analyticsSingalProject')
        setDeleteModal(false)
        setEditId(null)
      },
    }
  )

  async function fetchApiSingalProject(DomainId) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/subProjectDashboard/${DomainId}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {
    data: singalAna,
    isFetching: analyticsSingalProjectisFetching,
    isLoading: anaLoading,
  } = useQuery(['analyticsSingalProject', DomainId], () => fetchApiSingalProject(DomainId))
  const analyticsData = singalAna?.data

  const analyticCardList = [
    {
      name: 'Total Keywords',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading || projectlistisLoading,
      value: analyticsData?.totalKeywords,
      color: red,
    },
    {
      name: 'Top Spot',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading || projectlistisLoading,
      value: analyticsData?.topSpot,
      color: green,
    },
    {
      name: 'Top Three',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading || projectlistisLoading,
      value: analyticsData?.topThree,
      color: orange,
    },
    {
      name: 'Four To Ten',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading || projectlistisLoading,
      value: analyticsData?.fourToTen,
      color: indigo,
    },
    {
      name: 'Eleven To Twenty',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading || projectlistisLoading,
      value: analyticsData?.elevenToTwenty,
      color: purple,
    },
    {
      name: 'TwentyOne To Fifty',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading || projectlistisLoading,
      value: analyticsData?.twentyOneToFifty,
      color: pink,
    },
    {
      name: 'FiftyOne To Hundred',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading || projectlistisLoading,
      value: analyticsData?.fiftyOneToHundred,
      color: teal,
    },
    {
      name: 'Out Of Top Hundred',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading || projectlistisLoading,
      value: analyticsData?.outOfTopHundred,
      color: lime,
    },
  ]

  React.useEffect(() => {
    if (projectlistData) {
      const {data} = projectlistData
      const listProject = data?.map(({projectName, _id, domain}) => {
        return {projectName, value: _id, domain}
      })
      setListProject(listProject)
      const domain = listProject?.filter(list => DomainId === list.value)
      setDomain(domain)
    }
  }, [projectlistData, DomainId])

  return (
    <>
      <Box className="d-flex pb-3">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          <IconButton style={{color: theme.palette.text.secondary}} onClick={() => history.push('/project')}>
            <ArrowBack />
          </IconButton>
          Analytics of {domain && domain[0] && domain[0]?.projectName}
        </Typography>
        <TextField
          onChange={e => history.push(e.target.value)}
          style={{minWidth: 200}}
          label="Select Project"
          select
          defaultValue={DomainId}
          disabled={isLoading}
        >
          {listProject?.map(({value, projectName}) => (
            <MenuItem key={value} value={value}>
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
          Sub Project <span> ({data?.data?.total})</span>
        </Typography>
        <Box>
          {!xsScreen && (
            <Button
              onClick={() => {
                downloadResponseCSV(csvData, `${domain && domain[0] && domain[0]?.projectName}_sub_project`)
              }}
              disabled={csvisLoading}
              style={{
                color: csvisLoading ? theme.palette.text.secondary : theme.palette.primary.main,
              }}
            >
              Export
            </Button>
          )}
          <Button className="ml-2" color="primary" variant="contained" onClick={() => setSubAddProjectModal(true)}>
            Add Sub Project
          </Button>
        </Box>
      </Box>
      <Paper>
        <Card>
          <Toolbar className="d-flex ">
            <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
              Current page <span> ({page + 1})</span>
            </Typography>
            {xsScreen && (
              <Button
                onClick={() => {
                  downloadResponseCSV(csvData, `${domain && domain[0] && domain[0]?.projectName}'s_project_list`)
                }}
                disabled={csvisLoading}
                style={{
                  color: csvisLoading ? theme.palette.text.secondary : theme.palette.primary.main,
                }}
              >
                Export
              </Button>
            )}
          </Toolbar>
          <Divider />
          <CardContent style={{padding: '0'}}>
            <TableContainer>
              <Table size="medium" className="selectTable sublist">
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
                    <TableCell>Frequency</TableCell>
                    <TableCell>Prev Date</TableCell>
                    <TableCell>Next Date</TableCell>
                    <TableCell>Prev Rank</TableCell>
                    <TableCell sortDirection={false}>
                      <TableSortLabel
                        active={Sorting.includes('rankAbsolute')}
                        direction={weekSortingtype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setweekSortingtype(weekSortingtype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=rankAbsolute:${weekSortingtype}`)
                        }}
                      >
                        Current Rank
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Diff</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.data?.result?.length === 0 ? (
                    <TableRow hover>
                      <TableCell className="emptyTable" colSpan="11">
                        No Sub Project Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.result?.map(
                      (
                        {
                          _id,
                          keyword,
                          keywordCheckFrequency,
                          prevDate,
                          nextDate,
                          prevRankAbsolute,
                          rankAbsolute,
                          url,
                          error,
                          errorMessage,
                          newInserted,
                        },
                        index
                      ) => (
                        <TableRow hover key={_id}>
                          <TableCell className="pl-4">{index + 1 + page * rowsPerPage}</TableCell>
                          <TableCell>{keyword}</TableCell>
                          <TableCell>{getKeywordFrequency(keywordCheckFrequency)}</TableCell>
                          <TableCell>{getFormetedData(prevDate)}</TableCell>
                          <TableCell>{getFormetedData(nextDate)}</TableCell>
                          <TableCell>{prevRankAbsolute || '-'}</TableCell>
                          <TableCell>{rankAbsolute || '-'}</TableCell>
                          <TableCell className={getDifference(prevRankAbsolute, rankAbsolute, 'GET_ClASS')}>
                            {getDifference(prevRankAbsolute, rankAbsolute, 'GET_NUM')}
                            {getDifference(prevRankAbsolute, rankAbsolute, 'GET_ICON')}
                          </TableCell>
                          <Tooltip TransitionComponent={Zoom} title={url || 'Not available'} placement="top">
                            <TableCell className="urlEcllips">{url || '-'}</TableCell>
                          </Tooltip>
                          <Tooltip
                            TransitionComponent={Zoom}
                            title={getStatus(error, errorMessage, newInserted, 'GET_TOOLTIP')}
                            placement="top"
                          >
                            <TableCell>{getStatus(error, errorMessage, newInserted, 'GET_VALUE')}</TableCell>
                          </Tooltip>
                          <TableCell>
                            <Button
                              className="selectTablebtn"
                              onClick={e => {
                                setEditId(_id)
                                setDeleteModal(true)
                                e.stopPropagation()
                              }}
                            >
                              <Trash2 />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {(isFetching || projectlistIsFetching || singalProjectlistIsFetching) && <LinearProgress />}
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

export {Project}
