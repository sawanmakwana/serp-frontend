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
import {currencies} from '../constants/constants'
import {ProjectList} from '../validations/project'

function AddProjectListModal({open, setOpen, editId, setEditId, data}) {
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

  const {handleSubmit, errors, control, reset} = useForm({
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
    mutatedData =>
      !editId
        ? axios.post(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/addProject`, mutatedData)
        : axios.put(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/editProject/${editId}`, mutatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reposData')
        queryClient.invalidateQueries('csvProjectlist')
        queryClient.invalidateQueries('exportProjectToGoogleSheet')
        setOpen(false)
        setEditId(null)
      },
    }
  )

  React.useEffect(() => {
    if (editId) {
      const Edata = data.data.result?.filter(list => editId === list._id)
      const {domain, projectName} = Edata[0]
      reset({
        domain,
        projectName,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, reset])

  const submitForm = submitdata => {
    mutate({
      ...submitdata,
      domain: submitdata.domain.replace('http://', '').replace('https://', ''),
    })
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
      onClose={() => {
        setOpen(false)
        setEditId(null)
      }}
      open={open}
    >
      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">{editId ? 'Update Project' : 'Add Project'}</Typography>
        <IconButton
          style={{display: isLoading ? 'none' : ''}}
          className={classes.closeButton}
          onClick={() => {
            setOpen(false)
            setEditId(null)
          }}
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
                label="Project name"
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
                disabled={isLoading || editId}
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
          onClick={() => {
            setOpen(false)
            setEditId(null)
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
          {isLoading ? 'Loading...' : `${editId ? 'Update Project' : 'Add Project'}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {AddProjectListModal}
