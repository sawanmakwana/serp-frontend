import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  LinearProgress,
  makeStyles,
  Typography,
  useMediaQuery,
} from '@material-ui/core'
import theme from 'theme'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import {getFormetedData} from 'util/app-utill'
import {useQuery} from 'react-query'
import {useClient} from 'useClient'
import Chart from 'react-apexcharts'

function KeywordGraph({open, onClose, keywordId, keywordName}) {
  const useStyles = makeStyles(theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: '#fff',
    },
  }))
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const client = useClient()

  const {data: GraphData = [], isLoading} = useQuery(['keywordGraph', keywordId], () =>
    client(`keywordGraph/${keywordId}`)
  )

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar',
      },

      xaxis: {
        categories: GraphData?.data?.map(GD => getFormetedData(GD.date)),
      },
      yaxis: {reversed: true},
    },

    series: [
      {
        name: keywordName || 'Keyword',
        data: GraphData?.data?.map(Gd => Gd?.rank || {}),
      },
    ],
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      className="keyword-modal"
      disableBackdropClick
      disableEscapeKeyDown
      onClose={onClose}
      open={open}
    >
      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">{keywordName || 'Keyword'} Graph</Typography>
        <IconButton style={{display: isLoading ? 'none' : ''}} className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent dividers>
        <Box>
          <Chart options={chartData.options} series={chartData.series} type="line" width="100%" height="320px" />
        </Box>
      </DialogContent>
      {isLoading && <LinearProgress />}
      <DialogActions>
        <Button
          style={{
            display: isLoading ? 'none' : '',
            color: theme.palette.text.secondary,
          }}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {KeywordGraph}
