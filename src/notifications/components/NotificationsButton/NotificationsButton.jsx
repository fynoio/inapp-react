import React from 'react'

import { NotificationsOutlined } from '@mui/icons-material'
import { Badge, IconButton } from '@mui/material'
import { useNotificationsHomeContext } from '../../context'

export const NotificationsButton = () => {
  const {
    data: { isSeen },
    handlers: { handleOpenPanel }
  } = useNotificationsHomeContext()

  return (
    <IconButton
      color='inherit'
      aria-haspopup='true'
      onClick={handleOpenPanel}
      className='fyno-notification-icon'
    >
      <Badge color='error' overlap='circular' variant='dot' invisible={isSeen}>
        <NotificationsOutlined />
      </Badge>
    </IconButton>
  )
}

export default NotificationsButton
