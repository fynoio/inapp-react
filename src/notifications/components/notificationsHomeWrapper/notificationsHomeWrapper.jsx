import React from 'react'

import Box from '@mui/material/Box'

import { NotificationsHomeProvider } from '../../context'
import NotificationsButton from '../NotificationsButton'
import NotificationsHomeBody from '../NotificationsHomeBody'

const Component = () => {
  return (
    <Box>
      <NotificationsButton />
      <NotificationsHomeBody />
    </Box>
  )
}

export const NotificationsHomeWrapper = ({user,workspace,signature,logo}) => {
  return (
    <NotificationsHomeProvider user={user} workspace={workspace} signature={signature} logo={logo}>
      <Component />
    </NotificationsHomeProvider>
  )
}

export default NotificationsHomeWrapper
