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
  Chip,
} from '@material-ui/core'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import {useClient} from 'useClient'
import {useParams, useHistory, useLocation} from 'react-router-dom'
import {getDifference, getFormetedData} from 'util/app-utill'
import {ArrowBack} from '@material-ui/icons'
import theme from 'theme'
import {KeywordGraph} from 'components/keyword-graph-modal'

function KeywordTagList() {
  const client = useClient()
  const {tagId} = useParams()
  const {state} = useLocation()
  const getRows = JSON.parse(window.localStorage.getItem('KeywordTagListRow'))
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 100)
  const [page, setPage] = useState(0)
  const [keywordId, setKeywordID] = useState(0)
  const [keywordName, setKeywordName] = useState('')
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

  const {data, isFetching} = useQuery(
    ['keywordsForTags', page, rowsPerPage, Sorting],
    () => client(`keywordsForTags/${tagId}?limit=${rowsPerPage}&page=${page + 1}${Sorting}`),
    {
      keepPreviousData: true,
    }
  )

  const {data: GraphData = []} = useQuery(['keywordsOfTagsGraph', tagId], () => client(`keywordsOfTagsGraph/${tagId}`))

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar',
      },

      xaxis: {
        categories: GraphData?.data?.map(GD => getFormetedData(GD.date)),
      },
      yaxis: {reversed: true},
    },

    series: [{name: state.tagName ? state.tagName : '-', data: GraphData?.data?.map(Gd => Gd?.rank || {})}],
  }

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
      <Chart options={chartData?.options} series={chartData?.series} type="line" width="100%" height="320px" />
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
                            <TableRow
                              hover
                              key={_id}
                              onClick={() => {
                                setKeywordID(_id)
                                setOpen(true)
                                setKeywordName(keyword)
                              }}
                            >
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
                                onClick={e => {
                                  e.stopPropagation()
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
        {open && (
          <KeywordGraph
            open={open}
            keywordId={keywordId}
            keywordName={keywordName}
            onClose={() => {
              setOpen(false)
              setKeywordID(null)
              setKeywordName('')
            }}
          />
        )}
      </Paper>
    </>
  )
}

export {KeywordTagList}
