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
} from '@material-ui/core'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import {useClient} from 'useClient'
import {useParams} from 'react-router-dom'
import {getDifference, getFormetedData} from 'util/app-utill'

function KeywordTagList() {
  const client = useClient()
  const {tagId} = useParams()
  const getRows = JSON.parse(window.localStorage.getItem('KeywordTagListRow'))
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [page, setPage] = useState(0)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [weekSortingtype, setweekSortingtype] = useState('asc')
  const [diffSortingtype, setdiffSortingtype] = useState('asc')
  const [urlSortingtype, setUrlSortingtype] = useState('asc')

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('KeywordTagListRow', event.target.value)
    setPage(0)
  }

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [
          1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2007,
        ],
      },
    },
    series: [
      {
        name: 'series-1',
        data: [10, 80, 205, 100, 49, 60, 70, 91, 200, 10, 250, 30, 60, 10, 100, 0, 200],
      },
    ],
  }

  const {data, isFetching} = useQuery(
    ['keywordsForTags', page, rowsPerPage, Sorting],
    () => client(`keywordsForTags/${tagId}?limit=${rowsPerPage}page=${page + 1}${Sorting}`),
    {
      keepPreviousData: true,
    }
  )

  return (
    <>
      <Chart options={chartData.options} series={chartData.series} type="line" width="100%" height="320px" />
      <Box sx={{mt: 2}} className="d-flex pb-3 pt-2">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Keyword Tag list <span> (12)</span>
        </Typography>
      </Box>
      <Paper>
        <Card>
          <Toolbar className="d-flex ">
            <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
              Current page <span> (12)</span>
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
                    <TableCell className="prev-rank">
                      <p>Prev Rank</p>
                      <Tooltip title={`Previous Date: ${getFormetedData(data?.data?.result[0]?.prevDate)}`}>
                        <span>{getFormetedData(data?.data?.result[0]?.prevDate)}</span>
                      </Tooltip>
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
                        No Keyword Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.result?.map(
                      ({_id, keyword, nextDate, prevRankGroup, rankGroup, url, difference}, index) => {
                        return (
                          <TableRow hover key={_id} role="checkbox">
                            <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                            <TableCell>{keyword}</TableCell>
                            {/* <TableCell>{getKeywordFrequency(keywordCheckFrequency)}</TableCell> */}
                            <TableCell>{prevRankGroup || '-'}</TableCell>
                            <TableCell>{rankGroup || '-'}</TableCell>
                            <TableCell className={getDifference(prevRankGroup, rankGroup, 'GET_ClASS')}>
                              {difference?.toString()?.replace('-', '')}
                              {getDifference(prevRankGroup, rankGroup, 'GET_ICON')}
                            </TableCell>
                            <Tooltip
                              onClick={() => {
                                const win = window.open(url, '_blank')
                                win.focus()
                              }}
                              TransitionComponent={Zoom}
                              title={url || 'Not available'}
                              placement="top"
                            >
                              <TableCell className="urlEcllips">{url || '-'}</TableCell>
                            </Tooltip>
                          </TableRow>
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
