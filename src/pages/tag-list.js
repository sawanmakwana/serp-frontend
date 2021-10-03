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
  Button,
  LinearProgress,
} from '@material-ui/core'
import {getCompoAccess} from 'util/app-utill'
import {Trash2} from 'react-feather'
import {GlobalContext} from 'context/global-context'
import Chart from 'react-apexcharts'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useClient} from 'useClient'
import {useParams, useHistory} from 'react-router-dom'
import {DeleteModal} from 'components/delete-modal'

function TagList() {
  const client = useClient()
  const {projectId} = useParams()
  const queryClient = useQueryClient()
  const {permissionLevel} = useContext(GlobalContext)
  const getRows = JSON.parse(window.localStorage.getItem('taglistRow'))
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 5)
  const [page, setPage] = useState(0)
  const [editId, setEditId] = useState(null)
  const [Sorting, setSorting] = useState('')
  const [tagNametype, setSetTagNametype] = useState('asc')
  const [deleteModal, setDeleteModal] = useState(false)
  const history = useHistory()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('taglistRow', event.target.value)
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
    ['tagList', page, rowsPerPage, Sorting, projectId],
    () => client(`tagList/${projectId}?limit=${rowsPerPage}page=${page + 1}${Sorting}`),
    {
      keepPreviousData: true,
    }
  )

  const {mutate: deleteProject, isLoading: deleteIsloading} = useMutation(
    mutateData =>
      client(`deleteTag/${mutateData}`, {
        mutateData,
        method: 'delete',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tagList')
        setDeleteModal(false)
        setEditId(null)
      },
    }
  )

  console.log(data?.data?.result)

  return (
    <>
      <Chart options={chartData.options} series={chartData.series} type="line" width="100%" height="320px" />
      <Box sx={{mt: 2}} className="d-flex pb-3 pt-2">
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Tag <span>({data?.data?.total})</span>
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
                    <TableCell className="pl-4">#</TableCell>
                    <TableCell sortDirection={false}>
                      <TableSortLabel
                        active={Sorting.includes('tagName')}
                        direction={tagNametype === 'asc' ? 'desc' : 'asc'}
                        onClick={() => {
                          setSetTagNametype(tagNametype === 'asc' ? 'desc' : 'asc')
                          setSorting(`&sort=tagName:${tagNametype}`)
                        }}
                      >
                        Tag list
                      </TableSortLabel>
                    </TableCell>

                    {getCompoAccess[permissionLevel]?.action && <TableCell>Action</TableCell>}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.data?.result?.length === 0 ? (
                    <TableRow hover>
                      <TableCell className="emptyTable" colSpan="11">
                        No Tag Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.result?.map(({_id, tagName}, index) => (
                      <TableRow
                        hover
                        key={_id}
                        onClick={() =>
                          history.push({
                            pathname: `/tag-keyword/${_id}`,
                            // state: {
                            //   keywordName: domain && domain[0] && domain[0]?.projectName,
                            //   keywordlocation: getLoaction(locationCode),
                            //   rowtoCall: data?.data?.total,
                            // },
                          })
                        }
                      >
                        <TableCell className="pl-4">{index + 1 + page * rowsPerPage}</TableCell>
                        <TableCell>{tagName}</TableCell>
                        {getCompoAccess[permissionLevel]?.action && (
                          <TableCell>
                            <Button
                              className="selectTablebtn"
                              onClick={e => {
                                setDeleteModal(true)
                                setEditId(_id)
                                e.stopPropagation()
                              }}
                            >
                              <Trash2 />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
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
        {deleteModal && (
          <DeleteModal
            deleteProject={() => deleteProject(editId)}
            deleteModal={deleteModal}
            deleteIsloading={deleteIsloading}
            modalFrom="Tag"
            onClose={() => {
              setDeleteModal(false)
              setEditId(null)
            }}
          />
        )}
      </Paper>
    </>
  )
}

export {TagList}
