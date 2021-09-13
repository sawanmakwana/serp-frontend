import React from 'react'
import {Box, Grid, Typography} from '@material-ui/core'
import AnalyticCard from 'components/analytic-card'
import {green, indigo, orange, red, teal} from '@material-ui/core/colors'
import axios from 'axios'
import {useQuery} from 'react-query'

async function fetchApi() {
  const fetchURL = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/projectDashboard`
  const {data} = await axios.get(fetchURL)
  return data
}

function Dashbord() {
  const {data, isFetching} = useQuery(['analyticsDashboard'], () => fetchApi())
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
          <AnalyticCard
            name="Total Keywords"
            analyticsDataFetching={isFetching}
            value={analyticsData?.totalKeywords}
            color={red}
          />
          <AnalyticCard
            name="Top Spot"
            analyticsDataFetching={isFetching}
            value={analyticsData?.topSpot}
            color={green}
          />
          <AnalyticCard
            name="Top Ten"
            analyticsDataFetching={isFetching}
            value={analyticsData?.topTen}
            color={orange}
          />
          <AnalyticCard
            name="Top Thirty"
            analyticsDataFetching={isFetching}
            value={analyticsData?.topThirty}
            color={indigo}
          />
          <AnalyticCard
            name="Top Hundred"
            analyticsDataFetching={isFetching}
            value={analyticsData?.topHundred}
            color={teal}
          />
        </Grid>
      </Box>
    </>
  )
}

export {Dashbord}
