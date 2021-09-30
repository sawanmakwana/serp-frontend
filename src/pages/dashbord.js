import React from 'react'
import {Box, Grid, Typography} from '@material-ui/core'
import AnalyticCard from 'components/analytic-card'
import {blueGrey, green, indigo, lightGreen, orange, red, teal} from '@material-ui/core/colors'
import {useQuery} from 'react-query'
import {useClient} from 'useClient'

function Dashbord() {
  const client = useClient()
  const {data, isFetching} = useQuery(['analyticsDashboard'], () => client(`projectDashboard`))
  const analyticsData = data?.data

  const analyticCardList = [
    {
      name: 'Total Keywords',
      analyticsDataFetching: isFetching,
      value: analyticsData?.totalKeywords,
      color: red,
    },
    {
      name: 'Top 1',
      analyticsDataFetching: isFetching,
      value: analyticsData?.topSpot,
      color: green,
    },
    {
      name: 'Top 10',
      analyticsDataFetching: isFetching,
      value: analyticsData?.topTen,
      color: orange,
    },
    {
      name: 'Top 30',
      analyticsDataFetching: isFetching,
      value: analyticsData?.topThirty,
      color: indigo,
    },
    {
      name: 'Top 100',
      analyticsDataFetching: isFetching,
      value: analyticsData?.topHundred,
      color: teal,
    },
    {
      name: 'Improved Count',
      analyticsDataFetching: isFetching,
      value: analyticsData?.improvedCount,
      color: lightGreen,
    },
    {
      name: 'Declined Count',
      analyticsDataFetching: isFetching,
      value: analyticsData?.declinedCount,
      color: blueGrey,
    },
  ]

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
      </Box>
    </>
  )
}

export {Dashbord}
