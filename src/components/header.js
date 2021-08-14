import React, {useState} from 'react'
import {AppBar, Button, Toolbar, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
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

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            SERP (Search Engine Results Page)
          </Typography>
          <Button startIcon={<AddIcon />} color="inherit" onClick={() => setOpen(true)}>
            Add Keyword
          </Button>
        </Toolbar>
      </AppBar>
      {open && <AddModal open={open} setOpen={setOpen} />}
    </div>
  )
}

export {Header}
