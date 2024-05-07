/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import socketIO from 'socket.io-client'

import { ToastStructure } from '../components/NotificationsTabs'
import { debounce, useTheme } from '@mui/material'
import useSound from 'use-sound'

export const NotificationsHomeContext = React.createContext()

export const useNotificationsHomeContext = () =>
  useContext(NotificationsHomeContext)

export const NotificationsHomeProvider = ({ children, ...props }) => {
  const {
    user,
    workspace,
    integration,
    signature,
    themeConfig,
    notificationSettings,
    onMessageRecieved,
    onMessageClicked,
    overrideInappUrl
  } = props
  const [userPreference, setUserPreference] = useState({})
  const { logo, header, position, offset, preference_mode } = themeConfig
  const [resetPreference, setResetPreference] = useState({})

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
  const [notificationCenterPosition] = useState(position || 'default')
  const [notificationCenterOffset] = useState(offset || 0)
  const [preferenceMode] = useState(preference_mode || 'modal')
  const [openConfigUnsaved, setOpenConfigUnsaved] = useState(false)
  const brandLogo = logo
  var soundEnabled = null
  if (notificationSettings && notificationSettings.sound) {
    const [play] = useSound(notificationSettings.sound)
    soundEnabled = play
  }
  const resetState = () => {
    setErrMsg('')
    setList([])
    setCount(0)
    setUnreadCount(0)
  }
  const [anchorDeleteEl, setAnchorDeleteEl] = useState(false)

  const openDeleteDialog = Boolean(anchorDeleteEl)
  const theme = useTheme()
  const handleChangeStatus = (status) => {
    if (status.status === 'DELETED') {
      setList((prev) => prev.filter((msg) => msg._id !== status.messageId))
      setCount((prev) => prev - 1)
      if (!status?.isRead) {
        setUnreadCount((prev) => prev - 1)
        if (onMessageClicked) {
          onMessageClicked('DELETED', status.messageId)
        }
      }
    } else if (status.status === 'READ') {
      setList((prev) => {
        const message = prev.find((msg) => msg._id === status.messageId)
        if (message) {
          // eslint-disable-next-line no-unused-expressions
          message?.status.push(status)
          message.isRead = true
          if (onMessageClicked) {
            onMessageClicked('READ', message)
          }
        }
        return prev
      })
      setUnreadList((prev) =>
        prev.filter((msg) => msg._id !== status.messageId)
      )
      setUnreadCount((prev) => prev - 1)
    } else {
      setList((prev) => {
        prev.find((msg) => msg._id === status.messageId).status.push(status)
        return prev
      })
    }
  }

  const resetLoader = debounce(() => {
    setShowLoader(0)
  }, [100])

  useEffect(() => {
    if (anchorEl === null && JSON.stringify(toastData) !== '{}') {
      handleToast(toastData, socketInstance)
      setToastData({})
    }
  }, [toastData])

  useEffect(() => {
    const inappUrl = overrideInappUrl || 'https://inapp.fyno.io'
    const socket = socketIO(inappUrl, {
      transports: ['polling', 'websocket'],
      auth: {
        user_id: user,
        WS_ID: workspace,
        Integration_ID: integration
      },
      extraHeaders: {
        'x-fyno-signature': signature,
        cookie: `x-fyno-cookie=${signature}`
      },
      withCredentials: true
    })
    socket.on('connect_error', (err) => {
      setErrMsg(err.message)
    })
    socket.on('connectionSuccess', (data) => {
      resetState()
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
      data.filter === 'all'
        ? setList((prev) => {
            if (data.messages.messages?.length > 0 && data?.page > 2) {
              return prev.concat(data.messages.messages)
            } else {
              return data.messages.messages
            }
          })
        : setUnreadList((prev) => {
            if (data.messages.messages?.length > 0 && data?.page > 2) {
              return prev.concat(data.messages.messages)
            } else {
              return data.messages.messages
            }
          })
      setUnreadCount(data.messages.unreadCount)
      setCount(data.messages.total)
      setPage(data.page)
      setShowLoader(100)
      resetLoader()
    })
    socket.on('statusUpdated', (status) => {
      handleChangeStatus(status)
    })
    socket.on('lastSeenUpdated', (time) => {
      // eslint-disable-next-line no-undef
      localStorage.setItem('fynoinapp_ls', time)
    })
    socket.on('tag:updated', (id) => {
      var id_done = ''

      setList((prev) => {
        var prevMessage = prev.filter((item) => item._id === id)
        if (
          id_done !== id &&
          !new RegExp(/"READ"/).test(JSON.stringify(prevMessage[0]?.status))
        ) {
          setUnreadCount((prev) => prev - 1)
          id_done = id
        }
        return prev.filter((item) => item._id !== id)
      })
      setCount((prev) => prev - 1)
    })
    socket.on('disconnect', (err) => {
      setErrMsg(err.message)
    })

    socket.on('preferences:state', (preference) => {
      setUserPreference(preference)
      setShowConfig(!showConfig)
    })

    socket.on('preference:update', () => {
      toast.success('Channel preference updated', {
        position: 'top-right',
        duration: 2000,
        style: {
          color: theme.palette.text
        }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    setUnreadList(list?.filter((msg) => !msg?.isRead))
  }, [JSON.stringify(list)])

  useEffect(() => {
    if (!anchorEl && socketInstance) {
      socketInstance.emit('get:messages', { filter: tabPanelValue, page: 1 })
    }
  }, [anchorEl])

  const loadMoreNotifications = (page, type) => {
    if (socketInstance) {
      setShowLoader(Math.floor(Math.random() * 31) + 30)
      socketInstance.emit('get:messages', { filter: type, page: page })
    }
  }

  const handleChangeTabs = (event, value) => {
    setTabPanelValue(value)
    // loadMoreNotifications('1', value)
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
    setAnchorEl(event.currentTarget)
  }

  const handleOpenConfig = () => {
    socketInstance?.emit('get:preference')
  }

  const handleClick = () => {}

  const handleIncomingMessage = (message) => {
    message.isRead = false
    setList((prev) => {
      return [message, ...prev]
    })
    setCount((prev) => prev + 1)
    setUnreadCount((prev) => prev + 1)
  }

  const handleDelete = (msg) => {
    socketInstance.emit('message:deleted', msg)
  }

  const handleMarkAsRead = (msg) => {
    socketInstance.emit('message:read', msg)
  }

  const handleToast = (data, socket) => {
    if (notificationSettings && notificationSettings.sound) {
      soundEnabled()
    }
    toast((t) => (
      <ToastStructure
        t={t}
        msg={data}
        socketInstance={socket}
        logo={logo}
        close={close}
        onMouseEnter={() => {
          setClose(true)
        }}
        onMouseLeave={() => {
          setClose(false)
        }}
      />
    ))
  }

  const contextValue = {
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
      openDeleteDialog,
      header,
      page,
      showLoader,
      notificationCenterPosition,
      notificationCenterOffset,
      userPreference,
      openConfigUnsaved,
      resetPreference,
      preferenceMode
    },
    handlers: {
      handleClosePanel,
      handleOpenPanel,
      handleOpenConfig,
      handleChangeTabs,
      handleClick,
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
      setResetPreference
    }
  }

  return (
    <NotificationsHomeContext.Provider value={contextValue}>
      {children}
    </NotificationsHomeContext.Provider>
  )
}
