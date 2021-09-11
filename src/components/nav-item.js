import {NavLink as RouterLink, useLocation} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Button, ListItem} from '@material-ui/core'
import theme from 'theme'

const NavItem = ({href, icon: Icon, title}) => {
  const location = useLocation()
  // const active = location.pathname === href
  const active = location.pathname.includes(href)

  return (
    <ListItem
      disableGutters
      style={{
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <Button
        component={RouterLink}
        to={href}
        style={{
          color: active ? theme.palette.primary.main : theme.palette.text.secondary,
          fontWeight: 'medium',
          justifyContent: 'flex-start',
          letterSpacing: 0,
          paddingTop: 10,
          paddingBottom: 10,
          textTransform: 'none',
          width: '100%',
        }}
      >
        {Icon && <Icon style={{marginRight: 8}} size="20" />}
        <span>{title}</span>
      </Button>
    </ListItem>
  )
}

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
}

export default NavItem
