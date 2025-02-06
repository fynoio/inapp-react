import { Toaster } from 'react-hot-toast'
import NotificationHomeWrapper from './notifications/components/NotificationsHomeWrapper'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import React from 'react'
import './styles.module.css'
import { hexToRGBA } from './notifications/helpers/hextoRGBA'

export const FynoInappCenter = (props) => {
  const { mode, themeConfig, notificationSettings } = props

  const lightColor = '53,65,63'
  const darkColor = '227, 252, 251'
  const mainColor =
    mode === 'light'
      ? themeConfig?.lightColor || lightColor
      : themeConfig?.darkColor || darkColor

  const defaultBgColor = () => {
    if (mode === 'light') {
      return '#F2F2F2'
    } else return '#0D0D0D'
  }

  const teal = {
    50: '#e6f2f2',
    100: '#b0d8d8',
    200: '#8ac5c5',
    300: '#54aaaa',
    400: '#339999',
    500: '#008080',
    600: '#007474',
    700: '#005b5b',
    800: '#004646',
    900: '#003636'
  }

  const theme = createTheme({
    typography: {
      fontFamily:
        themeConfig.font ||
        ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(',')
    },
    palette: {
      common: {
        black: '#000',
        white: '#FFF'
      },
      mode: mode,
      primary: {
        main:
          themeConfig?.primary || mode === 'light' ? teal['500'] : '#18A5A5',
        contrastText: '#FFF'
      },
      secondary: {
        main:
          themeConfig?.secondary || mode === 'light' ? '#5B5B5B' : '#B2B2B2',
        contrastText: '#FFF'
      },
      text: {
        primary: mode === 'light' ? '#1A1A1A' : '#F2F2F2',
        secondary: mode === 'light' ? '#595959' : '#B2B2B2',
        disabled: mode === 'light' ? '#A6A6A6' : '#737373',
        border: mode === 'light' ? '#00000033' : '#FFFFFF4D'
      },
      toasttext: {
        primary:
          mode === 'light'
            ? notificationSettings?.invertTheme
              ? '#F2F2F2'
              : '#1A1A1A'
            : notificationSettings?.invertTheme
            ? '#1A1A1A'
            : '#F2F2F2',
        secondary:
          mode === 'light'
            ? notificationSettings?.invertTheme
              ? '#B2B2B2'
              : '#595959'
            : notificationSettings?.invertTheme
            ? '#595959'
            : '#B2B2B2',
        disabled: mode === 'light' ? '#A6A6A6' : '#737373',
        border: mode === 'light' ? '#00000033' : '#FFFFFF4D'
      },
      divider: `rgba(${mainColor}, 0.12)`,
      background: {
        paper:
          mode === 'light'
            ? themeConfig?.lightBackground || '#FCFCFC'
            : themeConfig?.darkBackground || '#1a1a1a',
        inverted:
          mode === 'dark'
            ? themeConfig?.lightBackground || '#FCFCFC'
            : themeConfig?.darkBackground || '#1a1a1a',
        default: defaultBgColor(),
        configBackground:
          mode === 'light'
            ? themeConfig?.lightConfigBackground || '#FCFCFC'
            : themeConfig?.darkConfigBackground || '#1a1a1a',
        configSection:
          mode === 'light'
            ? themeConfig?.lightConfigSectionBackground || '#FCFCFC'
            : themeConfig?.darkConfigSectionBackground || '#0D0D0D'
      },
      inverted: {
        paper:
          mode === 'dark'
            ? themeConfig?.lightBackground || '#FCFCFC'
            : themeConfig?.darkBackground || '#1a1a1a',
        default: defaultBgColor()
      },
      action: {
        active: `rgba(${mainColor}, 0.54)`,
        hover: `rgba(${mainColor}, 0.04)`,
        selected: `rgba(${mainColor}, 0.08)`,
        disabled: `rgba(${mainColor}, 0.3)`,
        focus: `rgba(${mainColor}, 0.12)`
      },
      chip: {
        background: themeConfig?.primary
          ? `${hexToRGBA(themeConfig?.primary, 0.8)}`
          : hexToRGBA(mode === 'light' ? teal['500'] : '#18A5A5', 0.8)
      }
    }
  })
  return (
    <ThemeProvider theme={theme}>
      <NotificationHomeWrapper {...props} />
      <Toaster
        position={notificationSettings?.toastPosition || 'top-right'}
        toastOptions={{
          duration: notificationSettings?.duration || 5000,
          style: {
            background: notificationSettings?.invertTheme
              ? theme.palette.inverted.paper
              : theme.palette.background.paper,
            color: notificationSettings?.invertTheme
              ? theme.palette.inverted.paper
              : theme.palette.background.paper
          }
        }}
      />
    </ThemeProvider>
  )
}

export const FynoToast = (config) => (
  <Toaster {...config} reverseOrder={false} />
)
