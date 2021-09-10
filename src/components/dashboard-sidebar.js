/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import {Link as RouterLink, useLocation} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Avatar, Box, Button, Divider, Drawer, Hidden, List, ListItem, Typography} from '@material-ui/core'
import theme from 'theme'
import {Lock} from 'react-feather'
import NavItem from './nav-item'
import {Logout} from './logout-modal'
import {sidbarItem} from '../constants/sidebar-item'

const userlocal = window.localStorage.getItem('__user_data__')
const uservalue = JSON.parse(userlocal)

const user = {
  name: uservalue?.email,
  jobTitle: uservalue?.permissionLevel === 1 ? 'Admin' : 'noPermission',
}

const DashboardSidebar = ({onMobileClose, openMobile}) => {
  const location = useLocation()
  const [openLogout, setOpenLogout] = useState(false)

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose()
    }
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
          alt="Remy Sharp"
          style={{
            cursor: 'pointer',
            width: 64,
            height: 64,
            marginBottom: 8,
            background: 'rgb(101 118 255 / 28%)',
            color: 'rgb(86, 100, 210)',
          }}
          to="/my-account"
        >
          {uservalue?.email ? uservalue.email.toString().charAt(0).toUpperCase() : 'A'}
        </Avatar>
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
          <>
            {sidbarItem.map(item => (
              <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
            ))}
            <ListItem
              disableGutters
              style={{
                display: 'flex',
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              <Button
                onClick={() => setOpenLogout(true)}
                style={{
                  color: theme.palette.text.secondary,
                  fontWeight: 'medium',
                  justifyContent: 'flex-start',
                  letterSpacing: 0,
                  paddingTop: 10,
                  paddingBottom: 10,
                  textTransform: 'none',
                  width: '100%',
                }}
              >
                <Lock style={{marginRight: 8}} size="20" />
                <span>Logout</span>
              </Button>
            </ListItem>
          </>
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
            style: {
              width: 256,
            },
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
            style: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)',
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      {openLogout && <Logout openLogout={openLogout} setOpenLogout={setOpenLogout} />}
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
