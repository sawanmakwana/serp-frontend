import {useEffect} from 'react'
import {Link as RouterLink, useLocation} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Avatar, Box, Divider, Drawer, Hidden, List, Typography} from '@material-ui/core'
import {BarChart, Lock, Settings, User, Users} from 'react-feather'
import NavItem from './NavItem'

const user = {
  // avatar: '/static/images/avatars/avatar_6.png',
  name: 'Trupesh Chapaneri',
  jobTitle: 'Developer',
}

const items = [
  {
    href: '/app/dashboard',
    icon: BarChart,
    title: 'Dashboard',
  },
  {
    href: '/app/customers',
    icon: Users,
    title: 'User',
  },
  {
    href: '/app/account',
    icon: User,
    title: 'My Account',
  },
  {
    href: '/app/settings',
    icon: Settings,
    title: 'Settings',
  },
  {
    href: '/login',
    icon: Lock,
    title: 'Logout',
  },
]

const DashboardSidebar = ({onMobileClose, openMobile}) => {
  const location = useLocation()

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const content = (
    <Box
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Avatar
          component={RouterLink}
          src={user.avatar}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64,
          }}
          to="/app/account"
        />
        <Typography color="textPrimary" variant="h5">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{p: 2}}>
        <List>
          {items.map(item => (
            <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
          ))}
        </List>
      </Box>
    </Box>
  )

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            className: 'hello',
            // sx: {
            //   width: 256,
            // },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            className: 'hello2',
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  )
}

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
}

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
}

export default DashboardSidebar
