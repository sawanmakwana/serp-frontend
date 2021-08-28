import React from 'react'
import {Avatar, Button, Container, CssBaseline, TextField, Typography} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import {Controller, useForm} from 'react-hook-form'
import {joiResolver} from '@hookform/resolvers'
import {useMutation} from 'react-query'
import {useAuth} from 'context/auth-context'
import axios from 'axios'
import {makeStyles} from '@material-ui/styles'
import {addUser} from '../validations/user'

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    // margin: theme.spacing(1),
    // backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    // marginTop: theme.spacing(1),
  },
  submit: {
    // margin: theme.spacing(3, 0, 2),
  },
}))
function SignIn() {
  const classes = useStyles()

  const {handleSubmit, errors, control} = useForm({
    mode: 'onTouched',
    shouldFocusError: true,
    reValidateMode: 'onChange',
    submitFocusError: true,
    shouldUnregister: false,
    resolver: joiResolver(addUser),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {login} = useAuth()

  const {mutate, isLoading} = useMutation(
    submitdata => axios.post(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/login`, submitdata),
    {
      onSuccess: submitdata => {
        login(submitdata.data.data)
      },
    }
  )

  const submitForm = data => mutate(data)

  return (
    <Container className="signinWrap" component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in to SERP
        </Typography>
        <form className={classes.form}>
          <Controller
            control={control}
            name="email"
            render={({onChange, value, onBlur}) => (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onBlur={onBlur}
                disabled={isLoading}
                error={errors.email}
                variant="outlined"
                helperText={errors.email && errors.email.message}
                value={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({onChange, value, onBlur}) => (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onBlur={onBlur}
                disabled={isLoading}
                error={errors.password}
                variant="outlined"
                helperText={errors.password && errors.password.message}
                value={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={handleSubmit(submitForm)}
            disabled={isLoading}
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  )
}

export {SignIn}
