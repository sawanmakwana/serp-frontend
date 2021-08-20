import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
import {useAuth} from 'context/auth-context'

function Logout({openLogout, setOpenLogout}) {
  const {logout} = useAuth()

  const handleClose = () => {
    setOpenLogout(false)
  }

  return (
    <Dialog open={openLogout} maxWidth="xs" fullWidth onClose={handleClose}>
      <DialogTitle>Logout From SERP</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to logout?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button
          loading
          className="ml-2"
          loadingPosition="start"
          variant="contained"
          autoFocus
          onClick={logout}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {Logout}
