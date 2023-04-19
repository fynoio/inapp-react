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
  Link,
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
    <Box sx={{ ...boxStyles }}>
      <LibraryBooks fontSize='small' />
      <Typography sx={{ fontSize: '0.6rem' }}>
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
      let regex = new RegExp(key, list[key]['scope'])
      preview_val =
        typeof preview_val === 'string'
          ? preview_val?.replace(regex, list[key]['with'])
          : preview_val?.map((item) => {
              return item?.replace(regex, list[key]['with'])
            })
    }

    const tt_regex =
      /(<tt style=\"word-wrap: break-word; white-space: pre-wrap; word-break: break-word;\">(?:\n|.)+?<\/tt>)/gm

    let m,
      replace = [],
      replace_with = []

    while ((m = tt_regex.exec(preview_val)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === tt_regex.lastIndex) {
        tt_regex.lastIndex++
      }

      let replace_with_temp = m[0]
        .replace(/<i>|<\/i>?/gm, '_')
        .replace(/<b>|<\/b>?/gm, '*')
        .replace(/<s>|<\/s>?/gm, '~')

      if (m[0] != replace_with_temp) {
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
        <Typography
          fontSize={'0.85rem'}
          fontWeight={600}
          color={theme.palette.text.primary}
        >
          {title}
        </Typography>
        <Typography
          fontSize={'0.8rem'}
          fontWeight={200}
          color={theme.palette.text.primary}
        >
          {parse(renderBody)}
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
      <Typography
        fontSize={'0.7rem'}
        sx={{ color: theme.palette.secondary.main }}
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
          borderRadius: 10,
          zIndex: 50
        }}
      />
      <Menu
        PaperProps={{
          style: {
            backgroundImage: 'none'
          }
        }}
        open={openMenu}
        anchorEl={buttonRef.current}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DoneAll fontSize='0.6rem' /> Mark as read
              </Box>
            </MenuItem>
            <Divider />
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
              py: 1,
              color: theme?.palette?.error?.main
            }}
          >
            <DeleteOutline color='error' fontSize='0.6rem' /> Delete
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
    <Link
      target={sameTab === 'true' ? '_self' : '_blank'}
      href={`${link}`}
      style={{ textDecoration: 'none' }}
    >
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
    </Link>
  )
}

const ActionsComponent = ({ item }) => {
  const buttons = item?.notification_content?.buttons

  if (buttons?.length > 0) {
    return (
      <Grid
        container
        flexDirection='row-reverse'
        justifyContent='flex-end'
        sx={{ gap: 1, mt: 1 }}
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
              >
                <Button
                  disableElevation
                  variant={'outlined'}
                  size='small'
                  sx={{ fontSize: '0.6rem' }}
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
              >
                <Button
                  disableElevation
                  variant={'contained'}
                  size='small'
                  sx={{ fontSize: '0.6rem' }}
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

const NotificationItem = ({ item }) => {
  const theme = useTheme()
  const type = item?.notification_content?.attachments?.type
  const read = item?.isRead
  let mainLink = item?.notification_content?.action?.href
  let sameTab = item?.notification_content?.action?.sameTab || false

  if (mainLink && mainLink[0] !== '/') {
    if (!(/^https:/.test(mainLink) || /^http:/.test(mainLink))) {
      if (/[a-zA-Z]\.[a-zA-Z]/.test(mainLink)) {
        mainLink = 'https://' + mainLink
      } else if (mainLink !== '#') {
        mainLink = '/' + mainLink
      } else {
        mainLink = 'javascript:void(0);'
        sameTab = 'true'
      }
    }
  } else {
    mainLink = 'javascript:void(0);'
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

  return (
    <LinkWrapper link={mainLink} sameTab={sameTab} item={item}>
      <Grid
        container
        sx={{ ...styles }}
        onClick={(e) => {
          e.stopPropagation()
          handleMarkAsRead(item)
        }}
      >
        <Grid item xs={1.3}>
          <img
            src={logo}
            width='30px'
            height='30px'
            style={{ borderRadius: '4px', objectFit: 'contain' }}
          />
        </Grid>
        <Grid item xs={8.7}>
          <MainBody title={title} body={body} />
          <ActionsComponent item={item} />
        </Grid>
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
              hover={true}
              sameTab={'false'}
            >
              <AttachmentComponent
                type={type}
                attachmentsObject={attachmentsObject}
              />
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
    data: { tabPanelValue, openDeleteDialog },
    handlers: { handleClickDelete }
  } = useNotificationsHomeContext()
  const theme = useTheme()
  const tabIsUnread = tabPanelValue === 'unread'
  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Box
      sx={{
        height: xs ? '56vh ' : '70vh',
        width: '100%',
        color: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative'
      }}
    >
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
      unreadCount
    },
    handlers: { loadMoreNotifications, deleteAllMessages, handleClickDelete }
  } = useNotificationsHomeContext()

  const mapperList = filter ? unreadList : list

  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  const styles = {
    height: xs ? 400 : '100%',
    width: '100%',
    '& .MuiMenuItem-root:last-of-type': {
      border: 0
    }
  }

  // ** Styled PerfectScrollbar component
  // const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  //   ...styles
  // })

  // const ScrollWrapper = ({ children }) => {
  //   return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  // }

  const page = Math.ceil(mapperList?.length / 20)

  const checkCount = tabPanelValue === 'all' ? count : unreadCount

  useEffect(() => {
    if (inView && mapperList?.length < checkCount) {
      loadMoreNotifications(page + 1, tabPanelValue)
    }
  }, [inView])

  const listRef = useRef(null)

  useEffect(() => {
    console.log('mapperList', mapperList)
  }, [JSON.stringify(mapperList)])

  if (mapperList?.length > 0) {
    return (
      <Box
        ref={listRef}
        sx={{
          height: xs ? '56vh' : '70vh',
          position: 'relative'
        }}
      >
        <Collapse
          sx={{
            position: 'absolute',
            top: 0,
            width: '100%',
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
                borderTopRightRadius: 0,
                width: '100%'
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
            height: xs ? '55vh' : '70vh',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
          style={{ alignContent: 'flex-start' }}
        >
          {/* <ScrollWrapper> */}
          {mapperList.map((item, index) => {
            return (
              <Grid key={item + index} item xs={12}>
                <NotificationItem item={item} />
              </Grid>
            )
          })}

          {mapperList?.length && <Box ref={ref} />}
        </Grid>
      </Box>
    )
  }

  return <EmptyList />
}

export default React.memo(NotificationsList)
