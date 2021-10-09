import React, {useState} from 'react'
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
  LinearProgress,
  Tooltip,
  Zoom,
  IconButton,
  Collapse,
  Chip,
} from '@material-ui/core'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import {useClient} from 'useClient'
import {useParams, useHistory, useLocation} from 'react-router-dom'
import {getDifference, getFormetedData} from 'util/app-utill'
import {ArrowBack} from '@material-ui/icons'
import theme from 'theme'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

function KeywordTagList() {
  const client = useClient()
  const {tagId} = useParams()
  const {state} = useLocation()
  const getRows = JSON.parse(window.localStorage.getItem('KeywordTagListRow'))
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [weekSortingtype, setweekSortingtype] = useState('asc')
  const [prwRank, setprwRank] = useState('asc')
  const [diffSortingtype, setdiffSortingtype] = useState('asc')
  const [urlSortingtype, setUrlSortingtype] = useState('asc')
  const history = useHistory()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('KeywordTagListRow', event.target.value)
    setPage(0)
  }

  const demoObj = {
    data: [
      {
        tagName: 'yash',
        keywords: [
          {
            rank: 4,
            date: '2021-10-03T00:00:00.000Z',
          },
          {
            rank: 1,
            date: '2021-10-01T00:00:00.000Z',
          },
          {
            rank: 3,
            date: '2021-09-30T00:00:00.000Z',
          },
          {
            rank: 3,
            date: '2021-09-04T00:00:00.000Z',
          },
          {
            rank: 2,
            date: '2021-09-04T00:00:00.000Z',
          },
        ],
      },
      {
        tagName: 'trupesh',
        keywords: [
          {
            rank: 3,
            date: '2021-10-03T00:00:00.000Z',
          },
          {
            rank: 3.33,
            date: '2021-10-01T00:00:00.000Z',
          },
          {
            rank: 1.77,
            date: '2021-09-30T00:00:00.000Z',
          },
          {
            rank: 2,
            date: '2021-09-29T00:00:00.000Z',
          },
          {
            rank: 3,
            date: '2021-09-04T00:00:00.000Z',
          },
        ],
      },
    ],
    message: 'Keyword(s) graph details fetched successfully.',
    status: true,
  }

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar',
      },

      xaxis: demoObj.data.map(Gd => {
        return {
          categories: Gd.keywords.map(fd => getFormetedData(fd.date)),
        }
      })[0],
      yaxis: {reversed: true},
    },

    series: demoObj.data.map(Gd => {
      return {
        name: Gd.tagName,
        data: Gd.keywords.map(fd => fd.rank),
      }
    }),
  }

  const {data, isFetching} = useQuery(
    ['keywordsForTags', page, rowsPerPage, Sorting],
    () => client(`keywordsForTags/${tagId}?limit=${rowsPerPage}page=${page + 1}${Sorting}`),
    {
      keepPreviousData: true,
    }
  )

  // const {data: GraphData} = useQuery(['keywordsOfTagsGraph', tagId], () => client(`keywordsOfTagsGraph/${tagId}`))

  // console.log(
  //   demoObj.data.map(Gd => {
  //     return {
  //       // categories: Gd.keywords.map(fd => fd.rank)[0],
  //       categories: Gd.keywords.map(fd => getFormetedData(fd.date)),
  //     }
  //   })[0]
  // )

  return (
    <>
      <Box className="d-flex">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          <IconButton
            className="backbtn"
            style={{color: theme.palette.text.secondary}}
            onClick={() => history.goBack()}
          >
            <ArrowBack />
          </IconButton>
          Tag Name: {state.tagName ? state.tagName : '-'}
        </Typography>
      </Box>
      <Chart options={chartData.options} series={chartData.series} type="line" width="100%" height="320px" />
      <Box sx={{mt: 2}} className="d-flex pb-3 pt-2">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Keyword Tag list <span> ({data?.data?.total})</span>
        </Typography>
      </Box>
      <Paper>
        <Card>
          <Toolbar className="d-flex ">
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
                    <TableCell />
                    <TableCell>#</TableCell>
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
                    <TableCell className="prev-rank ">
                      <TableSortLabel
                        active={Sorting.includes('prevRankGroup')}
                        direction={prwRank === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setprwRank(prwRank === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=prevRankGroup:${prwRank}`)
                        }}
                      >
                        <div>
                          Prev Rank
                          <Tooltip title={`Previous Date: ${getFormetedData(data?.data?.result[0]?.prevDate)}`}>
                            <span className="ml-2">{getFormetedData(data?.data?.result[0]?.prevDate)}</span>
                          </Tooltip>
                        </div>
                      </TableSortLabel>
                    </TableCell>
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
                        active={Sorting.includes('difference')}
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
                      <TableSortLabel
                        active={Sorting.includes('url')}
                        direction={urlSortingtype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setUrlSortingtype(urlSortingtype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=url:${urlSortingtype}`)
                        }}
                      >
                        URL
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.data?.result?.length === 0 ? (
                    <TableRow hover>
                      <TableCell className="emptyTable" colSpan="11">
                        No Tag Keyword Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.result?.map(
                      ({_id, keyword, nextDate, prevRankGroup, rankGroup, url, difference, tags}, index) => {
                        return (
                          <>
                            <TableRow hover key={_id} role="checkbox">
                              <TableCell>
                                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                              </TableCell>
                              <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                              <TableCell>
                                {keyword}
                                {tags.map(e => (
                                  <Chip className="ml-1" label={e.tagName} />
                                ))}
                              </TableCell>
                              <TableCell>{prevRankGroup || '-'}</TableCell>
                              <TableCell>{rankGroup || '-'}</TableCell>
                              <TableCell className={getDifference(prevRankGroup, rankGroup, 'GET_ClASS')}>
                                {difference?.toString()?.replace('-', '')}
                                {getDifference(prevRankGroup, rankGroup, 'GET_ICON')}
                              </TableCell>
                              <Tooltip
                                onClick={() => {
                                  if (url) {
                                    const win = window.open(url, '_blank')
                                    win.focus()
                                  }
                                }}
                                TransitionComponent={Zoom}
                                title={url || 'Not available'}
                                placement="top"
                              >
                                <TableCell className="urlEcllips">{url || '-'}</TableCell>
                              </Tooltip>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                style={{
                                  paddingBottom: 0,
                                  paddingTop: 0,
                                }}
                                colSpan={11}
                              >
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                  <Box margin={1}>
                                    <Chart
                                      options={chartData.options}
                                      series={chartData.series}
                                      type="line"
                                      width="100%"
                                      height="320px"
                                    />
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </>
                        )
                      }
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {isFetching && <LinearProgress />}
            <TablePagination
              rowsPerPageOptions={[5, 10, 50, 100, 200, 500]}
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

export {KeywordTagList}
