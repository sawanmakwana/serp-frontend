import {Avatar, Card, CardContent, Grid, Typography} from '@material-ui/core'
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined'

function AnalyticCard({name, value, color}) {
  return (
    <Card style={{height: '100%'}}>
      <CardContent>
        <Grid container spacing={3} style={{justifyContent: 'space-between'}}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {name}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {value}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              style={{
                backgroundColor: color[600],
                height: 56,
                width: 56,
              }}
            >
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticCard
