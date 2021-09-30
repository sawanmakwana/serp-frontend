import {BarChart, Settings, Users, Folder} from 'react-feather'

export const sidbarItem = [
  {
    href: '/dashboard',
    icon: BarChart,
    title: 'Dashboard',
  },
  {
    href: '/project',
    icon: Folder,
    title: 'Projects',
  },
  {
    href: '/user',
    icon: Users,
    title: 'User',
  },
  {
    href: '/my-account',
    icon: Settings,
    title: 'My Account',
  },
  // {
  //   href: '/settings',
  //   icon: Settings,
  //   title: 'Settings',
  // },
]
