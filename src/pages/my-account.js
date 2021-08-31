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
} from '@material-ui/core'

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  city: 'AH',
  country: 'IND',
  jobTitle: 'Developer',
  name: 'Trupesh Chapaneri',
  timezone: 'Timezone',
}

function MyAccount() {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        color: 'red',
      }}
    >
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
                    src={user.avatar}
                    style={{
                      height: 100,
                      width: 100,
                      marginBottom: 8,
                    }}
                  />
                  <Typography color="textPrimary" gutterBottom variant="h3">
                    {user.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body1">
                    {`${user.city} ${user.country}`}
                  </Typography>
                  <Typography color="textSecondary" variant="body1">
                    09:46 AM GTM-7
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button color="primary" fullWidth variant="text">
                  Upload picture
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            <form autoComplete="off" noValidate>
              <Card>
                <CardHeader subheader="The information can be edited" title="Profile" />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <TextField fullWidth label="First name" name="firstName" variant="outlined" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField fullWidth label="Last name" name="lastName" variant="outlined" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField fullWidth label="Email Address" name="email" variant="outlined" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField fullWidth label="Phone Number" name="phone" variant="outlined" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField fullWidth label="Country" name="country" variant="outlined" />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField fullWidth label="Country" name="country" variant="outlined" />
                    </Grid>
                  </Grid>
                </CardContent>
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
    </Box>
  )
}

export {MyAccount}
