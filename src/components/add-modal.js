/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React, {useState} from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  LinearProgress,
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
    resolver: joiResolver(addKeyword),
    defaultValues: {
      locationCode: '',
      keyword: '',
      domain: '',
    },
  })

  const queryClient = useQueryClient()
  const fincc = () => {
    return <Snackbar autoHideDuration={6000} open message="I love snacks" />
  }

  const {isLoading, isError, error, isSuccess, mutate, ...rest} = useMutation(
    keywordData => axios.post('http://localhost:3000/api/v1/serp/sendTask', keywordData),
    {
      onSuccess: () => {
        setOpen(false)
        console.log('onSuccess: Keyword added')
        queryClient.invalidateQueries('reposData')
        fincc()
      },
      onError: e => {
        console.log('onError: ', e)
      },
      // onSettled: () => {
      //   console.log('onSettled: settled')
      // },
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
        <Typography variant="h6">Keyword for domain</Typography>

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
      {isLoading && <LinearProgress />}
      <DialogActions>
        <Button style={{display: isLoading ? 'none' : ''}} onClick={() => setOpen(false)}>
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

      {/* <Snackbar autoHideDuration={6000} open message="I love snacks" /> */}

      {/* <Snackbar autoHideDuration={6000} open>
        <MuiAlert elevation={6} variant="filled" severity="success">
          asda
        </MuiAlert>
      </Snackbar> */}
    </Dialog>
  )
}

export {AddModal}
