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

function MyAccount() {
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
                  A
                </Avatar>
                <Typography color="textPrimary" gutterBottom variant="h3">
                  Fname Lanme
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  Ro
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
                    <TextField fullWidth label="First name" name="firstName" variant="outlined" />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField fullWidth label="Last name" name="lastName" variant="outlined" />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField fullWidth disabled label="Email Address" name="email" variant="outlined" />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField fullWidth disabled value="Admin" variant="outlined" />
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
  )
}

export {MyAccount}
