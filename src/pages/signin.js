/* eslint-disable no-console */
import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import {Controller, useForm} from 'react-hook-form'
import {joiResolver} from '@hookform/resolvers'
import {useMutation} from 'react-query'
import {useAuth} from 'context/auth-context'
import axios from 'axios'
import {addUser} from '../validations/user'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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

  // const {isLoading, mutate} = useMutation(
  //   submitdata => axios.post(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/login`, submitdata),
  //   {
  //     onSuccess: () => {
  //       history.push('/home')
  //     },
  //   }
  // )

  const {login} = useAuth()

  const {mutate, isLoading} = useMutation(
    submitdata => axios.post(`${process.env.REACT_APP_PLATFORM_ENDPOINT}/login`, submitdata),
    {
      onSuccess: submitdata => {
        login(submitdata)
        console.log(submitdata)
      },
    }
  )

  const submitForm = data => mutate(data)

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
            variant="contained"
            onClick={handleSubmit(submitForm)}
            color="primary"
            disabled={isLoading}
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

export {SignIn}
