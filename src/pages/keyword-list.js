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
} from '@material-ui/core'
import axios from 'axios'
import {useQuery} from 'react-query'
import AnalyticCard from 'components/analytic-card'
import {green, indigo, lime, orange, pink, purple, red, teal} from '@material-ui/core/colors'
import {useHistory, useParams} from 'react-router-dom'
import {useTheme} from '@material-ui/core/styles'
import {downloadResponseCSV, getDifference, getFormetedData, getKeywordFrequency, getStatus} from 'util/app-utill'
import {ArrowBack} from '@material-ui/icons'

function KeywordList() {
  const history = useHistory()
  const {id: KeywordId} = useParams()
  const getRows = JSON.parse(window.localStorage.getItem('Rowsperpage'))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [weekSortingtype, setweekSortingtype] = useState('asc')
  const [anchorE2, setAnchorE2] = useState(null)
  const open = Boolean(anchorE2)
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('Rowsperpage', event.target.value)
    setPage(0)
  }

  async function fetchTable(page = 0, Sorting, KeywordId) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/getKeywords/${KeywordId}?limit=${rowsPerPage}?page=${
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

  async function fetchApiSingalProject(KeywordId) {
    const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/keywordDashboard/${KeywordId}`
    const {data} = await axios.get(fetchURL)
    return data
  }

  const {
    data: keywordAnalytics,
    isFetching: analyticsSingalProjectisFetching,
    isLoading: anaLoading,
  } = useQuery(['analyticskeywordDashboard', KeywordId], () => fetchApiSingalProject(KeywordId))
  const analyticsData = keywordAnalytics?.data

  const analyticCardList = [
    {
      name: 'Total Keywords',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading,
      value: analyticsData?.totalKeywords,
      color: red,
    },
    {
      name: 'Top Spot',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading,
      value: analyticsData?.topSpot,
      color: green,
    },
    {
      name: 'Top Three',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading,
      value: analyticsData?.topThree,
      color: orange,
    },
    {
      name: 'Four To Ten',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading,
      value: analyticsData?.fourToTen,
      color: indigo,
    },
    {
      name: 'Eleven To Twenty',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading,
      value: analyticsData?.elevenToTwenty,
      color: purple,
    },
    {
      name: 'TwentyOne To Fifty',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading,
      value: analyticsData?.twentyOneToFifty,
      color: pink,
    },
    {
      name: 'FiftyOne To Hundred',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading,
      value: analyticsData?.fiftyOneToHundred,
      color: teal,
    },
    {
      name: 'Out Of Top Hundred',
      analyticsDataFetching: analyticsSingalProjectisFetching || anaLoading,
      value: analyticsData?.outOfTopHundred,
      color: lime,
    },
  ]

  return (
    <>
      <Box className="d-flex pb-3">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          <IconButton style={{color: theme.palette.text.secondary}} onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
          Analytics of Keyword list
        </Typography>
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
          Keyword list <span> ({data?.data?.total})</span>
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
                        </TableRow>
                      )
                    )
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
      </Paper>
    </>
  )
}

export {KeywordList}
