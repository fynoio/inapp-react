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

export const NotificationsHomeWrapper = ({
  user,
  workspace,
  integration,
  signature,
  logo,
  sound,
  overrideInappUrl
}) => {
  return (
    <NotificationsHomeProvider
      user={user}
      workspace={workspace}
      integration={integration}
      signature={signature}
      logo={logo}
      sound={sound}
      overrideInappUrl={overrideInappUrl}
    >
      <Component />
    </NotificationsHomeProvider>
  )
}

export default NotificationsHomeWrapper
