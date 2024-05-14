import React from 'react'

import Box from '@mui/material/Box'

import { NotificationsHomeProvider } from '../../context'
import NotificationsButton from '../NotificationsButton'
import NotificationsHomeBody from '../NotificationsHomeBody'

const Component = () => {
  return (
    <Box data-testid='component' sx={{ boxSizing: 'content-box' }}>
      <NotificationsButton />
      <NotificationsHomeBody />
    </Box>
  )
}

export const NotificationsHomeWrapper = (props) => {
  return (
    <NotificationsHomeProvider {...props}>
      <Component
        data-testid='NotificationsHomeWrapper'
        class='notification-home'
      />
    </NotificationsHomeProvider>
  )
}

export default NotificationsHomeWrapper
