/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import socketIO from 'socket.io-client'
import { ToastStructure } from '../components/NotificationsTabs'
import { debounce, useTheme, Typography } from '@mui/material'
import useSound from 'use-sound'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

export const NotificationsHomeContext = React.createContext()

export const useNotificationsHomeContext = () =>
  useContext(NotificationsHomeContext)

// Utility function for handling status updates
const updateMessageStatus = (messages, status) => {
  return messages
    .map((msg) => {
      if (msg._id === status.messageId) {
        if (status.status === 'DELETED') {
          return null
        }
        if (status.status === 'READ') {
          msg.isRead = true
        }
        msg.status.push(status)
      }
      return msg
    })
    .filter(Boolean)
}

// Helper function to update lists based on page and filter
const updateListByPage = (prev, data) => {
  return data.page > 2
    ? [...prev, ...data.messages.messages]
    : data.messages.messages
}

export const NotificationsHomeProvider = ({ children, ...props }) => {
  const {
    user = '',
    workspace = '',
    integration = '',
    signature = '',
    themeConfig = {},
    globalChannels = [],
    notificationSettings = {},
    onMessageRecieved = null,
    onMessageClicked = null,
    overrideInappUrl = 'https://inapp.fyno.io'
  } = props

  const [isSeen, setIsSeen] = useState(true)
  const [userPreference, setUserPreference] = useState({})
  const [resetPreference, setResetPreference] = useState({})
  const [showBranding, setShowBranding] = useState(true)
  const [close, setClose] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [list, setList] = useState([])
  const [unreadList, setUnreadList] = useState([])
  const [socketInstance, setSocketInstance] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [tabPanelValue, setTabPanelValue] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [showLoader, setShowLoader] = useState(0)
  const [toastData, setToastData] = useState({})
  const [openConfigUnsaved, setOpenConfigUnsaved] = useState(false)
  const [globalChannelPreference, setGlobalChannelPreference] = useState(
    globalChannels?.reduce((acc, curr) => {
      acc[curr] = false
      return acc
    }, {}) || {}
  )
  const [resetGlobalChannelPreference, setResetGlobalChannelPreference] =
    useState(cloneDeep(globalChannelPreference))
  const [updatedPreference, setUpdatedPreference] = useState({})

  const theme = useTheme()
  const brandLogo = themeConfig.logo || ''

  const notificationCenterConfig = useMemo(
    () =>
      themeConfig.notification_center || {
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'left' }
      },
    [themeConfig]
  )

  const notificationCenterPosition = themeConfig.position || 'default'
  const notificationCenterOffset = themeConfig.offset || 0
  const preferenceMode = themeConfig.preference_mode || 'none'

  const soundEnabled = notificationSettings.sound
    ? useSound(notificationSettings.sound)[0]
    : null

  // Reset function expanded to reset all state variables
  const resetState = () => {
    setErrMsg('')
    setList([])
    setUnreadList([])
    setCount(0)
    setUnreadCount(0)
    setToastData({})
    setShowLoader(0)
  }
  const [anchorDeleteEl, setAnchorDeleteEl] = useState(false)

  const handleChangeStatus = (status) => {
    setList((prev) => updateMessageStatus(prev, status))
    if (status.status === 'DELETED') {
      setCount((prev) => prev - 1)
      if (!status.isRead) {
        setUnreadCount((prev) => prev - 1)
      }
    } else if (status.status === 'READ') {
      setUnreadList((prev) =>
        prev.filter((msg) => msg._id !== status.messageId)
      )
      setUnreadCount((prev) => prev - 1)
    }
    if (onMessageClicked) {
      onMessageClicked(status.status, status.messageId)
    }
  }

  const resetLoader = debounce(() => {
    setShowLoader(0)
  }, 100)

  useEffect(() => {
    if (!anchorEl && Object.keys(toastData).length > 0) {
      handleToast(toastData, socketInstance)
      setToastData({})
    }
  }, [toastData, anchorEl, socketInstance])

  useEffect(() => {
    const inappUrl = overrideInappUrl || 'https://inapp.fyno.io'
    const socket = socketIO(inappUrl, {
      transports: ['polling', 'websocket'],
      auth: {
        user_id: user,
        WS_ID: workspace,
        Integration_ID: integration,
        'x-fyno-signature': signature
      },
      extraHeaders: {
        'x-fyno-signature': signature,
        cookie: `x-fyno-cookie=${signature}`
      },
      withCredentials: true
    })

    socket.on('connect_error', (err) => setErrMsg(err.message))

    socket.on('connectionSuccess', (data) => {
      resetState()
      setShowBranding(data?.config?.branding ?? true)
      setSocketInstance(socket)
      socket.emit('get:messages', { filter: 'all', page: 1 })
    })

    socket.on('message', (data) => {
      socket.emit('message:recieved', { id: data._Id })
      if (!data?.notification_content?.silent_message) {
        setToastData(data)
        handleIncomingMessage(data)
      }
      if (onMessageRecieved) {
        onMessageRecieved(data)
      }
    })

    socket.on('messages:state', (data) => {
      if (data.filter === 'all') {
        setList((prev) => updateListByPage(prev, data))
      } else {
        setUnreadList((prev) => updateListByPage(prev, data))
      }
      setUnreadCount(data.messages.unreadCount)
      setCount(data.messages.total)
      setPage(data.page)
      setShowLoader(100)
      resetLoader()
    })

    socket.on('statusUpdated', handleChangeStatus)

    socket.on('lastSeenUpdated', setIsSeen)

    socket.on('tag:updated', (id) => {
      setList((prev) => {
        const updatedList = prev.filter((item) => item._id !== id)
        setUnreadCount((prevCount) => prevCount - 1)
        setCount((prevCount) => prevCount - 1)
        return updatedList
      })
    })

    socket.on('disconnect', (err) => setErrMsg(err.message))

    socket.on('preferences:state', (preference) => {
      setUserPreference(preference)
      let newPref
      setGlobalChannelPreference((prev) => {
        if (!preference.result) return prev
        else {
          newPref = Object.entries(preference.result)?.reduce((acc, curr) => {
            curr[1].map((value) => {
              if (!value.is_global_opted_out) return acc
              else {
                acc = { ...acc, ...value.is_global_opted_out }
              }
            })
            return acc
          }, prev)
          setResetGlobalChannelPreference(cloneDeep(newPref))
          return newPref
        }
      })
      setResetPreference(cloneDeep(preference))
      setUpdatedPreference({})
      setShowConfig((val) => !val)
      setOpenConfigUnsaved(false)
    })

    socket.on('preference:update', () => {
      toast.success(
        () => (
          <Typography sx={{ color: theme.palette.text.primary }}>
            Channel preference updated
          </Typography>
        ),
        {
          position: 'top-center',
          duration: 2000,
          style: {
            color: theme.palette.toasttext.primary
          }
        }
      )
      socket.emit('get:preference')
    })

    return () => {
      socket.disconnect()
    }
  }, [
    user,
    workspace,
    integration,
    signature,
    overrideInappUrl,
    onMessageRecieved
  ])

  useEffect(() => {
    setUnreadList(list.filter((msg) => !msg.isRead))
  }, [list])

  useEffect(() => {
    if (!anchorEl && socketInstance) {
      socketInstance.emit('get:messages', { filter: tabPanelValue, page: 1 })
    }
  }, [anchorEl, tabPanelValue, socketInstance])

  const loadMoreNotifications = (page, type) => {
    if (socketInstance) {
      setShowLoader(Math.floor(Math.random() * 31) + 30)
      socketInstance.emit('get:messages', { filter: type, page })
    }
  }

  const handleChangeTabs = (event, value) => {
    setTabPanelValue(value)
  }

  const handleClickDelete = (e) => {
    e?.stopPropagation()
    e?.preventDefault()
    setAnchorDeleteEl(!anchorDeleteEl)
  }

  const deleteAllMessages = (e) => {
    e?.stopPropagation()
    e?.preventDefault()
    setAnchorDeleteEl(false)
    socketInstance.emit('markAll:delete', signature)
    setUnreadCount(0)
  }

  const handleMarkAllAsRead = () => {
    socketInstance.emit('markAll:read', signature)
    setUnreadCount(0)
  }

  const handleClosePanel = () => {
    setAnchorEl(null)
  }

  const handleOpenPanel = (event) => {
    socketInstance.emit('updateLastSeen')
    setAnchorEl(event.currentTarget)
  }

  const handleOpenConfig = () => {
    socketInstance?.emit('get:preference')
  }

  const handleIncomingMessage = (message) => {
    setList((prev) => [{ ...message, isRead: false }, ...prev])
    setCount((prev) => prev + 1)
    setUnreadCount((prev) => prev + 1)
  }

  const handleDelete = (msg) => {
    socketInstance.emit('message:deleted', msg)
  }

  const handleMarkAsRead = (msg) => {
    socketInstance.emit('message:read', msg)
  }

  // Add validation to ensure required fields exist before proceeding
  const handleToast = (data, socket) => {
    if (!data?.notification_content) {
      console.error('Invalid toast data')
      return
    }
    if (soundEnabled) {
      soundEnabled()
    }
    if (data.notification_content.notify_tag_update) {
      toast((t) => (
        <ToastStructure
          t={t}
          msg={data}
          socketInstance={socket}
          logo={brandLogo}
          close={close}
          onMouseEnter={() => setClose(true)}
          onMouseLeave={() => setClose(false)}
        />
      ))
    }
  }

  const contextValue = useMemo(
    () => ({
      data: {
        brandLogo,
        anchorEl,
        showConfig,
        tabPanelValue,
        unreadCount,
        socketInstance,
        list,
        unreadList,
        count,
        errMsg,
        close,
        openDeleteDialog: Boolean(anchorDeleteEl),
        header: themeConfig?.header,
        page,
        showLoader,
        notificationCenterPosition,
        notificationCenterOffset,
        userPreference,
        openConfigUnsaved,
        resetPreference,
        preferenceMode,
        showBranding,
        isSeen,
        globalChannelPreference,
        updatedPreference,
        notificationCenterConfig,
        resetGlobalChannelPreference
      },
      handlers: {
        handleClosePanel,
        handleOpenPanel,
        handleOpenConfig,
        handleChangeTabs,
        handleIncomingMessage,
        handleMarkAsRead,
        handleDelete,
        loadMoreNotifications,
        setClose,
        handleClickDelete,
        deleteAllMessages,
        handleMarkAllAsRead,
        setUserPreference,
        setShowConfig,
        setOpenConfigUnsaved,
        setResetPreference,
        setGlobalChannelPreference,
        setUpdatedPreference,
        setResetGlobalChannelPreference
      }
    }),
    [
      brandLogo,
      anchorEl,
      showConfig,
      tabPanelValue,
      unreadCount,
      socketInstance,
      list,
      unreadList,
      count,
      errMsg,
      close,
      anchorDeleteEl,
      themeConfig.header,
      page,
      showLoader,
      notificationCenterPosition,
      notificationCenterOffset,
      userPreference,
      openConfigUnsaved,
      resetPreference,
      preferenceMode,
      showBranding,
      isSeen,
      globalChannelPreference,
      updatedPreference,
      notificationCenterConfig,
      resetGlobalChannelPreference
    ]
  )

  return (
    <NotificationsHomeContext.Provider value={contextValue}>
      {children}
    </NotificationsHomeContext.Provider>
  )
}
