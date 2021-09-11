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
  Box,
  Container,
  Grid,
  LinearProgress,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core'
import axios from 'axios'
import {makeStyles} from '@material-ui/styles'
import {useQuery} from 'react-query'
import CallMadeIcon from '@material-ui/icons/CallMade'
import CallReceivedIcon from '@material-ui/icons/CallReceived'
import RemoveIcon from '@material-ui/icons/Remove'
import CheckIcon from '@material-ui/icons/Check'
import AnalyticCard from 'components/analytic-card'
import {AddSubProjectListModal} from 'components/add-sub-project'
import {green, indigo, orange, red} from '@material-ui/core/colors'
import {useHistory, useParams} from 'react-router-dom'

const useToolbarStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))
function Project() {
  const classesTool = useToolbarStyles()
  const history = useHistory()
  const paramId = useParams()
  const getRows = JSON.parse(window.localStorage.getItem('Rowsperpage'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [weekSortingtype, setweekSortingtype] = useState('asc')
  const [addSubProjectModal, setSubAddProjectModal] = useState(false)
  const [listProject, setListProject] = useState([])
  const [domain, setDomain] = useState([])

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

  async function fetchprojectlistAPI() {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/getProjectsListDrpDwn`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {
    isLoading: projectlistisLoading,
    data: projectlistData,
    error: projectlistError,
    isFetching: projectlistIsFetching,
  } = useQuery(['reposData', page, rowsPerPage, Sorting], () => fetchprojectlistAPI(), {keepPreviousData: true})

  React.useEffect(() => {
    if (projectlistData) {
      const {data: Listdata} = projectlistData
      const listProject = Listdata.result.map(({projectName, _id, domain}) => {
        return {projectName, value: _id, domain}
      })
      setListProject(listProject)
      const domain = listProject.filter(list => paramId.id === list.value)
      setDomain(domain)
    }
  }, [projectlistData, paramId.id])

  if (isLoading || projectlistisLoading)
    return (
      <div className="spinner table">
        <CircularProgress />
      </div>
    )

  if (error || projectlistError) return `An error has occurred: ${error.message || projectlistError.messages}`

  const getDifference = (prevRank, currentRank, type = '') => {
    let diff
    switch (type) {
      case 'GET_NUM':
        diff = currentRank - prevRank
        return diff.toString().replace('-', '')

      case 'GET_ClASS':
        if (!prevRank) return 'noprevRank'
        if (currentRank === prevRank) return 'sameRank'
        if (currentRank > prevRank) return 'decRank'
        if (currentRank < prevRank) return 'incRank'
        break

      case 'GET_ICON':
        if (!prevRank) return <RemoveIcon />
        if (currentRank === prevRank) return <CheckIcon />
        if (currentRank > prevRank) return <CallReceivedIcon />
        if (currentRank < prevRank) return <CallMadeIcon />
        break

      default:
        break
    }
  }

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
          Analytics of Single Project
        </Typography>
        <TextField
          onChange={e => history.push(e.target.value)}
          style={{minWidth: 200}}
          label="Select Project"
          select
          variant="outlined"
          defaultValue={paramId.id}
          disabled={isLoading}
        >
          {listProject.map(({value, projectName}) => (
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
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <AnalyticCard name="KEYWORD" value="$24,000" color={red} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <AnalyticCard name="KEYWORD" value="$24,000" color={green} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <AnalyticCard name="KEYWORD" value="$24,000" color={orange} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <AnalyticCard name="KEYWORD" value="$24,000" color={indigo} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 3,
        }}
      >
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Sub Project <span> ({data.data?.total})</span>
        </Typography>
        <Box>
          <Button style={{color: '#5664D2'}}>Export</Button>
          <Button className="ml-2" color="primary" variant="contained" onClick={() => setSubAddProjectModal(true)}>
            Add Sub Project
          </Button>
        </Box>
      </Box>
      <Paper>
        <Card>
          <Toolbar className={classesTool.root}>
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
                    <TableCell>Previous week</TableCell>
                    <TableCell sortDirection={false}>
                      <TableSortLabel
                        active={Sorting.includes('rankAbsolute')}
                        direction={weekSortingtype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setweekSortingtype(weekSortingtype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=rankAbsolute:${weekSortingtype}`)
                        }}
                      >
                        Current week
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Difference</TableCell>
                    <TableCell>URL</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.data?.result?.map(({_id, keyword, prevRankAbsolute, rankAbsolute, url}, index) => (
                    <TableRow hover key={_id}>
                      <TableCell className="pl-4">{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell>{keyword}</TableCell>
                      <TableCell>{prevRankAbsolute || '-'}</TableCell>
                      <TableCell>{rankAbsolute || '-'}</TableCell>
                      <TableCell className={getDifference(prevRankAbsolute, rankAbsolute, 'GET_ClASS')}>
                        {getDifference(prevRankAbsolute, rankAbsolute, 'GET_NUM')}
                        {getDifference(prevRankAbsolute, rankAbsolute, 'GET_ICON')}
                      </TableCell>
                      <Tooltip TransitionComponent={Zoom} title={url} placement="top">
                        <TableCell className="urlEcllips">{url}</TableCell>
                      </Tooltip>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {(isFetching || projectlistIsFetching) && <LinearProgress />}
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
        {/* {deleteModal && (
          <DeleteModal
            deleteProject={() => deleteProject(editId)}
            deleteModal={deleteModal}
            deleteIsloading={deleteIsloading}
            onClose={() => {
              setDeleteModal(false)
              setEditId(null)
            }}
          />
        )} */}
        {addSubProjectModal && (
          <AddSubProjectListModal
            // editId={editId}
            // setEditId={setEditId}
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
