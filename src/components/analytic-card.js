import {Avatar, Box, Card, CardContent, Grid, Typography} from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined'
import {red} from '@material-ui/core/colors'

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
        <Box
          sx={{
            pt: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowDownwardIcon style={{color: red[900]}} />
          <Typography
            style={{
              color: red[900],
              marginRight: 8,
            }}
            variant="body2"
          >
            12%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticCard
