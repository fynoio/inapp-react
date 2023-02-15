import React from 'react'
import toast from 'react-hot-toast'

import { LibraryBooks } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Divider, Grid, Tab, Typography, useTheme } from '@mui/material'
import { useNotificationsHomeContext } from '../../context'

import NotificationsList from '../NotificationsList'

const DocumentComponent = ({ docType = 'txt' }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const temp = {
    pdf: {
      iconColor: isDarkMode ? 'rgba(172, 82, 82, 1)' : 'rgba(212, 121, 121, 1)',
      background: isDarkMode ? 'rgba(172, 82, 82, 0.2)' : 'rgba(218, 118, 118, 0.15)',
      title: 'PDF'
    },
    xlsx: {
      iconColor: isDarkMode ? 'rgba(51, 143, 104, 1)' : 'rgba(85 ,149 ,121,1)',
      background: isDarkMode ? 'rgba(51, 143, 104, 0.2)' : 'rgba(69, 125, 101, 0.15)',
      title: 'XLSX'
    },
    xls: {
      iconColor: isDarkMode ? 'rgba(51, 143, 104, 1)' : 'rgba(85, 149, 121, 1)',
      background: isDarkMode ? 'rgba(51, 143, 104, 0.2)' : 'rgba(69, 125, 101, 0.15)',
      title: 'XLS'
    },
    docx: {
      iconColor: isDarkMode ? 'rgba(106, 159, 205, 1)' : 'rgba(101, 162, 219, 1)',
      background: isDarkMode ? 'rgba(106, 159, 205, 0.2)' : 'rgba(123, 175, 225, 0.15)',
      title: 'DOCX'
    },
    doc: {
      iconColor: isDarkMode ? 'rgba(106, 159, 205, 1)' : 'rgba(101, 162, 219, 1)',
      background: isDarkMode ? 'rgba(106, 159, 205, 0.2)' : 'rgba(123, 175, 225, 0.15)',
      title: 'DOC'
    },
    txt: {
      iconColor: isDarkMode ? 'rgba(185, 168, 75, 1)' : 'rgba(201, 184, 91, 1)',
      background: isDarkMode ? 'rgba(185, 168, 75, 0.2)' : 'rgba(206, 192, 116, 0.15)',
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
      <Typography sx={{ fontSize: '0.6rem' }}>{temp[docType]?.title || docType.toUpperCase()}</Typography>
    </Box>
  )
}

const ActionsComponent = ({ item, t, socketInstance }) => {
  const buttons = item?.notification_content?.buttons
  const data = item

  if (buttons?.length > 0) {
    return (
      <Grid container flexDirection='row-reverse' justifyContent='flex-end' sx={{ gap: 1, mt: 1, ml: 5 }}>
        {buttons.map((item, index) => {
          const newTab = item?.isNewTab || true
          if (item?.primary === false || item?.primary === undefined) {
            return (
              <a
                key={item + index}
                onClick={() => {
                  toast.dismiss(t.id)
                  socketInstance.emit('message:read', data)
                }}
                target={!newTab ? '_self' : '_blank'}
                href={`${item?.action}`}
                rel='noopener noreferrer'
                style={{textDecoration: 'none'}}
              >
                <Button
                  disableElevation
                  variant={'outlined'}
                  onClick={() => toast.dismiss(t.id)}
                  size='small'
                  sx={{ fontSize: '0.5rem' }}
                >
                  {item?.label}
                </Button>
              </a>
            )
          } else if (item?.primary === true) {
            return (
              <a
                key={item + index}
                target={!newTab ? '_self' : '_blank'}
                href={`${item?.action}`}
                rel='noopener noreferrer'
                style={{textDecoration: 'none'}}
              >
                <Button
                  disableElevation
                  variant={'contained'}
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
  }
}

const AttachmentComponent = ({ type, attachmentsObject, showBlur }) => {
  const attachment = attachmentsObject?.attachment || ''
  const isDocument = attachmentsObject?.type === 'Document' || false
  const docType = isDocument ? attachment?.substring(attachment.lastIndexOf('.') + 1) : null

  switch (type) {
    case 'Image':
      return <img alt='image' src={attachment} width='50rem' height='50rem' style={{ borderRadius: 5 }} />
    case 'Video':
      return <video src={attachment} width='50rem' height='50rem' style={{ borderRadius: 5 }} />
    case 'Document':
      return <DocumentComponent docType={docType} showBlur={showBlur} />
    default:
      return
  }
}

const MainBody = ({ body, title }) => {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'justify' }}>
      <Box>
        <Typography fontSize={'0.85rem'} fontWeight={600} color={theme.palette.text.primary}>
          {title}
        </Typography>
        <Typography fontSize={'0.7rem'} fontWeight={200} color={theme.palette.text.primary}>
          {body}
        </Typography>
      </Box>
    </Box>
  )
}

export const ToastStructure = ({ msg, t, socketInstance,logo }) => {
  const title = msg?.notification_content?.title
  const body = msg?.notification_content?.body
  const type = msg?.notification_content?.attachments?.type
  const attachmentsObject = msg?.notification_content?.attachments
  const icon = msg?.notification_content?.icon || logo
  const link = msg?.notification_content?.action?.href
  const newTab = msg?.notification_content?.action?.isNewTab || true

  return (
    <a
      target={newTab ? '_blank' : '_self'}
      onClick={() => {
        toast.dismiss(t.id)
        socketInstance.emit('message:read', msg)
      }}
      href={`${link}`}
      rel='noopener noreferrer'
      style={{textDecoration: 'none', width: '100%'}}
    >
      <Grid container spacing={0} alignItems='center'>
        <Grid item xs={1.5} justifyContent='center' alignItems={'center'}>
          <img src={icon} width='30px' height='30px' style={{borderRadius: '4px'}}/>
        </Grid>
        <Grid item xs={8}>
          <MainBody title={title} body={body} />
        </Grid>
        <Grid item xs={2.5}>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}
          >
            <AttachmentComponent type={type} attachmentsObject={attachmentsObject} />
          </Box>
        </Grid>
        <ActionsComponent item={msg} t={t} socketInstance={socketInstance} />
      </Grid>
    </a>
  )
}

export const NotificationsTabs = () => {
  const {
    data: { tabPanelValue },
    handlers: { handleChangeTabs }
  } = useNotificationsHomeContext()

  return (
    <TabContext value={tabPanelValue}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TabList variant='standard' onChange={handleChangeTabs}>
          <Tab disableRipple={true} value='all' label='All' />
          <Tab disableRipple={true} value='unread' label='Unread' />
        </TabList>
      </Box>
      <Divider sx={{ mt: 0, mb: 0 }} />
      <TabPanel value='all' sx={{ p: 0 }}>
        <NotificationsList filter={false} />
      </TabPanel>
      <TabPanel value='unread' sx={{ p: 0 }}>
        <NotificationsList filter={true} />
      </TabPanel>
    </TabContext>
  )
}

export default NotificationsTabs
