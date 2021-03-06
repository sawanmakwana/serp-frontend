import React, {useContext, useEffect, useState} from 'react'
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
  Checkbox,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
} from '@material-ui/core'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import AnalyticCard from 'components/analytic-card'
import {
  blue,
  blueGrey,
  green,
  indigo,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
} from '@material-ui/core/colors'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {useTheme} from '@material-ui/core/styles'
import {
  downloadResponseCSV,
  getCompoAccess,
  getDifference,
  getFormetedData,
  getLoaction,
  getKeywordFrequency,
} from 'util/app-utill'
import {ArrowBack, Delete} from '@material-ui/icons'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import {useClient} from 'useClient'
import {AddKeywordModal} from 'components/add-keyword-modal'
import {DeleteModal} from 'components/delete-modal'
import {GlobalContext} from 'context/global-context'
import {toast} from 'react-toastify'
import {TabPanel} from 'components/tab-panel'
import axios from 'axios'
import {getToken} from 'auth/auth-utils'
import {MoreVertical} from 'react-feather'
import {AddTag} from 'components/add-tag'
import {TagList} from './tag-list'

function KeywordList() {
  const history = useHistory()
  const theme = useTheme()
  const client = useClient()
  const {state} = useLocation()
  const queryClient = useQueryClient()
  const {permissionLevel} = useContext(GlobalContext)
  const {subProjectId: KeywordId, projectId} = useParams()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const getRows = JSON.parse(window.localStorage.getItem('keywordlistRow'))
  const getkeywordRowtocall = window.localStorage.getItem('keywordRowtocall')
  const [page, setPage] = useState(0)
  const [keyWordModal, setKeywordModal] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(getRows || 100)
  const [Sorting, setSorting] = useState('')
  const [keySortingtype, setkeySortingtype] = useState('asc')
  const [weekSortingtype, setweekSortingtype] = useState('asc')
  const [diffSortingtype, setdiffSortingtype] = useState('asc')
  const [urlSortingtype, setUrlSortingtype] = useState('asc')
  const [prwRank, setprwRank] = useState('asc')
  const [selected, setSelected] = useState([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [anchorE2, setAnchorE2] = useState(null)
  const open = Boolean(anchorE2)
  const getTabIndex = JSON.parse(window.localStorage.getItem('tabIndex'))
  const [value, setValue] = useState(getTabIndex || 0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [editId, setEditId] = useState(null)
  const [appTagModal, setAddTagModal] = useState(false)
  const [loc, setLoc] = useState(null)
  const [proName, setProName] = useState('')

  const smallScreen = useMediaQuery(theme.breakpoints.down('xs'))

  useEffect(() => {
    if (state?.rowtoCall) {
      window.localStorage.setItem('keywordRowtocall', state?.rowtoCall)
    }
  }, [state?.rowtoCall])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value))
    window.localStorage.setItem('keywordlistRow', event.target.value)
    setPage(0)
  }

  const {data, isFetching} = useQuery(
    ['keyWordList', page, rowsPerPage, Sorting, KeywordId],
    () => client(`getKeywords/${KeywordId}?limit=${rowsPerPage}&page=${page + 1}${Sorting}`),
    {keepPreviousData: true}
  )

  const {
    data: DdlistKeywordData,
    isFetching: DdlistKeywordisFetching,
    isLoading: DdlistKeywordisLoading,
  } = useQuery(['DdlistKeyword'], () =>
    client(`getSubProjectsList/${projectId}?limit=${state?.rowtoCall || getkeywordRowtocall || '20'}`)
  )

  const {data: csvData, isLoading: csvisLoading} = useQuery(
    ['csvProjectSublist', KeywordId],
    () =>
      axios.get(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/exportKeywordsToCsv/${KeywordId}`, {
        headers: {Authorization: `Bearer ${getToken()}`},
      }),
    {
      enabled: getCompoAccess[permissionLevel]?.headBtn,
    }
  )

  const {data: googlesheetData, isLoading: googlesheetisLoading} = useQuery(
    ['exportKeywordsToGoogleSheet', KeywordId],
    () => client(`exportKeywordsToGoogleSheet/${KeywordId}`),
    {
      enabled: getCompoAccess[permissionLevel]?.headBtn,
    }
  )

  const {
    mutate: deleteKeyword,
    isLoading: deleteIsloading,
    isFetching: singalkeydeleteKeywordlistIsFetching,
  } = useMutation(
    data =>
      client(`deleteKeywords`, {
        data,
        method: 'delete',
      }),
    {
      onSuccess: () => {
        setSelected([])
        setDeleteModal(false)
        queryClient.invalidateQueries('keyWordList')
        queryClient.invalidateQueries('DdlistKeyword')
        queryClient.invalidateQueries('exportKeywordsToCsv')
        queryClient.invalidateQueries('exportKeywordsToGoogleSheet')
        toast.success(`Keyword Deleted`)
      },
    }
  )

  const {data: keywordAnalytics, isFetching: analyticsKeywordisFetching} = useQuery(
    ['analyticskeywordDashboard', KeywordId],
    () => client(`/keywordDashboard/${KeywordId}`)
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
      name: 'Top Spot',
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
      name: 'Top 10',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.topTen,
      color: blue,
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
      name: 'Improved',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.improvedCount,
      color: lightGreen,
    },
    {
      name: 'Declined',
      analyticsDataFetching: analyticsKeywordisFetching,
      value: analyticsData?.declinedCount,
      color: blueGrey,
    },
  ]

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const isSelected = name => selected.indexOf(name) !== -1

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = data?.data?.result?.map(n => n._id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const {isLoading: removeTagLoading, mutate: removeTag} = useMutation(
    data =>
      client(`removeTag`, {
        data,
        method: 'post',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('keyWordList')
        queryClient.invalidateQueries('analyticskeywordDashboard')
        toast.success(`Tag Removed from Keyword`)
      },
    }
  )

  const {data: projectlistData} = useQuery(['DdListforName'], () => client(`getProjectsListDrpDwn`))

  useEffect(() => {
    if (DdlistKeywordData) {
      const loc = DdlistKeywordData?.data?.result?.filter(list => KeywordId === list._id)
      setLoc(loc[0]?.locationCode)
    }
  }, [DdlistKeywordData, KeywordId])

  useEffect(() => {
    if (projectlistData) {
      const proName = projectlistData?.data?.filter(list => projectId === list._id)
      setProName(proName[0]?.projectName)
    }
  }, [projectlistData, projectId])

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
          Keyword: {proName || ''} -{' '}
          {DdlistKeywordisFetching ? <CircularProgress style={{height: 17, width: 17}} /> : getLoaction(loc)}
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
            <MenuItem key={data._id} value={data._id} onClick={() => setLoc(data.locationCode)}>
              {proName} -{getLoaction(data.locationCode)}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        style={{marginTop: smallScreen && 12}}
        value={value}
        onChange={(e, newValue) => {
          setValue(newValue)
          window.localStorage.setItem('tabIndex', newValue)
        }}
      >
        <Tab label="Keyword List" />
        <Tab label="Keyword Tag" />
      </Tabs>
      <TabPanel value={value} index={0}>
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
          {getCompoAccess[permissionLevel]?.headBtn && (
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
                        downloadResponseCSV(csvData?.data, `keyword_list`)
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
              <Button className="ml-2" color="primary" variant="contained" onClick={() => setKeywordModal(true)}>
                Add Keyword
              </Button>
            </Box>
          )}
        </Box>
        <Paper>
          <Card>
            <Toolbar className="d-flex">
              {selected.length > 0 ? (
                <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
                  Selected Keyword <span>({selected.length})</span>
                </Typography>
              ) : (
                <Typography className="tableHeader next-rank" variant="h6" id="tableTitle" component="div">
                  <font>
                    Current page <span> ({page + 1})</span>
                  </font>
                  <span style={{display: 'flex', alignItems: 'center'}}>
                    <Tooltip title={`Next Check Date: ${getFormetedData(data?.data?.result[0]?.nextDate)}`}>
                      <span className="next-rank-data">
                        Next Check: {getFormetedData(data?.data?.result[0]?.nextDate)}
                      </span>
                    </Tooltip>
                    <FiberManualRecordIcon className="next-rank-data-svg" />
                    <Tooltip
                      title={`Keyword Frequency: ${getKeywordFrequency(data?.data?.result[0]?.keywordCheckFrequency)}`}
                    >
                      <span className="next-rank-data">
                        Keyword Frequency: {getKeywordFrequency(data?.data?.result[0]?.keywordCheckFrequency)}
                      </span>
                    </Tooltip>
                  </span>
                </Typography>
              )}
              {selected.length > 0 && getCompoAccess[permissionLevel]?.action && (
                <Tooltip title="Delete selected keyword" onClick={() => setDeleteModal(true)}>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
              {xsScreen && getCompoAccess[permissionLevel]?.headBtn && (
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
                        downloadResponseCSV(csvData?.data, `keyword_list`)
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
                      {getCompoAccess[permissionLevel]?.action && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < data?.data?.total}
                            checked={data?.data?.total > 0 && selected.length === data?.data?.total}
                            onChange={handleSelectAllClick}
                            inputProps={{
                              'aria-label': 'select all',
                            }}
                          />
                        </TableCell>
                      )}
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
                        <TableSortLabel
                          active={Sorting.includes('prevRankGroup')}
                          direction={prwRank === 'asc' ? 'desc' : 'asc'}
                          onClick={() => {
                            setprwRank(prwRank === 'asc' ? 'desc' : 'asc')
                            setSorting(`&sort=prevRankGroup:${prwRank}`)
                          }}
                        >
                          <div className="prev-rank-data">
                            Prev Rank
                            <Tooltip title={`Previous Date: ${getFormetedData(data?.data?.result[0]?.prevDate)}`}>
                              <span>{getFormetedData(data?.data?.result[0]?.prevDate)}</span>
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
                      {getCompoAccess[permissionLevel]?.action && <TableCell>Action</TableCell>}
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
                        ({_id, keyword, nextDate, prevRankGroup, rankGroup, url, difference, tags}, index) => {
                          const isItemSelected = isSelected(_id)
                          const labelId = `enhanced-table-checkbox-${index}`
                          return (
                            <TableRow
                              hover
                              key={_id}
                              onClick={event => handleClick(event, _id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              selected={isItemSelected}
                            >
                              {getCompoAccess[permissionLevel]?.action && (
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    color="primary"
                                    checked={isItemSelected}
                                    inputProps={{
                                      'aria-labelledby': labelId,
                                    }}
                                  />
                                </TableCell>
                              )}
                              <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                              <TableCell>
                                {keyword}{' '}
                                {permissionLevel === 1 || permissionLevel === 2
                                  ? tags.map(e => (
                                      <Chip
                                        className="ml-1"
                                        key={e._id}
                                        label={e.tagName}
                                        onClick={() =>
                                          history.push({
                                            pathname: `/project/tag-keyword/${e._id}`,
                                            state: {
                                              tagName: e.tagName,
                                            },
                                          })
                                        }
                                        onDelete={() =>
                                          removeTag({
                                            _tagId: e._id,
                                            _keywordId: _id,
                                          })
                                        }
                                      />
                                    ))
                                  : tags.map(e => (
                                      <Chip
                                        className="ml-1"
                                        key={e._id}
                                        onClick={() =>
                                          history.push({
                                            pathname: `/project/tag-keyword/${e._id}`,
                                            state: {
                                              tagName: e.tagName,
                                            },
                                          })
                                        }
                                        label={e.tagName}
                                      />
                                    ))}
                              </TableCell>
                              {/* <TableCell>{getKeywordFrequency(keywordCheckFrequency)}</TableCell> */}
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
                              {getCompoAccess[permissionLevel]?.action && (
                                <TableCell>
                                  <>
                                    <Button
                                      className="selectTablebtn"
                                      onClick={e => {
                                        setAnchorEl(e.currentTarget)
                                        setEditId(_id)
                                        e.stopPropagation()
                                      }}
                                    >
                                      <MoreVertical />
                                    </Button>
                                    <Menu
                                      anchorEl={anchorEl}
                                      keepMounted
                                      open={anchorEl}
                                      onClose={e => {
                                        setAnchorEl(null)
                                        setEditId(null)
                                        e.stopPropagation()
                                      }}
                                      PaperProps={{
                                        style: {
                                          maxHeight: 220,
                                          width: 120,
                                        },
                                      }}
                                    >
                                      <MenuItem
                                        onClick={e => {
                                          e.stopPropagation()
                                          setAddTagModal(true)
                                          setAnchorEl(null)
                                        }}
                                      >
                                        Add tag
                                      </MenuItem>
                                    </Menu>
                                  </>
                                </TableCell>
                              )}
                              {/* <Tooltip
                            TransitionComponent={Zoom}
                            title={getStatus(error, errorMessage, newInserted, 'GET_TOOLTIP')}
                            placement="top"
                          >
                            <TableCell>{getStatus(error, errorMessage, newInserted, 'GET_VALUE')}</TableCell>
                          </Tooltip> */}
                            </TableRow>
                          )
                        }
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {(isFetching || DdlistKeywordisFetching || singalkeydeleteKeywordlistIsFetching || removeTagLoading) && (
                <LinearProgress />
              )}
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
          {appTagModal && (
            <AddTag
              open1={appTagModal}
              setOpen1={setAddTagModal}
              editId={editId}
              KeywordId={KeywordId}
              onClose={() => {
                setAddTagModal(false)
                setEditId(null)
              }}
            />
          )}
          {keyWordModal && (
            <AddKeywordModal open={keyWordModal} setOpen={setKeywordModal} KeywordId={KeywordId} editId={KeywordId} />
          )}
          {deleteModal && (
            <DeleteModal
              deleteProject={() => deleteKeyword({_id: selected})}
              deleteModal={deleteModal}
              deleteIsloading={deleteIsloading}
              modalFrom="Keyword"
              onClose={() => {
                setDeleteModal(false)
                setSelected([])
              }}
            />
          )}
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TagList />
      </TabPanel>
    </>
  )
}

export {KeywordList}
