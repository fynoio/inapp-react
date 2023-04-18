import React, { useState } from 'react'

import {
  Close,
  DeleteSweep,
  DeleteSweepOutlined,
  LinkOffOutlined,
  WifiOff
} from '@mui/icons-material'
import {
  Box,
  IconButton,
  Menu,
  Chip,
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
    handlers: { handleClosePanel }
  } = useNotificationsHomeContext()
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  if (!xs) {
    return (
      <IconButton onClick={handleClosePanel}>
        <Close />
      </IconButton>
    )
  } else return null
}

const PanelHeader = () => {
  const {
    data: { errMsg }
  } = useNotificationsHomeContext()

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
    >
      <Typography variant='h5'>Notifications</Typography>

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
  const theme = useTheme()
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '2px',
        width: '100%',
        height: '2.5vh',
        background: theme.palette.background.paper
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '3vh',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.5px',
          filter: 'opacity(.5)'
        }}
      >
        <span
          style={{
            fontSize: '10px',
            marginTop: '2px'
          }}
        >
          Powered By
        </span>
        <img
          src='https://uploads-ssl.webflow.com/63735bad18c742035738e107/6399dab9fdfc2105b70def91_Fyno_logo_lettered.png'
          alt='Fyno'
          width={'45px'}
          height={'auto'}
          className={'poweredLogo'}
        />
      </div>
    </div>
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
    data: { anchorEl, errMsg },
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
          p: 0
        }
      }}
    >
      <Box
        sx={{
          width: xs ? '24vw' : md ? '64vw' : '90vw',
          height: xs ? '70vh' : '100%',
          background: theme.palette.background.paper
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
