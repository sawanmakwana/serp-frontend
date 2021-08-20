import React, {useState} from 'react'
import {AppBar, Button, IconButton, Toolbar, Tooltip, Typography, useMediaQuery, Zoom} from '@material-ui/core'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import {useAuth} from 'context/auth-context'
import {AccountCircle} from '@material-ui/icons'
import {AddModal} from './add-modal'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}))
function Header() {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const {logout} = useAuth()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            SERP {!xsScreen && `(Search Engine Results Page)`}
          </Typography>
          <Button startIcon={<AddIcon />} color="inherit" onClick={() => setOpen(true)}>
            Add Keyword
          </Button>
          <Tooltip TransitionComponent={Zoom} title="Logout">
            <IconButton
              className="ml-2"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={logout}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {open && <AddModal open={open} setOpen={setOpen} />}
    </div>
  )
}

export {Header}
