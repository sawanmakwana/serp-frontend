import React from 'react'
import {Box, Container, Grid} from '@material-ui/core'

import AnalyticCard from 'components/analytic-card'
import {green, indigo, orange, red} from '@material-ui/core/colors'

function Dashbord() {
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          pb: 3,
        }}
      >
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="Top 2" value="$24,000" color={red} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="Top 3" value="$24,000" color={green} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="Top 5" value="$24,000" color={orange} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="Top 10" value="$24,000" color={indigo} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="KEYWORD" value="$24,000" color={red} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="KEYWORD" value="$24,000" color={green} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="KEYWORD" value="$24,000" color={orange} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <AnalyticCard name="KEYWORD" value="$24,000" color={indigo} />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export {Dashbord}
