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

export const NotificationsHomeWrapper = (props) => {
  return (
    <NotificationsHomeProvider {...props}>
      <Component />
    </NotificationsHomeProvider>
  )
}

export default NotificationsHomeWrapper
