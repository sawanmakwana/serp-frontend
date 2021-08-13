/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
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
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import {useForm, Controller} from 'react-hook-form'
import {joiResolver} from '@hookform/resolvers'
import {QueryClient, useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import {currencies} from '../constants/constants'
import {addKeyword} from '../validations/add-keyword'

function AddModal({open, setOpen}) {
  const useStyles = makeStyles(theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
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
        width: '50ch',
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
    resolver: joiResolver(addKeyword),
    defaultValues: {
      locationCode: '',
      keyword: '',
      domain: '',
    },
  })

  const queryClient = useQueryClient()

  const {isLoading, isError, error, isSuccess, mutate} = useMutation(
    keywordData => axios.post('http://localhost:3000/api/v1/serp/sendTask', keywordData),
    {
      onSuccess: () => {
        setOpen(false)
        console.log('Keyword added')
        queryClient.invalidateQueries('reposData')
      },
    }
  )

  // console.log(`isLoading ${isLoading}`)
  // console.log(`isError ${isError}`)
  // console.log(`error ${error}`)
  // console.log(`isSuccess ${isSuccess}`)

  const submitForm = submitdata => {
    mutate(submitdata)
    console.log(submitdata)
  }
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Dialog
      disableBackdropClick
      fullScreen={fullScreen}
      disableEscapeKeyDown
      className="keyword-modal"
      onClose={() => setOpen(false)}
      open={open}
    >
      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">Keyword for domain</Typography>
        <IconButton className={classes.closeButton} onClick={() => setOpen(false)}>
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
                label={!errors.locationCode ? 'Select locationCode' : 'Error'}
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
            name="keyword"
            render={({onChange, value, onBlur}) => (
              <TextField
                label={!errors.keyword ? 'Keyword' : 'Error'}
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
                onChange={e => onChange(e.target.value)}
              />
            )}
          />
          <FormHelperText className="helperText">Note: Each keyword to new line</FormHelperText>

          <Controller
            control={control}
            name="domain"
            render={({onChange, value, onBlur}) => (
              <TextField
                variant="outlined"
                label={!errors.domain ? 'Enter domain' : 'Error'}
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
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
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

export {AddModal}
