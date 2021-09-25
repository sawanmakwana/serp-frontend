import {Avatar, Card, CardContent, CircularProgress, Grid, Typography} from '@material-ui/core'
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined'

function AnalyticCard({name, value, color, analyticsDataFetching}) {
  return (
    <Grid item lg={3} sm={6} xl={3} xs={12}>
      <Card style={{height: '100%'}}>
        <CardContent style={{paddingBottom: 18}}>
          <Grid container spacing={3} style={{justifyContent: 'space-between', alignItems: 'center'}}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="h6">
                {name}
              </Typography>
              <Typography color="textPrimary" variant="h3">
                {analyticsDataFetching ? <CircularProgress style={{height: 23, width: 23}} /> : value}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar
                style={{
                  backgroundColor: color[600],
                  height: 46,
                  width: 46,
                }}
              >
                <InsertChartIcon />
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default AnalyticCard
