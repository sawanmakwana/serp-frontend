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
import {getCompoAccess, getFormetedData} from 'util/app-utill'
import {Trash2} from 'react-feather'
import {GlobalContext} from 'context/global-context'
import Chart from 'react-apexcharts'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useClient} from 'useClient'
import {useParams, useHistory} from 'react-router-dom'
import {DeleteModal} from 'components/delete-modal'
import {toast} from 'react-toastify'

function TagList() {
  const client = useClient()
  const {subProjectId} = useParams()
  const queryClient = useQueryClient()
  const {permissionLevel} = useContext(GlobalContext)
  const getRows = JSON.parse(window.localStorage.getItem('taglistRow'))
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 100)
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

  const {data: GraphData = []} = useQuery(['allTagsCombineGraph', subProjectId], () =>
    client(`allTagsCombineGraph/${subProjectId}`)
  )

  const maxNum = Math?.max?.apply(
    null,
    GraphData?.data?.map(Gd => Gd?.keywords?.length)
  )

  const indexMaxData = GraphData?.data?.map(Gd => Gd?.keywords?.length).findIndex(t => t === maxNum)

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: GraphData?.data?.map(Gd => Gd?.keywords?.map(fd => getFormetedData(fd?.date)))[indexMaxData] || [],
      },
      yaxis: {reversed: true},
    },

    series:
      GraphData?.data?.map(Gd => {
        return {
          name: Gd?.tagName,
          data: Gd?.keywords?.map(fd => fd?.rank),
        }
      }) || [],
  }

  const {data, isFetching} = useQuery(
    ['tagList', page, rowsPerPage, Sorting, subProjectId],
    () => client(`tagList/${subProjectId}?limit=${rowsPerPage}page=${page + 1}${Sorting}`),
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
        toast.success(`Tag Deleted`)
      },
    }
  )

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
                            pathname: `/project/tag-keyword/${_id}`,
                            state: {
                              tagName,
                            },
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
