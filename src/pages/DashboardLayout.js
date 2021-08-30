import {useState} from 'react'
import {styled, makeStyles} from '@material-ui/styles'
import DashboardNavbar from 'components/DashboardNavbar'
import DashboardSidebar from 'components/DashboardSidebar'
import {Box, Container} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
}))

const useStyles1 = makeStyles(theme => ({
  root: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256,
    },
  },
}))

const useStyles2 = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
}))

const useStyles3 = makeStyles(() => ({
  root: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
  },
}))

const DashboardLayout = () => {
  const classes = useStyles()
  const classes1 = useStyles1()
  const classes2 = useStyles2()
  const classes3 = useStyles3()

  const [isMobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className={classes.root}>
      <DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <DashboardSidebar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} />
      <div className={classes1.root}>
        <div className={classes2.root}>
          <div className={classes3.root}>
            <Box
              sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                py: 3,
              }}
            >
              <Container maxWidth={false}>Helllo</Container>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
