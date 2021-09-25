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
  MenuItem,
  useMediaQuery,
  IconButton,
  Menu,
  TextField,
} from '@material-ui/core'
import axios from 'axios'
import {useQuery} from 'react-query'
import AnalyticCard from 'components/analytic-card'
import {blueGrey, green, indigo, lightGreen, lime, orange, pink, purple, red, teal} from '@material-ui/core/colors'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {useTheme} from '@material-ui/core/styles'
import {downloadResponseCSV, getDifference, getFormetedData, getLoaction} from 'util/app-utill'
import {ArrowBack} from '@material-ui/icons'

function KeywordList() {
  const history = useHistory()
  const theme = useTheme()
  const {state} = useLocation()
  const {subProjectId: KeywordId, projectId} = useParams()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const getRows = JSON.parse(window.localStorage.getItem('keywordlistRow'))
  const getkeywordName = window.localStorage.getItem('keywordName')
  const getkeywordLocation = window.localStorage.getItem('keywordLocation')
  const getkeywordRowtocall = window.localStorage.getItem('keywordRowtocall')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 50)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [weekSortingtype, setweekSortingtype] = useState('asc')
  const [diffSortingtype, setdiffSortingtype] = useState('asc')
  // const [urlSortingtype, seturlSortingtype] = useState('asc')

  const [anchorE2, setAnchorE2] = useState(null)
  const open = Boolean(anchorE2)

  React.useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    window.onpopstate = () => {
      history.push(`/project/${projectId}`)
    }
    return () => (window.onpopstate = () => {})
  }, [history, projectId])

  React.useEffect(() => {
    if (state?.keywordName) {
      window.localStorage.setItem('keywordName', state?.keywordName)
    }
    if (state?.keywordlocation) {
      window.localStorage.setItem('keywordLocation', state?.keywordlocation)
    }
    if (state?.rowtoCall) {
      window.localStorage.setItem('keywordRowtocall', state?.rowtoCall)
    }
  }, [state?.keywordName, state?.keywordlocation, state?.rowtoCall])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('keywordlistRow', event.target.value)
    setPage(0)
  }

  async function fetchTable(page = 0, Sorting, KeywordId) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/getKeywords/${KeywordId}?limit=${rowsPerPage}&page=${
      page + 1
    }${Sorting}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {data, isFetching} = useQuery(
    ['keyWordList', page, rowsPerPage, Sorting, KeywordId],
    () => fetchTable(page, Sorting, KeywordId),
    {keepPreviousData: true}
  )

  async function fetchDdkeyword() {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/getSubProjectsList/${projectId}?limit=${
      state?.rowtoCall || getkeywordRowtocall
    }`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {
    data: DdlistKeywordData,
    isFetching: DdlistKeywordisFetching,
    isLoading: DdlistKeywordisLoading,
  } = useQuery(['DdlistKeyword'], () => fetchDdkeyword(), {
    keepPreviousData: true,
  })

  async function fetchCSV(KeywordId) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/exportKeywordsToCsv/${KeywordId}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {data: csvData, isLoading: csvisLoading} = useQuery(['exportKeywordsToCsv', KeywordId], () =>
    fetchCSV(KeywordId)
  )

  async function fetchGooglesheet(KeywordId) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/exportKeywordsToGoogleSheet/${KeywordId}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {data: googlesheetData, isLoading: googlesheetisLoading} = useQuery(
    ['exportKeywordsToGoogleSheet', KeywordId],
    () => fetchGooglesheet(KeywordId)
  )

  async function fetchApiKeyword(KeywordId) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/keywordDashboard/${KeywordId}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {data: keywordAnalytics, isFetching: analyticsKeywordisFetching} = useQuery(
    ['analyticskeywordDashboard', KeywordId],
    () => fetchApiKeyword(KeywordId)
  )
  const analyticsData = keywordAnalytics?.data

  const analyticCardList = [
    {
      name: 'Total Keywords',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.totalKeywords,
      color: red,
    },
    {
      name: 'Top 1',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.topSpot,
      color: green,
    },
    {
      name: 'Top 3',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.topThree,
      color: orange,
    },
    {
      name: '4-10',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.fourToTen,
      color: indigo,
    },
    {
      name: '11-20',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.elevenToTwenty,
      color: purple,
    },
    {
      name: '21-50',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.twentyOneToFifty,
      color: pink,
    },
    {
      name: '50-100',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.fiftyOneToHundred,
      color: teal,
    },
    {
      name: '100+',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.outOfTopHundred,
      color: lime,
    },
    {
      name: 'Improved Count',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.improvedCount,
      color: lightGreen,
    },
    {
      name: 'Declined Count',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.declinedCount,
      color: blueGrey,
    },
  ]

  return (
    <>
      <Box className="d-flex pb-3">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          <IconButton
            className="backbtn"
            style={{color: theme.palette.text.secondary}}
            onClick={() => history.goBack()}
          >
            <ArrowBack />
          </IconButton>
          Keyword: {state?.keywordName || getkeywordName} - {state?.keywordlocation || getkeywordLocation}
        </Typography>
        <TextField
          select
          style={{minWidth: 250}}
          className="ProjectDD"
          label="Select Sub Project"
          onChange={e => history.push(`/project/${projectId}/keyword/${e.target.value}`)}
          defaultValue={KeywordId}
          disabled={DdlistKeywordisLoading}
        >
          {DdlistKeywordData?.data?.result?.map(data => (
            <MenuItem
              key={data._id}
              value={data._id}
              onClick={() => window.localStorage.setItem('keywordLocation', getLoaction(data.locationCode))}
            >
              {state?.keywordName || getkeywordName} - {getLoaction(data.locationCode) || getkeywordLocation}
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
          Keyword List <span> ({data?.data?.total})</span>
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
                    downloadResponseCSV(csvData, `keyword_list`)
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
        </Box>
      </Box>
      <Paper>
        <Card>
          <Toolbar className="d-flex ">
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
                      downloadResponseCSV(csvData, `keyword_list`)
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
                    {/* <TableCell>Frequency</TableCell> */}
                    <TableCell>Prev Date</TableCell>
                    <TableCell>Next Date</TableCell>
                    <TableCell>Prev Rank</TableCell>
                    <TableCell sortDirection={false}>
                      <TableSortLabel
                        active={Sorting.includes('rankGroup')}
                        direction={weekSortingtype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setweekSortingtype(weekSortingtype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=rankGroup:${weekSortingtype}`)
                        }}
                      >
                        Current Rank
                      </TableSortLabel>
                    </TableCell>
                    <TableCell style={{minWidth: 80}}>
                      <TableSortLabel
                        active={Sorting.includes('diff')}
                        direction={diffSortingtype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setdiffSortingtype(diffSortingtype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=difference:${diffSortingtype}`)
                        }}
                      >
                        Diff
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      URL
                      {/* <TableSortLabel
                        active={Sorting.includes('url')}
                        direction={urlSortingtype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          seturlSortingtype(urlSortingtype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=url:${urlSortingtype}`)
                        }}
                      > */}
                      {/* </TableSortLabel> */}
                    </TableCell>
                    {/* <TableCell>Status</TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.data?.result?.length === 0 ? (
                    <TableRow hover>
                      <TableCell className="emptyTable" colSpan="11">
                        No Keyword Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.result?.map(
                      ({_id, keyword, prevDate, nextDate, prevRankGroup, rankGroup, url, difference}, index) => (
                        <TableRow hover key={_id}>
                          <TableCell className="pl-4">{index + 1 + page * rowsPerPage}</TableCell>
                          <TableCell>{keyword}</TableCell>
                          {/* <TableCell>{getKeywordFrequency(keywordCheckFrequency)}</TableCell> */}
                          <TableCell>{getFormetedData(prevDate)}</TableCell>
                          <TableCell>{getFormetedData(nextDate)}</TableCell>
                          <TableCell>{prevRankGroup || '-'}</TableCell>
                          <TableCell>{rankGroup || '-'}</TableCell>
                          <TableCell className={getDifference(prevRankGroup, rankGroup, 'GET_ClASS')}>
                            {difference.toString().replace('-', '')}
                            {getDifference(prevRankGroup, rankGroup, 'GET_ICON')}
                          </TableCell>
                          <Tooltip TransitionComponent={Zoom} title={url || 'Not available'} placement="top">
                            <TableCell className="urlEcllips">{url || '-'}</TableCell>
                          </Tooltip>
                          {/* <Tooltip
                            TransitionComponent={Zoom}
                            title={getStatus(error, errorMessage, newInserted, 'GET_TOOLTIP')}
                            placement="top"
                          >
                            <TableCell>{getStatus(error, errorMessage, newInserted, 'GET_VALUE')}</TableCell>
                          </Tooltip> */}
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {isFetching && DdlistKeywordisFetching && <LinearProgress />}
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
      </Paper>
    </>
  )
}

export {KeywordList}
