import {AppBar, Box, Hidden, IconButton, Toolbar, Typography} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import InputIcon from '@material-ui/icons/Input'
import PropTypes from 'prop-types'

const DashboardNavbar = ({onMobileNavOpen}) => {
  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Typography variant="h6">SERP (Search Engine Results Page)</Typography>
        <Box sx={{flexGrow: 1}} />
        <Hidden lgDown>
          <IconButton color="inherit">
            <InputIcon />
          </IconButton>
        </Hidden>
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
