import React from 'react'
import {Box, Grid, Typography} from '@material-ui/core'
import AnalyticCard from 'components/analytic-card'
import {green, indigo, orange, red} from '@material-ui/core/colors'
import axios from 'axios'
import {useQuery} from 'react-query'

async function fetchApi() {
  const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/projectDashboard`
  const {data} = await axios.get(fetchURL)
  return data
}

function Dashbord() {
  const {isLoading, error, data, isFetching} = useQuery(['analyticsDashboard'], () => fetchApi())
  const analyticsData = data?.data

  return (
    <>
      <Box>
        <Typography className="tableHeader" variant="h6" id="tableTitle" component="div">
          Analytics of All Projects
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard
              name="Total Keywords"
              value={analyticsData ? analyticsData?.totalKeywords : '-'}
              color={red}
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="Top Spot" value={analyticsData ? analyticsData?.topSpot : '-'} color={green} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="Top Ten" value={analyticsData ? analyticsData?.topTen : '-'} color={orange} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="Top Thirty" value={analyticsData ? analyticsData?.topThirty : '-'} color={indigo} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="Top Hundred" value={analyticsData ? analyticsData?.topHundred : '-'} color={red} />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export {Dashbord}
