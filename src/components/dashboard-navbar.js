import {AppBar, Box, Hidden, IconButton, Toolbar, Typography, useMediaQuery} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import PropTypes from 'prop-types'
import {useTheme} from '@material-ui/core/styles'

const DashboardNavbar = ({onMobileNavOpen}) => {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Typography variant="h5">SERP {!xsScreen && `(Search Engine Results Page)`}</Typography>
        <Box sx={{flexGrow: 1}} />
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
}

export default DashboardNavbar
