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
              <Typography color="textPrimary" variant="h4">
                {analyticsDataFetching ? <CircularProgress style={{height: 19, width: 19}} /> : value}
              </Typography>
            </Grid>
            <Grid style={{padding: '0 11px 0 0'}}>
              <Avatar
                style={{
                  backgroundColor: color[600],
                  height: 42,
                  width: 42,
                }}
              >
                <InsertChartIcon style={{padding: 2}} />
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default AnalyticCard
