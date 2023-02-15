import React from 'react'

import { NotificationsOutlined } from '@mui/icons-material'
import { Badge, IconButton } from '@mui/material'
import { useNotificationsHomeContext } from '../../context'

export const NotificationsButton = () => {
  const {
    data: { unreadCount },
    handlers: { handleOpenPanel }
  } = useNotificationsHomeContext()

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleOpenPanel}>
      <Badge color='error' overlap='circular' variant='dot' invisible={!unreadCount > 0}>
        <NotificationsOutlined />
      </Badge>
    </IconButton>
  )
}

export default NotificationsButton
