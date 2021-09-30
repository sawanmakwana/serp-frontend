import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  ListItemText,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import {makeStyles, useTheme} from '@material-ui/styles'
import {useForm, Controller} from 'react-hook-form'
import {joiResolver} from '@hookform/resolvers'
import {useMutation, useQueryClient, useQuery} from 'react-query'
import {useClient} from 'useClient'
import {permissionLevelOP} from '../constants/constants'
import {UserList} from '../validations/user-list'

function AddUser({open, setOpen, data, editId, setEditId}) {
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

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  }
  const classes = useStyles()
  const client = useClient()
  const classesFrom = useStylesForm()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  // const [listAssignProject, setListAssignProject] = useState([])

  const {handleSubmit, errors, control, reset} = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    resolver: joiResolver(UserList),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      permissionLevel: '',
      assignProject: [],
    },
  })
  // console.log(watch('assignProject'))

  React.useEffect(() => {
    if (editId) {
      const Edata = data?.data?.result?.filter(list => editId === list._id)
      const {email, firstName, lastName, permissionLevel, projectAccess} = Edata[0]
      reset({
        firstName,
        lastName,
        email,
        permissionLevel,
        projectAccess,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, reset])

  const queryClient = useQueryClient()

  const {isLoading, mutate} = useMutation(
    data =>
      !editId
        ? client(`createUser`, {
            data,
            method: 'post',
          })
        : client(`editCreateUser/${editId}`, {
            data,
            method: 'post',
          }),
    {
      onSuccess: () => {
        setOpen(false)
        setEditId(null)
        queryClient.invalidateQueries('userList')
      },
    }
  )

  const {data: projectlistData, isLoading: projectlistIsLoading} = useQuery(['DdList'], () =>
    client(`getProjectsListDrpDwn`)
  )

  // console.log(projectlistData?.data)

  const submitForm = submitdata => {
    // console.log(submitdata)
    mutate(submitdata)
    // if (editId) {
    //   mutate({
    //     keyword: submitdata.keyword.split('\n'),
    //   })
    // }
    // if (!editId) {
    //   mutate({
    //     ...submitdata,
    //     keyword: submitdata.keyword.split('\n'),
    //     domain: domain[0].domain,
    //     _projectId,
    //   })
    // }
  }

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
        <Typography variant="h6">{editId ? 'Update User' : 'Add User'}</Typography>

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
            name="firstName"
            render={({onChange, value, onBlur}) => (
              <TextField
                label="Enter First name"
                required
                disabled={isLoading}
                onBlur={onBlur}
                error={errors.firstName}
                variant="outlined"
                helperText={errors.firstName && errors.firstName.message}
                value={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({onChange, value, onBlur}) => (
              <TextField
                label="Enter Last name"
                required
                disabled={isLoading}
                onBlur={onBlur}
                error={errors.lastName}
                variant="outlined"
                helperText={errors.lastName && errors.lastName.message}
                value={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({onChange, value, onBlur}) => (
              <TextField
                label="Enter Email"
                required
                disabled={isLoading}
                onBlur={onBlur}
                error={errors.email}
                variant="outlined"
                helperText={errors.email && errors.email.message}
                value={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />
          {/* <Controller
            control={control}
            name="assignProject"
            render={({onChange, onBlur, value}) => (
              <TextField
                label="Assign Project To User"
                select
                multiple
                required
                error={errors.assignProject}
                variant="outlined"
                onBlur={onBlur}
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={isLoading}
                helperText={errors.assignProject && errors.assignProject.message}
              >
                {listProject?.map(({value, projectName}) => (
                  <MenuItem key={value} value={value}>
                    {projectName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          /> */}

          <Controller
            control={control}
            name="assignProject"
            render={({onChange, onBlur, value}) => (
              <FormControl className="multi-select">
                <InputLabel style={{left: 15, top: -4}}>Assign Project</InputLabel>
                <Select
                  multiple
                  onBlur={onBlur}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  input={<OutlinedInput label="Assign Project" />}
                  error={errors.assignProject}
                  disabled={isLoading}
                  renderValue={selected => selected.join(', ')}
                  // renderValue={selected =>
                  //   projectlistData?.data?.map(user => {
                  //     if (user._id === selected) return console.log(user.projectName)
                  //   })
                  // }
                  MenuProps={MenuProps}
                  helperText={errors.assignProject && errors.assignProject.message}
                >
                  {projectlistData?.data?.map(user => (
                    <MenuItem key={user._id} value={user._id}>
                      {/* <Checkbox primary checked={user?.value?.includes()} /> */}
                      <ListItemText primary={user.projectName} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.assignProject && <p className="p-error"> {errors.assignProject.message}</p>}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="permissionLevel"
            render={({onChange, onBlur, value}) => (
              <TextField
                label="Select Permission Level"
                select
                required
                error={errors.permissionLevel}
                variant="outlined"
                onBlur={onBlur}
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={isLoading}
                helperText={errors.permissionLevel && errors.permissionLevel.message}
              >
                {permissionLevelOP.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </form>
      </DialogContent>
      {(isLoading || projectlistIsLoading) && <LinearProgress />}
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
          {isLoading ? 'Loading...' : `${editId ? 'Update User' : 'Add User'}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export {AddUser}
