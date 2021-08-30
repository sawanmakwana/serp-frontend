import {useState} from 'react'
import {makeStyles} from '@material-ui/styles'
import DashboardNavbar from 'components/DashboardNavbar'
import DashboardSidebar from 'components/DashboardSidebar'
import {Box, Container} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  DashboardLayoutRoot: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  DashboardLayoutWrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256,
    },
  },
  DashboardLayoutContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  DashboardLayoutContent: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
  },
  DashboardLayoutBox: {
    background: theme.palette.background.default,
    minHeight: '100%',
    padding: '24px 0',
  },
}))

function AppLayout({children}) {
  const classes = useStyles()

  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <div className={classes.DashboardLayoutRoot}>
      <DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <DashboardSidebar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} />
      <div className={classes.DashboardLayoutWrapper}>
        <div className={classes.DashboardLayoutContainer}>
          <div className={classes.DashboardLayoutContent}>
            <Box className={classes.DashboardLayoutBox}>
              <Container maxWidth={false}>{children}</Container>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export {AppLayout}
