import React from 'react'

import { Close } from '@mui/icons-material'
import { Box, IconButton, Menu, Chip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useNotificationsHomeContext } from '../../context'

import ConfigPanel from '../ConfigPanel'
import NotificationsTabs from '../NotificationsTabs'

const CloseButton = () => {
  const theme = useTheme()

  const {
    data: { anchorEl },
    handlers: { handleClosePanel }
  } = useNotificationsHomeContext()
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  if (!xs) {
    return (
      <IconButton onClick={handleClosePanel}>
        <Close />
      </IconButton>
    )
  }
}

const PanelHeader = () => {
  const theme = useTheme()
  const {
    data: { unreadCount }
  } = useNotificationsHomeContext()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 'auto',
        pb: 1,
        pl: 3,
        pr: 2,
        pt: 3
      }}
    >
      <Typography variant='h5'>Notifications</Typography>
      <Box>
        {/* <IconButton onClick={handleOpenConfig}>
        <Settings />
      </IconButton> */}
        <Chip varient="filled"  size='small' skin='light' label={`${unreadCount} Unread`} color="primary" sx={{color: theme.palette.primary.main, backgroundColor: theme.palette.chip.background}}></Chip>
        <CloseButton />
      </Box>
    </Box>
  )
}

const PanelBody = () => {
  const {
    data: { showConfig }
  } = useNotificationsHomeContext()

  if (!showConfig) {
    return <NotificationsTabs />
  } else if (showConfig) {
    return <ConfigPanel />
  }
}

export const NotificationsHomeBody = () => {
  const theme = useTheme()

  const {
    data: { anchorEl },
    handlers: { handleClosePanel }
  } = useNotificationsHomeContext()

  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Menu
      anchorEl={anchorEl}
      disableScrollLock={false}
      open={Boolean(anchorEl)}
      sx={{ left: { sm: -50 } }}
      onClose={handleClosePanel}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
      MenuListProps={{
        sx: {
          overflowY: 'hidden',
          p: 0
        }
      }}
    >
      <Box sx={{ width: xs ? '24vw' : '100%', background: theme.palette.background.paper }}>
        <PanelHeader />
        <PanelBody />
      </Box>
    </Menu>
  )
}

export default NotificationsHomeBody
