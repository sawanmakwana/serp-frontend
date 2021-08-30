import {AppBar, Box, Hidden, IconButton, Toolbar, Typography, Button, Tooltip, Zoom} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import {useState} from 'react'
import {AddModal} from './add-modal'
import {Logout} from './logout-modal'

const DashboardNavbar = ({onMobileNavOpen}) => {
  const [open, setOpen] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)

  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Typography variant="h6"> SERP </Typography>
        <Box sx={{flexGrow: 1}} />
        <Button startIcon={<AddIcon />} color="inherit" onClick={() => setOpen(true)}>
          Add Keyword
        </Button>
        <Hidden lgDown>
          <Tooltip TransitionComponent={Zoom} title="Logout">
            <IconButton
              className="ml-2"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setOpenLogout(true)}
              color="inherit"
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
        <Hidden lgUp>
          <Tooltip TransitionComponent={Zoom} title="Logout">
            <IconButton
              className="ml-2"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setOpenLogout(true)}
              color="inherit"
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
      {open && <AddModal open={open} setOpen={setOpen} />}
      {openLogout && <Logout openLogout={openLogout} setOpenLogout={setOpenLogout} />}
    </AppBar>
  )
}

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
}

export default DashboardNavbar
