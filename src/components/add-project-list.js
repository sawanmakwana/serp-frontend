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
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import {currencies} from '../constants/constants'
import {ProjectList} from '../validations/project'

function AddProjectListModal({open, setOpen}) {
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
    resolver: joiResolver(ProjectList),
    defaultValues: {
      projectName: '',
      domain: '',
    },
  })

  const queryClient = useQueryClient()

  const {isLoading, isError, error, isSuccess, mutate, ...rest} = useMutation(
    keywordData => axios.post(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/addProject`, keywordData),
    {
      onSuccess: () => {
        setOpen(false)
        queryClient.invalidateQueries('reposData')
      },
      onSettled: () => {
        queryClient.invalidateQueries('reposData')
      },
    }
  )

  const submitForm = submitdata => {
    mutate({...submitdata, domain: submitdata.domain.replace('http://', '').replace('https://', '')})
  }

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
        <Typography variant="h6">Add Project</Typography>

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
            name="projectName"
            render={({onChange, value, onBlur}) => (
              <TextField
                label="projectName"
                disabled={isLoading}
                onBlur={onBlur}
                error={errors.projectName}
                variant="outlined"
                helperText={errors.projectName && errors.projectName.message}
                value={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="domain"
            render={({onChange, value, onBlur}) => (
              <TextField
                variant="outlined"
                label="Enter domain"
                disabled={isLoading}
                onBlur={onBlur}
                value={value}
                error={errors.domain}
                helperText={errors.domain && errors.domain.message}
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
          onClick={() => setOpen(false)}
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
          {isLoading ? 'Loading...' : 'Add Project'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {AddProjectListModal}
