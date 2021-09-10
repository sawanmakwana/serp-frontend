import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core'
import theme from 'theme'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'

function DeleteModal({deleteModal, setOpenLogout, did}) {
  console.log(did)
  const queryClient = useQueryClient()
  const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
  }))
  const classes = useStyles()

  const {mutate: deleteProject} = useMutation(
    mutateData => axios.deleteModal(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/deleteProject/${mutateData}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reposData')
      },
    }
  )

  const handleClose = () => {
    setOpenLogout(false)
  }

  return (
    <Dialog className="logout-modal" open={deleteModal} maxWidth="xs" fullWidth onClose={handleClose}>
      <DialogTitle className={classes.root}>Delete Modal</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to Delete?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{color: theme.palette.text.secondary}}>
          No
        </Button>
        <Button
          loading
          className="ml-2"
          loadingPosition="start"
          variant="contained"
          autoFocus
          onClick={deleteProject(did)}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {DeleteModal}
