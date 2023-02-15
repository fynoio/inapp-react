import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

import { DeleteOutline, DoneAll, HourglassEmpty, LibraryBooks, MoreHoriz } from '@mui/icons-material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  Menu,
  MenuItem,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useNotificationsHomeContext } from '../../context'
import moment from 'moment'

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
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography fontSize={'0.85rem'} fontWeight={600} color={theme.palette.text.primary}>
          {title}
        </Typography>
        <Typography fontSize={'0.8rem'} fontWeight={200} color={theme.palette.text.primary}>
          {body}
        </Typography>
      </Box>
    </Box>
  )
}

const NotificationFooter = ({ createdAt, msg }) => {
  const theme = useTheme()

  const {
    handlers: { handleMarkAsRead, handleDelete }
  } = useNotificationsHomeContext()

  const [openMenu, setOpenMenu] = useState(false)

  const buttonRef = useRef()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        my: 1,
        pl: { xs: '8%', sm: '10%' }
      }}
      component={'div'}
    >
      <Typography fontSize={'0.7rem'} sx={{ color: theme.palette.secondary.main }}>
        {moment.parseZone(createdAt).fromNow()}
      </Typography>
      <MoreHoriz
        color='secondary'
        ref={buttonRef}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          setOpenMenu(!openMenu)
        }}
        sx={{ cursor: 'pointer', ':hover': { background: theme.palette.action.focus }, borderRadius: 10, zIndex: 50 }}
      />
      <Menu PaperProps={{style: {
        backgroundImage: 'none'
      }}} open={openMenu} anchorEl={buttonRef.current} onClose={(e) => {e.preventDefault();e.stopPropagation();setOpenMenu(false)}}>
        {!msg?.isRead && (
          <Box>
            <MenuItem
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setOpenMenu(false)
                handleMarkAsRead(msg)
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DoneAll fontSize='0.6rem' /> Mark as read
              </Box>
            </MenuItem>
            <Divider />
          </Box>
        )}
        <MenuItem
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            setOpenMenu(false)
            handleDelete(msg)
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, color: theme?.palette?.error?.main }}>
            <DeleteOutline color='error' fontSize='0.6rem' /> Delete
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  )
}

const LinkWrapper = ({ children, link, hover = false, newTab = true, item }) => {
  const theme = useTheme()
  const hasAttachment = link?.length > 0 && hover

  const {
    handlers: { handleMarkAsRead }
  } = useNotificationsHomeContext()

  const [showBlur, setShowBlur] = useState(false)

  const HoverBoxStyles = {
    display: 'flex',
    height: '50px',
    width: '50px',
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: '0%',
    ':hover': { opacity: '100%' },
    color: theme.palette.common.white,
    position: 'absolute'
  }
  return (
    <Link target={!newTab ? '_self' : '_blank'} href={`${link}`} style={{textDecoration:'none'}}>
      <Box onClick={() => handleMarkAsRead(item)} sx={{ position: 'relative' }}>
        {hasAttachment && (
          <Box
            sx={{ ...HoverBoxStyles }}
            onMouseOver={() => {
              setShowBlur(true)
            }}
            onMouseOut={() => {
              setShowBlur(false)
            }}
          >
            <OpenInNewIcon fontSize='small' />
          </Box>
        )}
        <Box
          sx={{
            filter: showBlur ? (theme.palette.mode === 'light' ? 'brightness(50%) blur(1px)' : 'blur(1px)') : ''
          }}
        >
          {children}
        </Box>
      </Box>
    </Link>
  )
}

const ActionsComponent = ({ item }) => {
  const buttons = item?.notification_content?.buttons

  if (buttons?.length > 0) {
    return (
      <Grid container flexDirection='row-reverse' justifyContent='flex-end' sx={{ gap: 1, mt: 1 }}>
        {buttons.map((item, index) => {
          const newTab = item?.isNewTab || true;
          if (Boolean(item?.primary) === false || item?.primary === undefined) {
            return (
              <a key={item + index} target={newTab ? '_blank' : '_self'} href={`${item?.action}`} style={{textDecoration:'none'}}>
                <Button disableElevation variant={'outlined'} size='small' sx={{ fontSize: '0.6rem' }}>
                  {item?.label}
                </Button>
              </a>
            )
          } else if (Boolean(item?.primary) === true) {
            return (
              <a key={item + index} target={newTab ? '_blank' : '_self'} href={`${item?.action}`} style={{textDecoration: 'none'}}>
                <Button disableElevation variant={'contained'} size='small' sx={{ fontSize: '0.6rem' }}>
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

const NotificationItem = ({ item }) => {
  const theme = useTheme()
  const type = item?.notification_content?.attachments?.type
  const read = item?.isRead
  const mainLink = item?.notification_content?.action?.href
  const newTab = item?.notification_content?.action?.isNewTab

  const {
    data: { brandLogo },
    handlers: { handleClick }
  } = useNotificationsHomeContext()

  const createdAt = item?.createdAt

  const title = item?.notification_content?.title
  const body = item?.notification_content?.body
  const logo = item?.notification_content?.icon || brandLogo

  const attachmentsObject = item?.notification_content?.attachments
  const attachmentLink = attachmentsObject?.attachment

  const styles = {
    pt: 2,
    pb: 0,
    px: 3,
    background: read ? '' : theme.palette.mode === 'dark' ? 'rgba(145, 85, 253, 0.08)' : 'rgba(145, 85, 253, 0.059)',
    cursor: 'pointer',
    ':hover': { translate: '0 -2px' },
    transition: '0.3s translate ease-in-out',
    borderBottom: 1,
    borderColor: theme.palette.divider
  }

  return (
    <LinkWrapper link={mainLink} newTab={newTab} item={item}>
      <Grid
        container
        sx={{ ...styles }}
        onClick={() => {
          handleClick()
        }}
      >
        <Grid item xs={1.3}>
          <img src={logo} width='30px' height='30px' style={{borderRadius: '4px'}} />
        </Grid>
        <Grid item xs={8.7}>
          <MainBody title={title} body={body} />
          <ActionsComponent item={item} />
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}
          >
            <LinkWrapper item={item} link={attachmentLink} hover={true} newTab={true}>
              <AttachmentComponent type={type} attachmentsObject={attachmentsObject} />
            </LinkWrapper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <NotificationFooter createdAt={createdAt} msg={item} />
        </Grid>
      </Grid>
    </LinkWrapper>
  )
}

const EmptyList = () => {
  const {
    data: { tabPanelValue }
  } = useNotificationsHomeContext()
  const theme = useTheme()
  const tabIsUnread = tabPanelValue === 'unread'
  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Box
      sx={{
        height: xs ? 400 : '79vh',
        width: '100%',
        color: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        pt: 10,
        textAlign: 'center'
      }}
    >
      <HourglassEmpty fontSize='large' />
      <Typography color='secondary' sx={{ width: '55%' }}>
        No {tabIsUnread ? 'unread' : ''} notifications to show yet
      </Typography>
    </Box>
  )
}

export const NotificationsList = ({ filter }) => {
  const theme = useTheme()
  const { ref, inView } = useInView()

  const {
    data: { list, unreadList, count },
    handlers: { loadMoreNotifications }
  } = useNotificationsHomeContext()

  const mapperList = filter ? unreadList : list

  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  const styles = {
    height: xs ? 400 : '79vh',
    width: '100%',
    '& .MuiMenuItem-root:last-of-type': {
      border: 0
    }
  }

  // ** Styled PerfectScrollbar component
  const PerfectScrollbar = styled(PerfectScrollbarComponent)({
    ...styles
  })

  const ScrollWrapper = ({ children }) => {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }

  const page = Math.ceil(mapperList?.length / 20)

  useEffect(() => {
    if (inView && mapperList?.length < count) {
      loadMoreNotifications(page + 1)
    }
  }, [inView])

  if (mapperList?.length > 0) {
    return (
        <Grid container sx={{ height: '42vh', overflowY: 'auto' }} style={{alignContent: 'flex-start'}}>
        {/* <ScrollWrapper> */}
        {mapperList.map((item, index) => {
          return (
            <Grid key={item + index} item xs={12}>
              <NotificationItem item={item} />
            </Grid>
          )
        })}
        {mapperList?.length && <Box ref={ref} />}
        {/* </ScrollWrapper> */}
      </Grid>
    )
  }

  return <EmptyList />
}

export default NotificationsList
