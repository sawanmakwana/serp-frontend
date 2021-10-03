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
  TextField,
  Typography,
  useMediaQuery,
  LinearProgress,
  Switch,
  FormControlLabel,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import {makeStyles, useTheme} from '@material-ui/styles'
import {useForm, Controller} from 'react-hook-form'
import {joiResolver} from '@hookform/resolvers'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useClient} from 'useClient'
import {Autocomplete, createFilterOptions} from '@material-ui/lab'
import {currencies, keywordFrequency} from '../constants/constants'
import {editSubProject, SubProject} from '../validations/sub-project'

function AddSubProjectListModal({open, setOpen, domain, _projectId, data, editId, setEditId}) {
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

  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const filter = createFilterOptions()

  const {handleSubmit, errors, control, reset} = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    resolver: editId ? joiResolver(editSubProject) : joiResolver(SubProject),
    defaultValues: {
      locationCode: '',
      keywordCheckFrequency: '',
      keyword: '',
      enableEmail: false,
      tags: [],
    },
  })

  React.useEffect(() => {
    if (editId) {
      const Edata = data?.data?.result?.filter(list => editId === list._id)
      const {locationCode, keywordCheckFrequency} = Edata[0]
      reset({
        locationCode,
        keywordCheckFrequency,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, reset])

  const queryClient = useQueryClient()

  const {isLoading, mutate} = useMutation(
    data =>
      !editId
        ? client(`addSubProject`, {
            data,
            method: 'post',
          })
        : client(`editSubProject/${editId}`, {
            data,
            method: 'post',
          }),
    {
      onSuccess: () => {
        setOpen(false)
        setEditId(null)
        queryClient.invalidateQueries('singalProject')
        queryClient.invalidateQueries('analyticsSingalProject')
        queryClient.invalidateQueries('csvProjectSublist')
        queryClient.invalidateQueries('exportSubProjectToGoogleSheet')
      },
    }
  )

  const submitForm = submitdata => {
    if (editId) {
      mutate({
        keyword: submitdata.keyword.split('\n'),
      })
    }
    if (!editId) {
      mutate({
        ...submitdata,
        keyword: submitdata.keyword.split('\n'),
        domain: domain[0].domain,
        _projectId,
        tags: submitdata.tags.split(' '),
      })
    }
  }

  const {data: tagListDropDownData} = useQuery(['tagListDropDown', _projectId], () =>
    client(`tagListDropDown/${_projectId}`)
  )

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
        <Typography variant="h6">{editId ? 'Update Sub Project' : 'Add Sub Project'}</Typography>

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
            name="locationCode"
            render={({onChange, onBlur, value}) => (
              <TextField
                label="Select location code"
                select
                required
                error={errors.locationCode}
                variant="outlined"
                onBlur={onBlur}
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={isLoading || editId}
                helperText={errors.locationCode && errors.locationCode.message}
              >
                {currencies.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="keywordCheckFrequency"
            render={({onChange, onBlur, value}) => (
              <TextField
                label="Select keywords checking frequency"
                select
                required
                error={errors.keywordCheckFrequency}
                variant="outlined"
                onBlur={onBlur}
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={isLoading || editId}
                helperText={errors.keywordCheckFrequency && errors.keywordCheckFrequency.message}
              >
                {keywordFrequency.map(option => (
                  <MenuItem key={option.value} value={option.value}>
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
          <FormHelperText className="helperText">Note: Each keyword to new line</FormHelperText>

          <Controller
            control={control}
            name="tags"
            render={({onChange, onBlur, value}) => (
              <Autocomplete
                options={tagListDropDownData?.data}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params)
                  if (params.inputValue !== '') {
                    filtered.push(params.inputValue)
                  }
                  return filtered
                }}
                getOptionLabel={option => option.tagName}
                id="controlled-demo"
                freeSolo
                selectOnFocus
                handleHomeEndKeys
                renderInput={params => (
                  <TextField
                    {...params}
                    value={value}
                    onBlur={onBlur}
                    onChange={e => onChange(e.target.value)}
                    variant="outlined"
                    label="controlled"
                    margin="normal"
                  />
                )}
              />
            )}
          />

          {/* <Controller
            control={control}
            name="tags"
            render={({onChange, onBlur, value}) => (
              <FormControl className="multi-select">
                <InputLabel style={{left: 15, top: -4}}>Select Tag</InputLabel>
                <Select
                  multiple
                  required
                  onBlur={onBlur}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  input={<OutlinedInput label="Select Tag" />}
                  error={errors.tags}
                  disabled={isLoading}
                  renderValue={selected =>
                    tagListDropDownData?.data
                      .filter(user => selected.includes(user._id))
                      .map(data => data.projectName)
                      .join(', ')
                  }
                  MenuProps={MenuProps}
                  helperText={errors.tags && errors.tags.message}
                >
                  <>
                    <MenuItem>
                      <ListItemText primary="Add New Tag" />
                    </MenuItem>
                    {tagListDropDownData?.data?.map(user => (
                      <MenuItem key={user._id} value={user._id}>
                        <ListItemText primary={user.projectName} />
                      </MenuItem>
                    ))}
                  </>
                </Select>
                {errors.tags && <p className="p-error"> {errors.tags.message}</p>}
              </FormControl>
            )}
          /> */}
          <TextField required variant="outlined" label="Enter Domain" disabled value={domain[0].domain} />
          {Boolean(!editId) && (
            <Controller
              control={control}
              name="enableEmail"
              render={({onChange, value, onBlur}) => (
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={value}
                      onBlur={onBlur}
                      value={value}
                      onChange={e => onChange(e.target.checked)}
                    />
                  }
                  label="Enable Email Notification"
                />
              )}
            />
          )}
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
          {isLoading ? 'Loading...' : `${editId ? 'Update Sub Project' : 'Add Sub Project'}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {AddSubProjectListModal}
