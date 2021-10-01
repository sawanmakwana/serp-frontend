/* eslint-disable no-unused-vars */
import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  LinearProgress,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import {makeStyles, useTheme} from '@material-ui/styles'
import {useForm, Controller} from 'react-hook-form'
import {joiResolver} from '@hookform/resolvers'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import axios from 'axios'
import {useClient} from 'useClient'
import {currencies} from '../constants/constants'
import {ProjectList} from '../validations/project'

function ChangePass({open, setOpen, editId, setEditId, data}) {
  const useStyles = makeStyles(theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: '#fff',
    },
  }))
  const useStylesForm = makeStyles(theme => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: 'calc(100% - 18px)',
      },
    },
  }))
  const client = useClient()
  const classes = useStyles()
  const classesFrom = useStylesForm()

  const {handleSubmit, errors, control, reset} = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    // resolver: joiResolver(ProjectList),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const queryClient = useQueryClient()

  const {isLoading, isError, error, isSuccess, mutate} = useMutation(
    data =>
      client(`changePassword`, {
        data,
        method: 'post',
      }),

    {
      onSuccess: () => {
        queryClient.invalidateQueries('reposData')
        // queryClient.invalidateQueries('csvProjectlist')
        // queryClient.invalidateQueries('exportProjectToGoogleSheet')
        setOpen(false)
      },
    }
  )

  const submitForm = submitdata => mutate(submitdata)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      className="keyword-modal"
      disableBackdropClick
      disableEscapeKeyDown
      onClose={() => setOpen(false)}
      open={open}
    >
      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">Change Password</Typography>
        <IconButton
          style={{display: isLoading ? 'none' : ''}}
          className={classes.closeButton}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent dividers>
        <form className={classesFrom.root}>
          <Controller
            control={control}
            name="currentPassword"
            render={({onChange, value, onBlur}) => (
              <TextField
                label="Enter Current Password"
                required
                disabled={isLoading}
                onBlur={onBlur}
                error={errors.currentPassword}
                variant="outlined"
                helperText={errors.currentPassword && errors.currentPassword.message}
                value={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            render={({onChange, value, onBlur}) => (
              <TextField
                variant="outlined"
                label="Enter New Password"
                required
                disabled={isLoading}
                onBlur={onBlur}
                value={value}
                error={errors.newPassword}
                helperText={errors.newPassword && errors.newPassword.message}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({onChange, value, onBlur}) => (
              <TextField
                variant="outlined"
                label="Enter Confirm Password"
                required
                disabled={isLoading}
                onBlur={onBlur}
                value={value}
                error={errors.confirmPassword}
                helperText={errors.confirmPassword && errors.confirmPassword.message}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />
        </form>
      </DialogContent>
      {isLoading && <LinearProgress />}
      <DialogActions>
        <Button
          style={{
            display: isLoading ? 'none' : '',
            color: theme.palette.text.secondary,
          }}
          onClick={() => {
            setOpen(false)
          }}
        >
          Cancel
        </Button>
        <Button
          loading
          className="ml-2"
          loadingPosition="start"
          variant="contained"
          autoFocus
          onClick={handleSubmit(submitForm)}
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Changes Password'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {ChangePass}
