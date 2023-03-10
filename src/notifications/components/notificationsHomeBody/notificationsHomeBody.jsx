import React from 'react'

import { Close, LinkOffOutlined } from '@mui/icons-material'
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
        {unreadCount > 0 ? <Chip varient="filled"  size='small' skin='light' label={`${unreadCount} Unread`} color="primary" sx={{color: theme.palette.primary.main, backgroundColor: theme.palette.chip.background}}></Chip>:''}
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
  return (
    <div style={{
      display: "flex",
    height: "4vh",
    alignItems: "center",
    justifyContent: "center",
    gap: "2.5px",
    filter: "opacity(.5)",
    }}>
      <span style={{
        fontSize: "10px",
        marginTop: "2px"
      }}>Powered By</span><img src="https://uploads-ssl.webflow.com/63735bad18c742035738e107/6399dab9fdfc2105b70def91_Fyno_logo_lettered.png" alt="Fyno" width={'45px'} height={'auto'} className={'poweredLogo'} />
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
        height: xs ? '39vh' : "58vh",
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
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
      MenuListProps={{
        sx: {
          overflowY: 'hidden',
          p: 0
        }
      }}
    >
      <Box sx={{ width: xs ? '24vw' : md ? '64vw': '90vw', height: xs ? '70vh' : '100%', background: theme.palette.background.paper }}>
        <PanelHeader />
        {errMsg === '' ? <PanelBody /> : <Error />}
        <PanelFooter />
      </Box>
    </Menu>
  )
}

export default NotificationsHomeBody
