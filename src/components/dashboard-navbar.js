import {AppBar, Box, Hidden, IconButton, Toolbar, Typography} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import PropTypes from 'prop-types'

const DashboardNavbar = ({onMobileNavOpen}) => {
  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Typography variant="h5">SERP</Typography>
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
