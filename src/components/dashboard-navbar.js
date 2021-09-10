import {AppBar, Box, Hidden, IconButton, Toolbar, Typography, Button, useMediaQuery} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add'
import {useTheme} from '@material-ui/core/styles'
import {useState} from 'react'
import {useLocation} from 'react-router-dom'
import {AddModal} from './add-modal'
import {Logout} from './logout-modal'

const DashboardNavbar = ({onMobileNavOpen}) => {
  const {pathname} = useLocation()
  const [open, setOpen] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <AppBar elevation={0}>
      <Toolbar>
        <Typography variant="h5">SERP {!xsScreen && `(Search Engine Results Page)`}</Typography>
        <Box sx={{flexGrow: 1}} />
        {pathname === '/project' && (
          <Button startIcon={<AddIcon />} color="inherit" onClick={() => setOpen(true)}>
            Add Keyword
          </Button>
        )}

        <Hidden lgUp>
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
