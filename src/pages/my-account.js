import React, {useState} from 'react'
import {joiResolver} from '@hookform/resolvers'
import {
  Box,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Avatar,
  Typography,
  CardActions,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core'
import {Controller, useForm} from 'react-hook-form'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useClient} from 'useClient'
import {getUserAccess, getUserAvtar} from 'util/app-utill'
import {MyAcc} from 'validations/user-list'
import {toast} from 'react-toastify'
import {ChangePass} from 'components/change-pass'

function MyAccount() {
  const [changepass, setChangePass] = useState(false)

  const userlocal = window.localStorage.getItem('__user_data__')
  const uservalue = JSON.parse(userlocal)
  const client = useClient()
  const queryClient = useQueryClient()

  const {data, isFetching} = useQuery(['myAccount'], () => client(`viewUserProfile/${uservalue?._id}`))

  const {
    handleSubmit,
    errors,
    control,
    reset,
    formState: {isDirty},
  } = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    resolver: joiResolver(MyAcc),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  })

  React.useEffect(() => {
    if (data?.data) {
      const {firstName, lastName} = data?.data
      reset({
        firstName,
        lastName,
      })
    }
  }, [data, reset])

  const {
    mutate,
    isLoading: editIsLoading,
    isFetching: editIsFetching,
  } = useMutation(
    data =>
      client(`editUser/${uservalue?._id}`, {
        data,
        method: 'put',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sideBarUserInfo')
        queryClient.invalidateQueries('myAccount')
        toast.success('Profile Updated')
      },
    }
  )

  const submitForm = submitdata => mutate(submitdata)

  return (
    <Container maxWidth="lg" style={{padding: 0}}>
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Avatar
                  className={getUserAvtar(data?.data?.permissionLevel)}
                  style={{
                    height: 100,
                    width: 100,
                    marginBottom: 14,
                    fontSize: 28,
                  }}
                >
                  {isFetching ? (
                    <CircularProgress style={{height: 30, width: 30}} />
                  ) : (
                    data?.data?.firstName.toString().charAt(0).toUpperCase()
                  )}
                </Avatar>
                <Typography color="textPrimary" gutterBottom variant="h3">
                  {isFetching ? (
                    <CircularProgress style={{height: 15, width: 15}} />
                  ) : (
                    `${data?.data?.firstName}${' '}${data?.data?.lastName}`
                  )}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {isFetching ? (
                    <CircularProgress style={{height: 15, width: 15}} />
                  ) : (
                    getUserAccess(data?.data?.permissionLevel)
                  )}
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <CardActions>
              <Button color="primary" fullWidth variant="text" onClick={() => setChangePass(true)}>
                Change Password
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <Card>
            <CardHeader subheader="The information can be edited" title="Profile" />
            <Divider />
            <CardContent>
              <form>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      name="firstName"
                      render={({onChange, value, onBlur}) => (
                        <TextField
                          label="Enter First name"
                          required
                          fullWidth
                          disabled={editIsLoading}
                          onBlur={onBlur}
                          error={errors.firstName}
                          variant="outlined"
                          helperText={errors.firstName && errors.firstName.message}
                          value={value}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      name="lastName"
                      render={({onChange, value, onBlur}) => (
                        <TextField
                          label="Last name"
                          required
                          fullWidth
                          disabled={editIsLoading}
                          onBlur={onBlur}
                          error={errors.lastName}
                          variant="outlined"
                          helperText={errors.lastName && errors.lastName.message}
                          value={value}
                          onChange={e => onChange(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      disabled
                      label="Email asdasdsadads"
                      value={data?.data?.email ? data?.data?.email : '-'}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      disabled
                      label="Access Level"
                      value={getUserAccess(data?.data?.permissionLevel)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
            {(isFetching || editIsFetching || editIsLoading) && <LinearProgress />}
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2,
              }}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit(submitForm)}
                disabled={editIsLoading || !isDirty}
              >
                Save details
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {changepass && <ChangePass setOpen={setChangePass} open={changepass} />}
    </Container>
  )
}

export {MyAccount}
