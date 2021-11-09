/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
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
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useClient} from 'useClient'
import {toast} from 'react-toastify'
import {Autocomplete, createFilterOptions} from '@material-ui/lab'
import {AddKeywordModalJoi} from '../validations/sub-project'

function AddKeywordModal({open, setOpen, editId, KeywordId}) {
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
  const client = useClient()
  const classesFrom = useStylesForm()
  const theme = useTheme()
  const filter = createFilterOptions()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  const {handleSubmit, errors, control} = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    resolver: joiResolver(AddKeywordModalJoi),
    defaultValues: {
      keyword: '',
      tags: [],
    },
  })

  const queryClient = useQueryClient()

  const {isLoading, mutate} = useMutation(
    data =>
      client(`editSubProject/${editId}`, {
        data,
        method: 'post',
      }),
    {
      onSuccess: () => {
        setOpen(false)
        queryClient.invalidateQueries('keyWordList')
        queryClient.invalidateQueries('exportKeywordsToCsv')
        queryClient.invalidateQueries('exportKeywordsToGoogleSheet')
        queryClient.invalidateQueries('analyticskeywordDashboard')
        toast.success(`Keyword Added`)
      },
    }
  )

  const {data: tagListDropDownData} = useQuery(['tagListDropDown', KeywordId], () =>
    client(`tagListDropDown/${KeywordId}`)
  )

  const submitForm = submitdata => {
    mutate({
      keyword: submitdata.keyword.split('\n'),
      tags: submitdata.tags.map(e => e.tagName),
    })
  }

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
        <Typography variant="h6">Add Keyword</Typography>

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
            name="keyword"
            render={({onChange, value, onBlur}) => (
              <TextField
                label="Enter keyword"
                multiline
                required
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
                }}
              />
            )}
          />
          <FormHelperText className="helperText mb-1">Note: Each keyword to new line</FormHelperText>

          <Controller
            control={control}
            name="tags"
            render={({onChange, onBlur, value}) => (
              <Autocomplete
                options={tagListDropDownData?.data}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params)
                  if (filtered.length === 0) {
                    if (params.inputValue !== '') {
                      const tagName = params.inputValue
                      filtered.push({_id: -1, tagName})
                    }
                    return filtered
                  }
                  return filtered
                }}
                getOptionLabel={option => option?.tagName}
                id="tag"
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                freeSolo
                multiple
                onChange={(_, data) => onChange(data)}
                value={value}
                onBlur={onBlur}
                disabled={isLoading}
                renderInput={params => <TextField {...params} variant="outlined" label="Select Tag" />}
              />
            )}
          />
          {errors.tags && <p className="p-error"> {errors.tags.message}</p>}
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

export {AddKeywordModal}
