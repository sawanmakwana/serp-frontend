/* eslint-disable react/jsx-props-no-spreading */
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
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useClient} from 'useClient'
import {toast} from 'react-toastify'
import {Autocomplete, createFilterOptions} from '@material-ui/lab'
import {AddTagJoi} from 'validations/sub-project'

function AddTag({open1, setOpen1, editId, onClose, projectId}) {
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
    resolver: joiResolver(AddTagJoi),
    defaultValues: {
      tags: [],
    },
  })

  const queryClient = useQueryClient()

  const {isLoading, mutate} = useMutation(
    data =>
      client(`addTag/${editId}`, {
        data,
        method: 'post',
      }),
    {
      onSuccess: () => {
        setOpen1(false)
        queryClient.invalidateQueries('keyWordList')
        queryClient.invalidateQueries('exportKeywordsToCsv')
        queryClient.invalidateQueries('exportKeywordsToGoogleSheet')
        queryClient.invalidateQueries('analyticskeywordDashboard')
        toast.success(`Tag Added in Keyword`)
      },
    }
  )

  const {data: tagListDropDownData} = useQuery(['tagListDropDown', projectId], () =>
    client(`tagListDropDown/${projectId}`)
  )

  const submitForm = submitdata => {
    mutate({
      tagName: submitdata.tags.map(e => e.tagName),
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
      onClose={onClose}
      open={open1}
    >
      <MuiDialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">Add Tag</Typography>

        <IconButton style={{display: isLoading ? 'none' : ''}} className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent dividers>
        <form className={classesFrom.root}>
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
          onClick={onClose}
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
          {isLoading ? 'Loading...' : 'Add Tag'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {AddTag}
