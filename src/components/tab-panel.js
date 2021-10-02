import {Box, Typography} from '@material-ui/core'

function TabPanel(props) {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        <Box sx={{pt: 3, pb: 2}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

export {TabPanel}
