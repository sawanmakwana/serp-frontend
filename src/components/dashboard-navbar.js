import {AppBar, Box, Hidden, IconButton, Toolbar, Typography, Button, useMediaQuery} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add'
import {useTheme} from '@material-ui/core/styles'
import {useState} from 'react'
import {useLocation} from 'react-router-dom'
import {AddProjectListModal} from './add-project-list'

const DashboardNavbar = ({onMobileNavOpen}) => {
  const {pathname} = useLocation()
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Typography variant="h5">SERP {!xsScreen && `(Search Engine Results Page)`}</Typography>
        <Box sx={{flexGrow: 1}} />
        {/* {pathname === '/project' && (
          <Button startIcon={<AddIcon />} color="inherit" onClick={() => setOpen(true)}>
            Add Project
          </Button>
        )} */}

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
