import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  makeStyles,
} from '@material-ui/core'
import theme from 'theme'

function DeleteModal({deleteModal, onClose, deleteProject, deleteIsloading}) {
  const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
  }))
  const classes = useStyles()

  return (
    <Dialog className="logout-modal" open={deleteModal} maxWidth="xs" fullWidth onClose={onClose}>
      <DialogTitle className={classes.root}>Delete Modal</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to Delete?</DialogContentText>
      </DialogContent>
      {deleteIsloading && <LinearProgress />}
      <DialogActions>
        <Button onClick={onClose} style={{color: theme.palette.text.secondary}}>
          No
        </Button>
        <Button
          loading={deleteIsloading}
          disabled={deleteIsloading}
          className="ml-2"
          variant="contained"
          autoFocus
          onClick={deleteProject}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {DeleteModal}
