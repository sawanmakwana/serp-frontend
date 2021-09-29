import {BarChart, Settings, User, Users} from 'react-feather'

export const sidbarItem = [
  {
    href: '/dashboard',
    icon: BarChart,
    title: 'Dashboard',
  },
  {
    href: '/project',
    icon: Users,
    title: 'Projects',
  },
  {
    href: '/user',
    icon: Users,
    title: 'User',
  },
  {
    href: '/my-account',
    icon: User,
    title: 'My Account',
  },
  {
    href: '/settings',
    icon: Settings,
    title: 'Settings',
  },
]
