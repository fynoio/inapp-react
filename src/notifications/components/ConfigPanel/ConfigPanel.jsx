import React, { useEffect, useState, useRef } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useNotificationsHomeContext } from '../../context'

import { PanelHeader, PanelBody, PanelFooter } from '../ConfigComponents'
export const ConfigPanel = () => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  const {
    data: {
      showLoader,
      notificationCenterPosition,
      notificationCenterOffset,
      themeConfig,
      showBranding,
      userPreference
    }
  } = useNotificationsHomeContext()
  return (
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
            : '69vh'
          : '100%',
        background: theme.palette.background.configBackground,
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
      {/* <Divider sx={{ mt: 0, mb: 0 }} /> */}
      <PanelBody />
      {showBranding === true ? <PanelFooter /> : null}
    </Box>
  )
}

export default ConfigPanel
