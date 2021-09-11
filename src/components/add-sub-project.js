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
import {currencies, keywordFrequency} from '../constants/constants'
import {SubProject} from '../validations/sub-project'

function AddSubProjectListModal({open, setOpen, domain}) {
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
    resolver: joiResolver(SubProject),
    defaultValues: {
      locationCode: '',
      keywordFrequency: '',
      keyword: '',
      domain: '',
    },
  })

  const queryClient = useQueryClient()

  const {isLoading, isError, error, isSuccess, mutate, ...rest} = useMutation(
    keywordData => axios.post(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/sendTask`, keywordData),
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
    console.log(submitdata)
    mutate({
      ...submitdata,
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
      onClose={() => setOpen(false)}
      open={open}
    >
      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">Add Sub Project</Typography>

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
            name="locationCode"
            render={({onChange, onBlur}) => (
              <TextField
                label="Select location code"
                select
                error={errors.locationCode}
                variant="outlined"
                onBlur={onBlur}
                disabled={isLoading}
                helperText={errors.locationCode && errors.locationCode.message}
              >
                {currencies.map(option => (
                  <MenuItem key={option.value} value={option.value} onClick={e => onChange(option.value)}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="keywordFrequency"
            render={({onChange, onBlur}) => (
              <TextField
                label="Select keywords checking frequency "
                select
                error={errors.keywordFrequency}
                variant="outlined"
                onBlur={onBlur}
                disabled={isLoading}
                helperText={errors.keywordFrequency && errors.keywordFrequency.message}
              >
                {keywordFrequency.map(option => (
                  <MenuItem key={option.value} value={option.value} onClick={e => onChange(option.value)}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="keyword"
            render={({onChange, value, onBlur}) => (
              <TextField
                label="Keyword"
                multiline
                disabled={isLoading}
                rows={5}
                margin="dense"
                fullWidth
                onBlur={onBlur}
                error={errors.keyword}
                variant="outlined"
                helperText={errors.keyword && errors.keyword.message}
                value={value}
                onChange={e => {
                  onChange(e.target.value)
                  console.log(e.target.value.split('\n'))
                }}
              />
            )}
          />
          <FormHelperText className="helperText">Note: Each keyword to new line</FormHelperText>

          <Controller
            control={control}
            name="domain"
            render={({value}) => <TextField variant="outlined" label="Domain" disabled value={domain[0].domain} />}
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
          {isLoading ? 'Loading...' : 'Add Keyword'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {AddSubProjectListModal}
