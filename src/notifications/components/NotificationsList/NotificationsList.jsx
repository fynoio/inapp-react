/* eslint-disable camelcase */
import React, { useEffect, useRef, useState } from 'react'
import parse from 'html-react-parser'
import { useInView } from 'react-intersection-observer'
import {
  Check,
  Close,
  DeleteOutline,
  DoneAll,
  HourglassEmpty,
  LibraryBooks,
  MoreHoriz
} from '@mui/icons-material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import {
  Box,
  Button,
  ClickAwayListener,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
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
    <Box sx={{ ...boxStyles }} className={`notification-attachment ${docType}`}>
      <LibraryBooks fontSize='small' />
      <Typography sx={{ fontSize: '0.6rem' }} className='attachemnt-name'>
        {temp[docType]?.title || docType.toUpperCase()}
      </Typography>
    </Box>
  )
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
          className='notification-attachment image'
        />
      )
    case 'Video':
      return (
        <video
          src={attachment}
          width='50rem'
          height='50rem'
          style={{ borderRadius: 5 }}
          className='notification-attachment video'
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
      const regex = new RegExp(key, list[key].scope)
      preview_val =
        typeof preview_val === 'string'
          ? preview_val?.replace(regex, list[key].with)
          : preview_val?.map((item) => {
              return item?.replace(regex, list[key].with)
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
  const theme = useTheme()
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
  const renderBody = preview(body, list)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        wordWrap: 'break-word'
      }}
    >
      <Box>
        {title && (
          <Typography
            fontSize='14px'
            fontWeight={600}
            color={theme.palette.text.primary}
            className='notification-title'
          >
            {title}
          </Typography>
        )}
        {body && (
          <Typography
            fontSize='12px'
            fontWeight={300}
            color={theme.palette.text.primary}
            className='notification-body'
          >
            {parse(renderBody)}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

const NotificationFooter = ({ createdAt, msg }) => {
  const theme = useTheme()

  const {
    handlers: { handleMarkAsRead, handleDelete, notificationCenterConfig }
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
      component='div'
      className='notification-footer'
    >
      <Typography
        fontSize='0.7rem'
        sx={{
          color: theme.palette.secondary.main,
          pl: { xs: 2, sm: 0.35 }
        }}
      >
        {moment.parseZone(createdAt).fromNow()}
      </Typography>
      <MoreHoriz
        color='secondary'
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpenMenu(!openMenu)
        }}
        sx={{
          cursor: 'pointer',
          ':hover': { background: theme.palette.action.focus },
          borderRadius: '10px',
          zIndex: 50
        }}
      />
      <Menu
        PaperProps={{
          style: {
            borderRadius: '10px',
            backgroundImage: 'none'
          }
        }}
        open={openMenu}
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        onClose={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpenMenu(false)
        }}
      >
        {!msg?.isRead && (
          <Box>
            <MenuItem
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleMarkAsRead(msg)
                setOpenMenu(false)
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0 }}
              >
                <DoneAll fontSize='0.6rem' />{' '}
                <Typography variant='small' fontSize='0.8rem'>
                  Mark as Read
                </Typography>
              </Box>
            </MenuItem>
          </Box>
        )}
        <MenuItem
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpenMenu(false)
            handleDelete(msg)
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 0,
              color: theme?.palette?.error?.main
            }}
          >
            <DeleteOutline color='error' fontSize='0.6rem' />
            <Typography variant='small' fontSize='0.8rem'>
              Delete
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export const LinkWrapper = ({
  children,
  link,
  hover = false,
  sameTab = 'false',
  item
}) => {
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
    // <Link
    //   target={sameTab === 'true' ? '_self' : '_blank'}
    //   href={`${link}`}
    //   style={{ textDecoration: 'none' }}
    // >
    <Box
      onClick={(e) => {
        handleMarkAsRead(item)
      }}
      sx={{ position: 'relative' }}
    >
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
          filter: showBlur
            ? theme.palette.mode === 'light'
              ? 'brightness(50%) blur(1px)'
              : 'blur(1px)'
            : ''
        }}
      >
        {children}
      </Box>
    </Box>
    // </Link>
  )
}

const ActionsComponent = ({ item }) => {
  const {
    handlers: { handleMarkAsRead }
  } = useNotificationsHomeContext()
  const buttons = item?.notification_content?.buttons
  const message = item
  if (buttons?.length > 0) {
    return (
      <Grid
        container
        flexDirection='row-reverse'
        justifyContent='flex-end'
        gap={1}
        sx={{ mt: 1 }}
        className='buttons-section'
      >
        {buttons.map((item, index) => {
          const sameTab = item?.sameTab || 'false'
          if (item?.primary === 'false' || item?.primary === undefined) {
            return (
              <a
                key={item + index}
                target={sameTab === 'false' ? '_blank' : '_self'}
                href={`${item?.action}`}
                style={{ textDecoration: 'none' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMarkAsRead(message)
                }}
                rel='noreferrer'
              >
                <Button
                  disableElevation
                  variant='outlined'
                  size='small'
                  sx={{ fontSize: '0.6rem' }}
                  className='fyno-secondary-action'
                >
                  {item?.label}
                </Button>
              </a>
            )
          } else if (item?.primary === 'true') {
            return (
              <a
                key={item + index}
                target={sameTab === 'false' ? '_blank' : '_self'}
                href={`${item?.action}`}
                style={{ textDecoration: 'none' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMarkAsRead(message)
                }}
                rel='noreferrer'
              >
                <Button
                  disableElevation
                  variant='contained'
                  size='small'
                  sx={{ fontSize: '0.6rem' }}
                  className='fyno-primary-action'
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

const NotificationItem = ({ item }) => {
  const theme = useTheme()
  const type = item?.notification_content?.attachments?.type
  const read = item?.isRead
  let mainLink = item?.notification_content?.action?.href || null
  let sameTab = item?.notification_content?.action?.sameTab || false

  if (mainLink && mainLink[0] !== '/') {
    if (!(/^https:/.test(mainLink) || /^http:/.test(mainLink))) {
      if (/[a-zA-Z]\.[a-zA-Z]/.test(mainLink)) {
        mainLink = 'https://' + mainLink
      } else if (mainLink !== '#') {
        mainLink = '/' + mainLink
      } else {
        mainLink = null
        sameTab = 'true'
      }
    }
  } else {
    mainLink = null
    sameTab = 'true'
  }

  const {
    data: { brandLogo },
    handlers: { handleMarkAsRead }
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
    background: read ? '' : theme.palette.primary.main + '1A',
    cursor: 'pointer',
    ':hover': { translate: '0 -2px' },
    transition: '0.3s translate ease-in-out',
    borderBottom: 1,
    borderColor: theme.palette.divider
  }

  const xs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid
      container
      sx={{ ...styles }}
      onClick={(e) => {
        e.stopPropagation()
        handleMarkAsRead(item)
        if (mainLink)
          window.open(mainLink, sameTab === 'true' ? '_self' : '_blank')
      }}
      columnGap={xs ? 1 : 0}
      className='notification-item'
    >
      <Grid item xs={1.3} className='notification-icon-section'>
        <img
          src={logo}
          width='30px'
          height='30px'
          style={{ borderRadius: '4px', objectFit: 'contain' }}
          className='notification-icon'
        />
      </Grid>
      <Grid
        item
        xs={attachmentsObject ? 8 : 9.8}
        className='notification-content'
      >
        <MainBody title={title} body={body} />
        <ActionsComponent item={item} />
      </Grid>
      {attachmentsObject && (
        <Grid item xs={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'space-between'
            }}
          >
            <LinkWrapper
              item={item}
              link={attachmentLink}
              hover
              sameTab='false'
            >
              <AttachmentComponent
                type={type}
                attachmentsObject={attachmentsObject}
              />
            </LinkWrapper>
          </Box>
        </Grid>
      )}

      <Grid item xs={12}>
        <NotificationFooter createdAt={createdAt} msg={item} />
      </Grid>
    </Grid>
  )
}

const ClickAwayWrapper = ({ open, children, setAnchorElDelete }) => {
  if (open) {
    return (
      <ClickAwayListener
        onClickAway={() => {
          setAnchorElDelete()
        }}
      >
        {children}
      </ClickAwayListener>
    )
  }

  return children
}

const EmptyList = () => {
  const {
    data: { tabPanelValue, openDeleteDialog, header },
    handlers: { handleClickDelete, deleteAllMessages }
  } = useNotificationsHomeContext()
  const theme = useTheme()
  const tabIsUnread = tabPanelValue === 'unread'
  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  const getHeight = () => {
    if (!xs) {
      return '69vh'
    }
    let height = 62
    if (xs) {
      if (header) {
        height = height - 6
      }
      if (openDeleteDialog) {
        height = height - 5
      }
    }
    return `${height}vh`
  }

  return (
    <Box
      sx={{
        height: getHeight(),
        color: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative'
      }}
      className='no-messages-section'
    >
      <Collapse
        sx={{
          position: 'absolute',
          top: 0,
          zIndex: 5000
        }}
        in={openDeleteDialog}
      >
        <ClickAwayWrapper
          open={openDeleteDialog}
          setAnchorElDelete={(e) => {
            handleClickDelete(e)
          }}
        >
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 4,

              borderTopLeftRadius: 0,
              borderTopRightRadius: 0
            }}
          >
            <Typography
              sx={{ width: '80%', fontSize: '0.8rem' }}
              textAlign='left'
            >
              Are you sure you want to delete all the notifications?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                variant='contained'
                size='small'
                onClick={(e) => deleteAllMessages(e)}
              >
                <Check />
              </IconButton>
              <IconButton size='small' onClick={(e) => handleClickDelete(e)}>
                <Close />
              </IconButton>
            </Box>
          </Paper>
        </ClickAwayWrapper>
      </Collapse>
      <HourglassEmpty fontSize='large' />
      <Typography
        color='secondary'
        sx={{ width: '50%', mb: tabIsUnread ? 0 : 3.1 }}
      >
        No {tabIsUnread ? 'unread' : ''} notifications to show yet
      </Typography>
    </Box>
  )
}

export const NotificationsList = ({ filter }) => {
  const theme = useTheme()
  const { ref, inView } = useInView()

  const {
    data: {
      list,
      unreadList,
      count,
      openDeleteDialog,
      tabPanelValue,
      unreadCount,
      header,
      page,
      notificationCenterPosition,
      showBranding
    },
    handlers: { loadMoreNotifications, deleteAllMessages, handleClickDelete }
  } = useNotificationsHomeContext()

  const mapperList = filter ? unreadList : list

  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  const checkCount = tabPanelValue === 'all' ? count : unreadCount

  useEffect(() => {
    if (inView && mapperList?.length < checkCount) {
      loadMoreNotifications(page, tabPanelValue)
    }
  }, [inView])
  const getRemaingingHeightForContent = (offset = 0) => {
    if (typeof window !== 'undefined') {
      // Get the total height of the viewport
      const totalHeight = window?.innerHeight

      const headerComp = document.querySelector(
        '[data-testid="noti-center-header"]'
      )
      const tabComp = document.querySelector('[data-testid="noti-center-tabs"]')
      const footerComp = document.querySelector(
        '[data-testid="noti-center-footer"]'
      )
      const headerCompHeight = headerComp ? headerComp?.offsetHeight : 64
      const tabCompHeight = tabComp ? tabComp?.offsetHeight : 0
      const footerCompHeight = footerComp ? footerComp?.offsetHeight : 0
      // Calculate the remaining height
      const remainingHeight =
        totalHeight -
        headerCompHeight -
        tabCompHeight -
        footerCompHeight -
        offset

      return remainingHeight
    }
  }

  // eslint-disable-next-line no-unused-vars
  const getHeight = () => {
    if (!xs) {
      return '69vh'
    }
    let height = 62
    if (xs) {
      if (header) {
        height = height - 6
      }
    }
    return `${height}vh`
  }
  if (mapperList?.length > 0) {
    return (
      <Box
        sx={{
          height: xs
            ? notificationCenterPosition === 'left' ||
              notificationCenterPosition === 'right'
              ? getRemaingingHeightForContent() - 20
              : header !== undefined
              ? '56.25vh'
              : showBranding
              ? '62.75vh'
              : '64.75vh'
            : '69vh',
          position: 'relative',
          overflowY: 'auto',
          scrollBehavior: 'auto'
        }}
        className='notification-list'
      >
        <Collapse
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 5000
          }}
          in={openDeleteDialog}
        >
          <ClickAwayWrapper
            open={openDeleteDialog}
            setAnchorElDelete={(e) => {
              handleClickDelete(e)
            }}
          >
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 4,

                borderTopLeftRadius: 0,
                borderTopRightRadius: 0
              }}
            >
              <Typography
                sx={{ width: '80%', fontSize: '0.8rem' }}
                textAlign='left'
              >
                Are you sure you want to delete all the notifications?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  variant='contained'
                  size='small'
                  onClick={(e) => deleteAllMessages(e)}
                >
                  <Check />
                </IconButton>
                <IconButton size='small' onClick={(e) => handleClickDelete(e)}>
                  <Close />
                </IconButton>
              </Box>
            </Paper>
          </ClickAwayWrapper>
        </Collapse>
        <Grid
          container
          sx={{
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            pointerEvents: openDeleteDialog ? 'none' : '',
            opacity: openDeleteDialog ? '50%' : '100%'
          }}
          style={{ alignContent: 'flex-start' }}
          className='notification-list-grid'
        >
          {mapperList.map((item, index) => (
            <Grid key={item + index} item xs={12}>
              <NotificationItem item={item} />
              {index === mapperList?.length - 2 && <Box ref={ref} />}
            </Grid>
          ))}
          {mapperList?.length === checkCount && mapperList?.length > 19 && (
            <Grid
              item
              xs={12}
              textAlign='center'
              sx={{ background: theme.palette.secondary.main + '1A', py: 1 }}
            >
              <Typography variant='caption' color='secondary'>
                Showing all notifications
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    )
  }

  return <EmptyList />
}

export default React.memo(NotificationsList)
