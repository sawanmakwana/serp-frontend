import React, {useContext} from 'react'
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
  Button,
} from '@material-ui/core'
import {getCompoAccess} from 'util/app-utill'
import {Trash2} from 'react-feather'
import {GlobalContext} from 'context/global-context'
import Chart from 'react-apexcharts'

function TagList() {
  const {permissionLevel} = useContext(GlobalContext)

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  }

  return (
    <>
      <Chart options={chartData.options} series={chartData.series} type="line" width="100%" height="320px" />
      <Box sx={{mt: 2}} className="d-flex pb-3 pt-2">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Tag <span> (12)</span>
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
                    <TableCell className="pl-4">#</TableCell>
                    <TableCell sortDirection={false}>
                      <TableSortLabel
                      // active={Sorting.includes('keyword')}
                      // direction={keySortingtype === 'asc' ? 'desc' : 'asc'}
                      // onClick={() => {
                      //   setkeySortingtype(keySortingtype === 'asc' ? 'desc' : 'asc')
                      //   setSorting(`&sort=keyword:${keySortingtype}`)
                      // }}
                      >
                        Keyword
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                      // active={Sorting.includes('keywordCheckFrequency')}
                      // direction={frequencytype === 'asc' ? 'desc' : 'asc'}
                      // onClick={() => {
                      //   setFrequencySortingtype(frequencytype === 'asc' ? 'desc' : 'asc')
                      //   setSorting(`&sort=keywordCheckFrequency:${frequencytype}`)
                      // }}
                      >
                        Frequency
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                      // active={Sorting.includes('prevDate')}
                      // direction={prevdatetype === 'asc' ? 'desc' : 'asc'}
                      // onClick={() => {
                      //   setPrevDatetype(prevdatetype === 'asc' ? 'desc' : 'asc')
                      //   setSorting(`&sort=prevDate:${prevdatetype}`)
                      // }}
                      >
                        Prev Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                      // active={Sorting.includes('nextDate')}
                      // direction={nextdatetype === 'asc' ? 'desc' : 'asc'}
                      // onClick={() => {
                      //   setNedxtDatetype(nextdatetype === 'asc' ? 'desc' : 'asc')
                      //   setSorting(`&sort=nextDate:${nextdatetype}`)
                      // }}
                      >
                        Next Date
                      </TableSortLabel>
                    </TableCell>
                    {getCompoAccess[permissionLevel]?.action && <TableCell>Action</TableCell>}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* {data?.data?.result?.length === 0 ? (
                    <TableRow hover>
                      <TableCell className="emptyTable" colSpan="11">
                        No Sub Project Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.result?.map(
                      ({_id, locationCode, keywordCheckFrequency, prevDate, nextDate, newInserted}, index) => ( */}
                  <TableRow
                    hover
                    // key={_id}
                    // onClick={() =>
                    //   history.push({
                    //     pathname: `/project/${DomainId}/keyword/${_id}`,
                    //     state: {
                    //       keywordName: domain && domain[0] && domain[0]?.projectName,
                    //       keywordlocation: getLoaction(locationCode),
                    //       rowtoCall: data?.data?.total,
                    //     },
                    //   })
                    // }
                  >
                    <TableCell className="pl-4">12</TableCell>

                    <TableCell>asd</TableCell>

                    {getCompoAccess[permissionLevel]?.action && (
                      <TableCell>
                        <Button
                          className="selectTablebtn"
                          // onClick={e => {
                          //   setAnchorEl(e.currentTarget)
                          //   setEditId(_id)
                          //   e.stopPropagation()
                          // }}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                  {/* ) ) )} */}
                </TableBody>
              </Table>
            </TableContainer>
            {/* {(isFetching || projectlistIsFetching || singalProjectlistIsFetching) && <LinearProgress />} */}
            <TablePagination
              rowsPerPageOptions={[50, 100, 200, 500, 1000, 2000]}
              component="div"
              // count={data?.data?.total}
              // page={page}
              // onPageChange={handleChangePage}
              // rowsPerPage={rowsPerPage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      </Paper>
    </>
  )
}

export {TagList}
