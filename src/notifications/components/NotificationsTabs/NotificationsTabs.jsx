/* eslint-disable camelcase */
import React from 'react'
import toast from 'react-hot-toast'
import parse from 'html-react-parser'

import {
  LibraryBooks,
  DoneAll,
  DeleteSweepOutlined,
  Close,
  Settings
} from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  Divider,
  Grid,
  Tab,
  Typography,
  useTheme,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material'
import { useNotificationsHomeContext } from '../../context'

import NotificationsList from '../NotificationsList'
import { hexToRGBA } from '../../helpers/hextoRGBA'

const DocumentComponent = ({ docType = 'txt' }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const temp = {
    pdf: {
      iconColor: isDarkMode ? 'rgba(172, 82, 82, 1)' : 'rgba(212, 121, 121, 1)',
      background: isDarkMode
        ? 'rgba(172, 82, 82, 0.2)'
        : 'rgba(218, 118, 118, 0.15)',
      title: 'PDF'
    },
    xlsx: {
      iconColor: isDarkMode ? 'rgba(51, 143, 104, 1)' : 'rgba(85 ,149 ,121,1)',
      background: isDarkMode
        ? 'rgba(51, 143, 104, 0.2)'
        : 'rgba(69, 125, 101, 0.15)',
      title: 'XLSX'
    },
    xls: {
      iconColor: isDarkMode ? 'rgba(51, 143, 104, 1)' : 'rgba(85, 149, 121, 1)',
      background: isDarkMode
        ? 'rgba(51, 143, 104, 0.2)'
        : 'rgba(69, 125, 101, 0.15)',
      title: 'XLS'
    },
    docx: {
      iconColor: isDarkMode
        ? 'rgba(106, 159, 205, 1)'
        : 'rgba(101, 162, 219, 1)',
      background: isDarkMode
        ? 'rgba(106, 159, 205, 0.2)'
        : 'rgba(123, 175, 225, 0.15)',
      title: 'DOCX'
    },
    doc: {
      iconColor: isDarkMode
        ? 'rgba(106, 159, 205, 1)'
        : 'rgba(101, 162, 219, 1)',
      background: isDarkMode
        ? 'rgba(106, 159, 205, 0.2)'
        : 'rgba(123, 175, 225, 0.15)',
      title: 'DOC'
    },
    txt: {
      iconColor: isDarkMode ? 'rgba(185, 168, 75, 1)' : 'rgba(201, 184, 91, 1)',
      background: isDarkMode
        ? 'rgba(185, 168, 75, 0.2)'
        : 'rgba(206, 192, 116, 0.15)',
      title: 'TXT'
    }
  }

  const boxStyles = {
    width: '50px',
    height: '50px',
    borderRadius: 1,
    background: temp[docType]?.background || theme.palette.action.selected,
    color: temp[docType]?.iconColor || theme.palette.action.active,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <Box sx={{ ...boxStyles }}>
      <LibraryBooks fontSize='small' />
      <Typography sx={{ fontSize: '0.6rem' }}>
        {temp[docType]?.title || docType.toUpperCase()}
      </Typography>
    </Box>
  )
}

const ActionsComponent = ({ item, t, socketInstance }) => {
  const buttons = item?.notification_content?.buttons
  const data = item

  if (buttons?.length > 0) {
    return (
      <Grid
        container
        flexDirection='row-reverse'
        justifyContent='flex-end'
        sx={{ gap: 1, mt: 1, ml: 5 }}
      >
        {buttons.map((item, index) => {
          const sameTab = item?.sameTab || 'true'
          if (item?.primary === 'false' || item?.primary === undefined) {
            return (
              <a
                key={item + index}
                onClick={(e) => {
                  e.stopPropagation()
                  toast.dismiss(t.id)
                  socketInstance.emit('message:read', data)
                }}
                target={sameTab === 'false' ? '_self' : '_blank'}
                href={`${item?.action}`}
                rel='noopener noreferrer'
                style={{ textDecoration: 'none' }}
              >
                <Button
                  disableElevation
                  variant='outlined'
                  onClick={() => toast.dismiss(t.id)}
                  size='small'
                  sx={{ fontSize: '0.5rem' }}
                >
                  {item?.label}
                </Button>
              </a>
            )
          } else if (item?.primary === 'true') {
            return (
              <a
                key={item + index}
                target={!sameTab ? '_self' : '_blank'}
                href={`${item?.action}`}
                rel='noopener noreferrer'
                style={{ textDecoration: 'none' }}
              >
                <Button
                  disableElevation
                  variant='contained'
                  onClick={() => toast.dismiss(t.id)}
                  size='small'
                  sx={{ fontSize: '0.5rem' }}
                >
                  {item?.label}
                </Button>
              </a>
            )
          }
        })}
      </Grid>
    )
  } else return null
}

const AttachmentComponent = ({ type, attachmentsObject, showBlur }) => {
  const attachment = attachmentsObject?.attachment || ''
  const isDocument = attachmentsObject?.type === 'Document' || false
  const docType = isDocument
    ? attachment?.substring(attachment.lastIndexOf('.') + 1)
    : null

  switch (type) {
    case 'Image':
      return (
        <img
          alt='image'
          src={attachment}
          width='50rem'
          height='50rem'
          style={{ borderRadius: 5 }}
        />
      )
    case 'Video':
      return (
        <video
          src={attachment}
          width='50rem'
          height='50rem'
          style={{ borderRadius: 5 }}
        />
      )
    case 'Document':
      return <DocumentComponent docType={docType} showBlur={showBlur} />
    default:
      return null
  }
}
const preview = (value, list) => {
  if (value) {
    var preview_val = value
    for (const key in list) {
      const regex = new RegExp(key, list[key]?.scope)
      preview_val =
        typeof preview_val === 'string'
          ? preview_val?.replace(regex, list[key]?.with)
          : preview_val?.map((item) => {
              return item?.replace(regex, list[key]?.with)
            })
    }

    const tt_regex =
      /(<tt style="word-wrap: break-word; white-space: pre-wrap; word-break: break-word;">(?:\n|.)+?<\/tt>)/gm

    let m
    const replace = []
    const replace_with = []

    while ((m = tt_regex.exec(preview_val)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === tt_regex.lastIndex) {
        tt_regex.lastIndex++
      }

      const replace_with_temp = m[0]
        .replace(/<i>|<\/i>?/gm, '_')
        .replace(/<b>|<\/b>?/gm, '*')
        .replace(/<s>|<\/s>?/gm, '~')

      if (m[0] !== replace_with_temp) {
        replace.push(m[0])
        replace_with.push(replace_with_temp)
      }
    }
    for (let i = 0; i < replace?.length; i++) {
      preview_val = preview_val.replace(replace[i], replace_with[i])
    }
    return preview_val
  } else {
    return ''
  }
}

const MainBody = ({ body, title }) => {
  const list = {
    '&': {
      scope: 'g',
      with: '&amp;'
    },
    '<': {
      scope: 'g',
      with: '&lt;'
    },
    '>': {
      scope: 'g',
      with: '&gt;'
    },
    '"': {
      scope: 'g',
      with: '&quot;'
    },
    '\n': {
      scope: 'g',
      with: '<br/>'
    },
    '\\*(\\S(?:.*?)\\S|\\S)\\*': {
      scope: 'g',
      with: '<b>$1</b>'
    },
    '\\b_(\\S(?:.*?)\\S|\\S)_\\b': {
      scope: 'g',
      with: '<i>$1</i>'
    },
    '~(\\S(?:.*?)\\S|\\S)~': {
      scope: 'g',
      with: '<s>$1</s>'
    },
    '```((?:\\n|.)*?)```': {
      scope: 'gm',
      with: '<tt style="word-wrap: break-word; white-space: pre-wrap; word-break: break-word;">$1</tt>'
    }
  }
  const theme = useTheme()
  const renderBody = preview(body, list)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        textAlign: 'left',
        wordWrap: 'break-word'
      }}
    >
      <Box>
        <Typography
          fontSize='0.85rem'
          fontWeight={600}
          color={theme.palette.toasttext.primary}
        >
          {title}
        </Typography>
        <Typography
          fontSize='0.7rem'
          fontWeight={200}
          color={theme.palette.toasttext.primary}
        >
          {parse(renderBody)}
        </Typography>
      </Box>
    </Box>
  )
}

export const ToastStructure = ({ msg, t, socketInstance, logo, close }) => {
  const title = msg?.notification_content?.title
  const body = msg?.notification_content?.body
  const type = msg?.notification_content?.attachments?.type
  const attachmentsObject = msg?.notification_content?.attachments
  const attachmentLink = attachmentsObject?.attachment || null
  const icon = msg?.notification_content?.icon || logo
  let link = msg?.notification_content?.action?.href
  let sameTab = msg?.notification_content?.action?.sameTab || 'false'

  if (link && link[0] !== '/') {
    if (!(/^https:/.test(link) || /^http:/.test(link))) {
      if (/[a-zA-Z]\.[a-zA-Z]/.test(link)) {
        link = 'https://' + link
      } else if (link !== '#') {
        link = '/' + link
      } else {
        link = null
        sameTab = 'true'
      }
    }
  } else {
    link = null
    sameTab = 'true'
  }

  return (
    <Box
      target={sameTab === 'false' ? '_blank' : '_self'}
      onClick={(e) => {
        e.stopPropagation()
        toast.dismiss(t.id)
        socketInstance.emit('message:read', msg)
        if (link) window.open(link, sameTab === 'true' ? '_self' : '_blank')
      }}
      style={{ textDecoration: 'none', width: '100%' }}
    >
      <Grid container spacing={0} alignItems='center'>
        <Grid item xs={1.5} justifyContent='center' alignItems='center'>
          <img
            src={icon}
            width='30px'
            height='30px'
            style={{ borderRadius: '4px', objectFit: 'contain' }}
          />
        </Grid>
        <Grid item xs={8}>
          <MainBody title={title} body={body} />
        </Grid>
        <Grid item xs={2.5}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'space-between'
            }}
          >
            <Box
              href={attachmentLink}
              onClick={(e) => {
                e.stopPropagation()
                window.open(attachmentLink, '_blank')
              }}
            >
              <AttachmentComponent
                type={type}
                attachmentsObject={attachmentsObject}
              />
            </Box>
          </Box>
        </Grid>
        <ActionsComponent item={msg} t={t} socketInstance={socketInstance} />
        {close ? (
          <IconButton
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toast.dismiss(t.id)
            }}
            style={{
              position: 'absolute',
              top: '-13%',
              left: '-3%',
              backgroundColor: 'rgba(58, 53, 65, 0.04)'
            }}
            size='small'
          >
            <Close fontSize='small' />
          </IconButton>
        ) : (
          ''
        )}
      </Grid>
    </Box>
  )
}

const Actions = () => {
  const {
    data: { list, unreadList, header },
    handlers: { handleClickDelete, handleMarkAllAsRead, handleOpenConfig }
  } = useNotificationsHomeContext()

  if (list?.length > 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        {unreadList?.length > 0 && (
          <Tooltip title='Mark all as read'>
            <IconButton onClick={(e) => handleMarkAllAsRead(e)}>
              <DoneAll />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title='Delete all'>
          <IconButton onClick={(e) => handleClickDelete(e)}>
            <DeleteSweepOutlined />
          </IconButton>
        </Tooltip>
        {!header && (
          <Tooltip title='Channel preference'>
            <IconButton onClick={(e) => handleOpenConfig()}>
              <Settings fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    )
  }

  return null
}

export const NotificationsTabs = () => {
  const {
    data: { tabPanelValue, unreadCount },
    handlers: { handleChangeTabs }
  } = useNotificationsHomeContext()

  const theme = useTheme()

  return (
    <TabContext value={tabPanelValue}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <TabList
          variant='standard'
          onChange={handleChangeTabs}
          data-testid='noti-center-tabs'
        >
          <Tab disableRipple value='all' label='All' />
          <Tab
            disableRipple
            value='unread'
            label='Unread'
            sx={{ minHeight: 0 }}
            icon={
              <Chip
                size='small'
                className='MuiChip-light'
                sx={{
                  color: theme.palette.primary?.main,
                  backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12)
                }}
                label={unreadCount}
              />
            }
            iconPosition='end'
          />
        </TabList>
        <Actions />
      </Box>
      <Divider sx={{ mt: 0, mb: 0 }} />
      <TabPanel value='all' sx={{ p: 0 }}>
        <NotificationsList filter={false} />
      </TabPanel>
      <TabPanel value='unread' sx={{ p: 0 }}>
        <NotificationsList filter />
      </TabPanel>
    </TabContext>
  )
}

export default NotificationsTabs
