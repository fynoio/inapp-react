import React from 'react'

import { Close, LinkOffOutlined, WifiOff } from '@mui/icons-material'
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
import NotificationsTabs from '../NotificationsTabs'

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

const PanelHeader = () => {
  const {
    data: { errMsg, header }
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
          pr: 2,
          pt: 3,
          gap: 2
        }}
        data-testid='noti-center-header'
      >
        <Typography variant='h5'>
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
          <CloseButton />
        </Box>
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
      </Box>
    )
  } else return null
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

const PanelFooter = () => {
  const {
    data: { showLoader }
  } = useNotificationsHomeContext()
  return (
    <Box data-testid='noti-center-footer'>
      <Box
        date-testid = "noti-center-footer"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // py: 0.7,
          gap: 0.5,
          height: '2.25vh',
          position: 'absolute',
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
          src='https://uploads-ssl.webflow.com/63735bad18c742035738e107/6399dab9fdfc2105b70def91_Fyno_logo_lettered.png'
          alt='Fyno'
          width='45px'
          height='auto'
          className='poweredLogo'
        />
      </Box>
    </Box>
  )
}

const Error = () => {
  const {
    data: { errMsg }
  } = useNotificationsHomeContext()
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Box
      sx={{
        height: xs ? '39vh' : '58vh',
        width: '100%',
        color: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        pt: '20vh',
        textAlign: 'center'
      }}
    >
      <LinkOffOutlined fontSize='large' />
      <Typography color='secondary' sx={{ width: '55%' }}>
        {errMsg}
      </Typography>
    </Box>
  )
}

export const NotificationsHomeBody = () => {
  const theme = useTheme()

  const {
    data: {
      anchorEl,
      showLoader,
      notificationCenterPosition,
      notificationCenterOffset
    },
    handlers: { handleClosePanel }
  } = useNotificationsHomeContext()

  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Menu
      anchorEl={anchorEl}
      disableScrollLock={false}
      open={Boolean(anchorEl)}
      sx={{ left: { sm: -50 } }}
      onClose={handleClosePanel}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      MenuListProps={{
        sx: {
          overflowY: 'hidden',
          p: 0,
          background: 'red'
        }
      }}
      PaperProps={{
        sx: {
          p: 0,
          background: 'green',
          // minWidth: 0,
          // width: 0,
          // zIndex: -9999,
          boxShadow: 'none',
          ...(notificationCenterPosition !== 'default'
            ? { minWidth: 0, width: 0 }
            : {})
        }
      }}
    >
      <Box
        data-testid='Hello'
        sx={{
          boxShadow:
            '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
          minWidth: xs ? '25pc' : '80%',
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

        <PanelFooter />
      </Box>
    </Menu>
  )
}

export default NotificationsHomeBody
