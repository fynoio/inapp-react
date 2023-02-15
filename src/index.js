import { Toaster } from 'react-hot-toast';
import NotificationHomeWrapper from './notifications/components/notificationsHomeWrapper'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import './styles.module.css';

export const FynoInappCenter = ({mode, user, workspace, signature, themeConfig, notificationSettings}) => {
  const lightColor = '58, 53, 65'
  const darkColor = '231, 227, 252'
  const mainColor = mode === 'light' ? themeConfig?.lightColor || lightColor : themeConfig?.darkColor || darkColor

  const defaultBgColor = () => {
   if (mode === 'light') {
      return '#F4F5FA'
    } else return '#231F37'
  }
  const theme = createTheme({
    palette: {
      common: {
        black: '#000',
        white: '#FFF'
      },
      mode: mode,
      primary: {
        main: themeConfig?.primary || '#9155FD',
        contrastText: '#FFF'
      },
      secondary: {
        main: themeConfig?.secondary || '#AAA6BF',
        contrastText: '#FFF'
      },
      text: {
        primary: mode === 'light' ? '#474550' : '#E8E4FC',
        secondary: mode === 'light' ? '#5A5761' : '#AAA6BF',
        disabled: mode === 'light' ? '#ADACB4' : '#84818F',
        border: mode === 'light' ? '#C8C7CA' : '#8782A0'
      },
      divider: `rgba(${mainColor}, 0.12)`,
      background: {
        paper: mode === 'light' ? themeConfig?.lightBackground || '#FFF' : themeConfig?.darkBackground ||  '#3B345D',
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
        background: themeConfig?.primary ? `${themeConfig?.primary}2F` : '#9155FD2F'
      }
    }
  });
  return (
    <ThemeProvider theme={theme}>
        <NotificationHomeWrapper user={user} workspace={workspace} signature={signature} logo={themeConfig?.logo}/>
        <Toaster position={notificationSettings?.toastPosition || "top-right"} toastOptions={{
          duration: notificationSettings?.duration || 5000,
          style: { width:"100%", background: theme.palette.background.paper }
        }}/>
    </ThemeProvider>
  )
}

export const FynoToast = (config) => (<Toaster {...config} reverseOrder={false} />)