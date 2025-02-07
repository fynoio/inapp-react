import React from 'react'

import { Close, SettingsOutlined, WifiOff } from '@mui/icons-material'
import {
  Box,
  IconButton,
  Menu,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material'
import { useNotificationsHomeContext } from '../../context'
import ConfigPanel from '../ConfigPanel'
import ConfigPopup from '../ConfigPopup'
import NotificationsTabs from '../NotificationsTabs'
import { LOGO_DARK, LOGO_LIGHT } from '../../helpers/constants'

const CloseButton = () => {
  const theme = useTheme()

  const {
    data: { errMsg },
    handlers: { handleClosePanel }
  } = useNotificationsHomeContext()
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  if (!xs) {
    return (
      <IconButton
        sx={{
          color: errMsg
            ? theme.palette.secondary.main
            : theme.palette.text.primary
        }}
        onClick={handleClosePanel}
        size='small'
      >
        <Close fontSize='small' />
      </IconButton>
    )
  } else return null
}

const ConfigButton = () => {
  const theme = useTheme()

  const {
    data: { errMsg },
    handlers: { handleOpenConfig }
  } = useNotificationsHomeContext()
  return (
    <IconButton
      sx={{
        color: errMsg
          ? theme.palette.secondary.main
          : theme.palette.text.primary
      }}
      onClick={handleOpenConfig}
      size='small'
    >
      <SettingsOutlined fontSize='small' color='secondary' />
    </IconButton>
  )
}

const PanelHeader = () => {
  const {
    data: { errMsg, header, preferenceMode }
  } = useNotificationsHomeContext()

  const theme = useTheme()

  const xsUp = useMediaQuery(theme.breakpoints.up('sm'))

  if (header !== undefined || !xsUp) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 'auto',
          pb: 1,
          pl: 3,
          pr: 3,
          pt: 3,
          gap: 2
        }}
        data-testid='noti-center-header'
        className='notification-center-header'
      >
        <Typography variant='h5' className='header-text'>
          {header === true || header === '' || (!header && !xsUp)
            ? 'Notifications'
            : header}
        </Typography>

        <Box
          sx={{
            display: 'inline-flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          {errMsg === 'xhr poll error' ? (
            <Tooltip title='You are offline now, please check your internet'>
              <WifiOff color='secondary' />
            </Tooltip>
          ) : (
            <Box />
          )}
          <CloseButton color='secondary' />
        </Box>
        {preferenceMode !== 'none' && <ConfigButton color='secondary' />}
      </Box>
    )
  }

  if (errMsg === 'xhr poll error') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: !xsUp ? 'space-between' : 'center',
          width: 'auto',
          py: 0.5,
          px: 2,
          gap: 2,
          background: 'rgba(0,0,0,0.2)'
        }}
      >
        <Tooltip title='You are offline now, please check your internet'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WifiOff
              sx={{
                fontSize: '0.75rem',
                color:
                  theme.palette.mode === 'light'
                    ? '#ffffff'
                    : theme.palette.secondary.main
              }}
            />
            <Typography
              variant='subtitle2'
              color={theme.palette.mode === 'light' ? '#ffffff' : 'secondary'}
              fontSize='0.7rem'
            >
              Offline
            </Typography>
          </Box>
        </Tooltip>
        <CloseButton />
        <ConfigButton />
      </Box>
    )
  } else return null
}

const PanelBody = () => <NotificationsTabs />

const PanelFooter = () => {
  const theme = useTheme()
  return (
    <Box data-testid='noti-center-footer'>
      <Box
        date-testid='noti-center-footer'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // py: 0.7,
          gap: 0.5,
          height: '2.25vh',
          position: 'relative',
          bottom: 0,
          left: 0,
          right: 0,
          background: (theme) => theme.palette.background.paper
        }}
      >
        <Typography sx={{ fontSize: '0.7rem', filter: 'opacity(.5)' }}>
          Powered By
        </Typography>
        <img
          src={theme.palette.mode === 'light' ? LOGO_LIGHT : LOGO_DARK}
          alt='Fyno'
          width='45px'
          height='auto'
          className='poweredLogo'
        />
      </Box>
    </Box>
  )
}

export const NotificationsHomeBody = () => {
  const theme = useTheme()

  const {
    data: {
      anchorEl,
      showConfig,
      notificationCenterPosition,
      notificationCenterOffset,
      preferenceMode,
      showBranding,
      notificationCenterConfig
    },
    handlers: { handleClosePanel }
  } = useNotificationsHomeContext()
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Menu
      className='inapp-container'
      anchorEl={anchorEl}
      disableScrollLock={false}
      open={Boolean(anchorEl)}
      sx={{
        // left: { sm: -50 },
        visibility:
          showConfig && preferenceMode === 'modal' ? 'hidden' : 'visible'
      }}
      onClose={handleClosePanel}
      anchorOrigin={{
        vertical: notificationCenterConfig?.anchorOrigin?.vertical || 'bottom',
        horizontal: notificationCenterConfig?.anchorOrigin?.horizontal || 'left'
      }}
      transformOrigin={{
        vertical: notificationCenterConfig?.transformOrigin?.vertical || 'top',
        horizontal:
          notificationCenterConfig?.transformOrigin?.horizontal || 'left'
      }}
      MenuListProps={{
        sx: {
          overflowY: 'hidden',
          p: 0
        }
      }}
      PaperProps={{
        sx: {
          p: 0,
          borderRadius: '0.75rem',
          // minWidth: 0,
          // width: 0,
          // zIndex: -9999,
          ...(notificationCenterPosition !== 'default'
            ? { minWidth: 0, width: 0 }
            : {})
        }
      }}
    >
      {!showConfig ? (
        <Box
          data-testid='Hello'
          className='notification-panel'
          sx={{
            boxSizing: 'content-box',
            boxShadow:
              '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
            minWidth: xs ? '28pc' : '80%',
            width: md ? '24vw' : xs ? '64vw' : '90vw',
            height: xs
              ? notificationCenterPosition === 'left' ||
                notificationCenterPosition === 'right'
                ? '100%'
                : '70vh'
              : '100%',
            background: theme.palette.background.paper,
            position:
              notificationCenterPosition === 'left' ||
              notificationCenterPosition === 'right'
                ? 'fixed'
                : 'relative',
            ...(notificationCenterPosition === 'left' ||
            notificationCenterPosition === 'right'
              ? { top: 0 }
              : {}),
            ...(notificationCenterPosition === 'left'
              ? { left: notificationCenterOffset || 100 }
              : {}),
            ...(notificationCenterPosition === 'right'
              ? { right: notificationCenterOffset || 100 }
              : {})
          }}
        >
          <PanelHeader />
          {/* {errMsg === undefined ||
        errMsg === '' ||
        errMsg === 'xhr poll error' ? (
          <PanelBody />
        ) : (
          <Error />
        )} */}
          <PanelBody />

          {showBranding === true ? <PanelFooter /> : null}
        </Box>
      ) : preferenceMode === 'embed' ? (
        <ConfigPanel />
      ) : (
        <ConfigPopup />
      )}
    </Menu>
  )
}

export default NotificationsHomeBody
