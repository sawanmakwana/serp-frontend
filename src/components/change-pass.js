import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
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
import {useMutation} from 'react-query'
import {getToken} from 'auth/auth-utils'
import axios from 'axios'
import {changePassword} from '../validations/user'

function ChangePass({open, setOpen}) {
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
  const classes = useStyles()
  const classesFrom = useStylesForm()

  const {handleSubmit, errors, control} = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    resolver: joiResolver(changePassword),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // const {isLoading, isError, error, isSuccess, mutate} = useMutation(
  //   data =>
  //     client(`changePassword`, {
  //       data,
  //       method: 'post',
  //     }),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries('reposData')
  //       setOpen(false)
  //     },
  //     onError: () => {
  //       console.log('Error')
  //     },
  //   }
  // )

  const {isLoading, mutate} = useMutation(data =>
    axios.post(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/changePassword`, data, {
      headers: {Authorization: `Bearer ${getToken()}`},
    })
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
