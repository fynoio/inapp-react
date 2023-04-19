import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import socketIO from 'socket.io-client'

import { ToastStructure } from '../components/NotificationsTabs'
import { useTheme } from '@mui/material'
import useSound from 'use-sound'

export const NotificationsHomeContext = React.createContext()

export const useNotificationsHomeContext = () =>
  useContext(NotificationsHomeContext)

export const NotificationsHomeProvider = ({
  user,
  workspace,
  integration,
  signature,
  logo,
  sound,
  overrideInappUrl,
  children
}) => {
  const [close, setClose] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [list, setList] = useState([])
  const [unreadList, setUnreadList] = useState([])
  const [socketInstance, setSocketInstance] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [tabPanelValue, setTabPanelValue] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)
  const [count, setCount] = useState(0)
  const theme = useTheme()
  const [toastData, setToastData] = useState({})
  const brandLogo = logo
  const [play] = useSound(sound)
  const resetState = () => {
    setErrMsg('')
    setList([])
    setCount(0)
    setUnreadCount(0)
  }
  const [anchorDeleteEl, setAnchorDeleteEl] = useState(false)

  const openDeleteDialog = Boolean(anchorDeleteEl)

  const handleChangeStatus = (status) => {
    if (status.status === 'DELETED') {
      setList((prev) => prev.filter((msg) => msg._id !== status.messageId))
      setCount((prev) => prev - 1)
      if (!status?.isRead) {
        setUnreadCount((prev) => prev - 1)
      }
    } else if (status.status === 'READ') {
      setList((prev) => {
        const message = prev.find((msg) => msg._id === status.messageId)
        if (message) {
          message?.status.push(status)
          message.isRead = true
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

  useEffect(() => {
    if (anchorEl === null && JSON.stringify(toastData) !== '{}') {
      handleToast(toastData, socketInstance)
      setToastData({})
    }
  }, [toastData])

  useEffect(() => {
    const inappUrl = overrideInappUrl
      ? overrideInappUrl
      : 'https://inapp.fyno.io'
    const socket = socketIO(inappUrl, {
      auth: {
        user_id: user,
        WS_ID: workspace,
        Integration_ID: integration
      },
      extraHeaders: {
        'x-fyno-signature': signature
      }
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
      setToastData(data)
      handleIncomingMessage(data)
    })
    socket.on('messages:state', (data) => {
      data.filter === 'all'
        ? setList((prev) => {
            if (data.messages.messages?.length > 0 && data?.page > 1) {
              return prev.concat(data.messages.messages)
            } else {
              return data.messages.messages
            }
          })
        : setUnreadList((prev) => {
            if (data.messages.messages?.length > 0 && data?.page > 1) {
              return prev.concat(data.messages.messages)
            } else {
              return data.messages.messages
            }
          })
      setUnreadCount(data.messages.unread)
      setCount(data.messages.total)
    })
    socket.on('statusUpdated', (status) => {
      handleChangeStatus(status)
    })
    socket.on('lastSeenUpdated', (time) => {
      localStorage.setItem('fynoinapp_ls', time)
    })
    socket.on('disconnect', (err) => {
      setErrMsg(err.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    setUnreadList(list?.filter((msg) => !msg?.isRead))
  }, [JSON.stringify(list)])

  const loadMoreNotifications = (page, type) => {
    if (socketInstance) {
      socketInstance.emit('get:messages', { filter: type, page: page })
    }
  }

  const handleChangeTabs = (event, value) => {
    setTabPanelValue(value)
    // loadMoreNotifications('1', value)
  }

  const handleClickDelete = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setAnchorDeleteEl(!anchorDeleteEl)
  }

  const deleteAllMessages = (e) => {
    e.stopPropagation()
    e.preventDefault()
    socketInstance.emit('markAll:delete', signature)
    setUnreadCount(0)
    handleClickDelete()
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
    setShowConfig(!showConfig)
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
    if (sound) {
      play()
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
      openDeleteDialog
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
      handleMarkAllAsRead
    }
  }

  return (
    <NotificationsHomeContext.Provider value={contextValue}>
      {children}
    </NotificationsHomeContext.Provider>
  )
}
