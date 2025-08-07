import React from 'react'

import MemoNotificationsOutlined from '../Icons/NotificationsOutlined'
import { Badge, IconButton } from '@mui/material'
import { useNotificationsHomeContext } from '../../context'

export const NotificationsButton = () => {
  const {
    data: { isSeen, customNotificationIconComponent, disableRipple },
    handlers: { handleOpenPanel }
  } = useNotificationsHomeContext()

  return (
    <IconButton
      disableRipple={disableRipple}
      color='inherit'
      aria-haspopup='true'
      onClick={handleOpenPanel}
      className='fyno-notification-icon'
    >
      <Badge color='error' overlap='circular' variant='dot' invisible={isSeen}>
        {customNotificationIconComponent ? (
          customNotificationIconComponent
        ) : (
          <MemoNotificationsOutlined />
        )}
      </Badge>
    </IconButton>
  )
}

export default NotificationsButton
