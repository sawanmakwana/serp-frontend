import React from 'react'
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
} from '@material-ui/core'
import {Controller, useForm} from 'react-hook-form'
import {useQuery} from 'react-query'
import {useClient} from 'useClient'
import {getUserAccess} from 'util/app-utill'

function MyAccount() {
  const userlocal = window.localStorage.getItem('__user_data__')
  const uservalue = JSON.parse(userlocal)
  const client = useClient()

  const {data, isFetching, isLoading} = useQuery(['myAccount'], () => client(`viewUserProfile/${uservalue?._id}`))

  const {handleSubmit, errors, control, reset} = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    //  resolver: joiResolver(UserList),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, reset])

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
                  style={{
                    height: 100,
                    width: 100,
                    marginBottom: 14,
                  }}
                >
                  {data?.data?.firstName.toString().charAt(0).toUpperCase()}
                </Avatar>
                <Typography color="textPrimary" gutterBottom variant="h3">
                  {`${data?.data?.firstName}${' '}${data?.data?.lastName}`}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {getUserAccess(data?.data?.permissionLevel)}
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <CardActions>
              <Button color="primary" fullWidth variant="text">
                Change Password
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <form>
            <Card>
              <CardHeader subheader="The information can be edited" title="Profile" />
              <Divider />
              <CardContent>
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
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField fullWidth disabled label="Email" value={data?.data?.email} variant="outlined" />
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
              </CardContent>
              {isFetching && <LinearProgress />}

              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 2,
                }}
              >
                <Button color="primary" variant="contained">
                  Save details
                </Button>
              </Box>
            </Card>
          </form>
        </Grid>
      </Grid>
    </Container>
  )
}

export {MyAccount}
