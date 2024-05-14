import React, { useEffect, useState, useRef } from 'react'
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
  Icon,
  Chip,
  Button,
  Collapse,
  CircularProgress,
  Paper
} from '@mui/material'
import { useNotificationsHomeContext } from '../../context'
import {
  Lock,
  CheckCircle,
  ArrowBackIosNew,
  HourglassEmpty
} from '@mui/icons-material'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
function getDifferentPreferences(newConfig, oldConfig) {
  const differentPreferences = {}

  // Helper function to compare preferences
  function comparePreferences(newPref, oldPref) {
    const diffPref = {}
    for (const key in newPref) {
      if (
        newPref.hasOwnProperty(key) &&
        oldPref.hasOwnProperty(key) &&
        !isEqual(newPref[key], oldPref[key])
      ) {
        diffPref[key] = newPref[key]
      }
    }
    return diffPref
  }

  for (const category in newConfig.result) {
    if (newConfig.result.hasOwnProperty(category)) {
      const newItems = newConfig.result[category]
      const oldItems = oldConfig.result[category]
      if (!newItems || !oldItems) continue

      newItems.forEach((newItem) => {
        const oldItem = oldItems.find(
          (item) => item.subscription_id === newItem.subscription_id
        )
        if (oldItem) {
          const diffPref = comparePreferences(
            newItem.preference,
            oldItem.preference
          )
          if (Object.keys(diffPref).length > 0) {
            differentPreferences[newItem.subscription_id] = diffPref
          }
        }
      })
    }
  }

  return differentPreferences
}
const PanelHeader = () => {
  const theme = useTheme()
  const [preferenceUpdated, setPreferenceUpdated] = useState(false)
  const buttonRef = useRef()
  const {
    data: {
      errMsg,
      userPreference,
      socketInstance,
      openConfigUnsaved,
      resetPreference
    },
    handlers: {
      setShowConfig,
      setUserPreference,
      setOpenConfigUnsaved,
      setResetPreference
    }
  } = useNotificationsHomeContext()
  useEffect(() => {
    socketInstance.on('preference:update', () => {
      setUserPreference((prev) => {
        prev.isDirty = false
        setPreferenceUpdated(true)
        return prev
      })
    })
    setResetPreference(cloneDeep(userPreference))
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setPreferenceUpdated(false)
    }, 1000)
  }, [preferenceUpdated])

  const handleSavePreference = async () => {
    setUserPreference((prev) => {
      const preference = getDifferentPreferences(prev, resetPreference)
      socketInstance.emit('set:preference', preference)
      const temp = { ...prev }
      return temp
    })
    buttonRef.current.innerHTML = 'Saving...'
  }
  return (
    <React.Fragment>
      <Box
        sx={{
          height: '26pt',
          display: 'flex',
          alignItems: 'center',
          pb: 1,
          pl: 2,
          pr: 2,
          pt: 2,
          gap: 1,
          justifyItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0px 2px 10px 0px ${
            theme.palette.mode === 'dark'
              ? 'rgb(125 104 163 / 13%)'
              : 'rgba(58, 53, 65, 0.10)'
          }`
        }}
        data-testid='noti-center-header'
        className='noti-center-header'
      >
        <IconButton
          size='small'
          onClick={(e) => {
            if (userPreference.isDirty) setOpenConfigUnsaved(true)
            else setShowConfig(false)
          }}
          sx={{ flexGrow: '0' }}
        >
          <ArrowBackIosNew />
        </IconButton>
        <Typography
          variant='subtitle'
          sx={{
            minWidth: 250,
            flexGrow: '24',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Notification Settings
        </Typography>
        {userPreference.isDirty && (
          <Box sx={{ m: 1, position: 'relative', flexGrow: '1' }}>
            <Button
              disableElevation
              variant='text'
              ref={buttonRef}
              size='small'
              disabled={preferenceUpdated || openConfigUnsaved}
              onClick={handleSavePreference}
              disableRipple={true}
              sx={{
                ...(theme.palette.mode === 'dark'
                  ? {
                      color: '#fff !important'
                    }
                  : {})
              }}
            >
              Save
            </Button>
            {preferenceUpdated && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'success',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px'
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </React.Fragment>
  )
}

const PanelBody = (props) => {
  const theme = useTheme()
  const {
    data: {
      userPreference,
      openConfigUnsaved,
      resetPreference,
      socketInstance
    },
    handlers: { setOpenConfigUnsaved, setShowConfig, setUserPreference }
  } = useNotificationsHomeContext()
  const sectionsArr = Object.keys(userPreference.result)
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  const handleSelectAll = (topic, section, type) => {
    setUserPreference((prev) => {
      const temp = { ...prev }
      temp.isDirty = true
      let selectAllPref = temp.result[section].filter(
        (subscription) => subscription.subscription_id === topic.subscription_id
      )[0].preference
      const new_config = type === 'select-all' ? 'opted-in' : 'opted-out'
      const newChannelPreference = Object.keys(selectAllPref).reduce(
        (acc, current) => {
          if (selectAllPref[current] !== 'required') acc[current] = new_config
          else acc[current] = 'required'
          return acc
        },
        {}
      )
      temp.result[section].filter(
        (subscription) => subscription.subscription_id === topic.subscription_id
      )[0].preference = newChannelPreference

      return temp
    })
  }
  const getHeight = () => {
    if (!xs) {
      return '70vh'
    }
    let height = 62
    return `${height}vh`
  }
  return (
    <Box
      sx={{
        height: getHeight(),
        color: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'auto',
        justifyContent: sectionsArr.length > 0 ? 'flex-start' : 'center'
      }}
    >
      <Collapse in={openConfigUnsaved}>
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minHeight: 'auto',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }}
        >
          <Typography
            sx={{ width: '80%', fontSize: '0.8rem' }}
            textAlign='left'
          >
            Do you want to save the changes made?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title='Discard and close'>
              {/* <IconButton
                size='small'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOpenConfigUnsaved(false)
                  setShowConfig(false)
                }}
              >
                <Close />
              </IconButton> */}
              <Button
                size='small'
                variant='text'
                color='secondary'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOpenConfigUnsaved(false)
                  setShowConfig(false)
                }}
              >
                No
              </Button>
            </Tooltip>
            <Tooltip title='Save and close'>
              {/* <IconButton
                variant='contained'
                size='small'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setUserPreference((prev) => {
                    const preference = getDifferentPreferences(
                      prev,
                      resetPreference
                    )
                    socketInstance.emit('set:preference', preference)
                    const temp = { ...prev }
                    temp.isDirty = false
                    return temp
                  })
                  setOpenConfigUnsaved(false)
                  setShowConfig(false)
                }}
              >
                <Check />
              </IconButton> */}
              <Button
                size='small'
                variant='text'
                sx={{
                  color:
                    theme.palette.mode === 'dark'
                      ? '#fff'
                      : theme.palette.primary.main
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setUserPreference((prev) => {
                    const preference = getDifferentPreferences(
                      prev,
                      resetPreference
                    )
                    socketInstance.emit('set:preference', preference)
                    const temp = { ...prev }
                    temp.isDirty = false
                    return temp
                  })
                  setOpenConfigUnsaved(false)
                  setShowConfig(false)
                }}
              >
                Yes
              </Button>
            </Tooltip>
          </Box>
        </Paper>
      </Collapse>
      {sectionsArr.length > 0 ? (
        <Box sx={{ opacity: openConfigUnsaved ? '50%' : '100%' }}>
          {sectionsArr.map((section, index) => (
            <Box
              key={section + index}
              sx={{
                paddingX: 2,
                paddingTop: 2
              }}
            >
              <Box sx={{ marginBottom: 1, marginLeft: 2 }}>
                <Typography
                  fontSize='14px'
                  fontWeight={600}
                  color={theme.palette.text.primary}
                >
                  {section}
                </Typography>
              </Box>
              <Box
                sx={{
                  background:
                    theme.palette.mode === 'dark' ? '#231F37' : '#FFFFFF',
                  padding: 2,
                  borderRadius: '0.75rem'
                }}
              >
                {userPreference.result[section].map((topic, index) => (
                  <Box
                    sx={{
                      ...(index !== userPreference.result[section].length - 1
                        ? { paddingBottom: 3 }
                        : {})
                    }}
                    key={topic.subscription_id}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography
                        fontSize='14px'
                        color={theme.palette.text.primary}
                      >
                        {topic.name}
                      </Typography>
                      {/* <Link
                        sx={{ cursor: 'pointer', fontSize: '.9rem' }}
                        onClick={() => {
                          handleSelectAll(
                            topic,
                            section,
                            new Set(Object.values(topic.preference)).has(
                              'opted-out'
                            )
                              ? 'select-all'
                              : 'select-none'
                          )
                        }}
                        underline='none'
                        color={'inherit'}
                      >
                        {new Set(Object.values(topic.preference)).has(
                          'opted-out'
                        )
                          ? 'Select All'
                          : 'De-Select All'}
                      </Link> */}
                    </Box>
                    <Box
                      sx={{
                        paddingTop: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      {Object.entries(topic.preference).map(
                        (channel) =>
                          channel[1] === 'required' && (
                            <Tooltip
                              title={`${channel[0]} is a required channel`}
                              placement='top'
                              key={channel[0]}
                            >
                              <Box key={channel[0]}>
                                <PreferenceButton
                                  section={section}
                                  topic={topic}
                                  type={channel[1]}
                                  label={channel[0]}
                                />
                              </Box>
                            </Tooltip>
                          )
                      )}
                      {Object.entries(topic.preference).map(
                        (channel) =>
                          channel[1] !== 'required' && (
                            <PreferenceButton
                              key={channel[0]}
                              section={section}
                              topic={topic}
                              type={channel[1]}
                              label={channel[0]}
                            />
                          )
                      )}
                    </Box>
                    {/* {index + 1 ===
                    userPreference.result[section].length ? null : (
                      <Divider sx={{ paddingTop: 2 }} />
                    )} */}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center'
          }}
        >
          <HourglassEmpty fontSize='large' color='secondary' />
          <Typography color='secondary' sx={{ paddingX: 2 }}>
            No sections or subscriptions yet to set user preferences.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

const PanelFooter = () => {
  const {
    data: { showLoader }
  } = useNotificationsHomeContext()
  return (
    <Box
      data-testid='noti-center-footer'
      sx={{ width: '100%', height: 30, position: 'sticky', bottom: '0' }}
    >
      <Box
        date-testid='noti-center-footer'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // py: 0.7,
          gap: 0.5,
          height: '100%',
          left: 0,
          right: 0,
          background: (theme) => theme.palette.background.configBackground
        }}
      >
        <Typography sx={{ fontSize: '0.7rem', filter: 'opacity(.5)' }}>
          Powered By
        </Typography>
        <img
          src='https://uploads-ssl.webflow.com/63735bad18c742035738e107/6399dab9fdfc2105b70def91_Fyno_logo_lettered.png'
          alt='Fyno'
          width='45px'
          height='auto'
          className='poweredLogo'
        />
      </Box>
    </Box>
  )
}

export const ConfigPanel = () => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  const {
    data: {
      showLoader,
      notificationCenterPosition,
      notificationCenterOffset,
      themeConfig,
      showBranding,
      userPreference
    }
  } = useNotificationsHomeContext()
  return (
    <Box
      data-testid='Hello'
      className='notification-panel'
      sx={{
        boxSizing: 'content-box',
        boxShadow:
          '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
        minWidth: xs ? '28pc' : '80%',
        width: md ? '24vw' : xs ? '64vw' : '90vw',
        height: xs
          ? notificationCenterPosition === 'left' ||
            notificationCenterPosition === 'right'
            ? '100%'
            : '70vh'
          : '100%',
        background: theme.palette.background.configBackground,
        position:
          notificationCenterPosition === 'left' ||
          notificationCenterPosition === 'right'
            ? 'fixed'
            : 'relative',
        ...(notificationCenterPosition === 'left' ||
        notificationCenterPosition === 'right'
          ? { top: 0 }
          : {}),
        ...(notificationCenterPosition === 'left'
          ? { left: notificationCenterOffset || 100 }
          : {}),
        ...(notificationCenterPosition === 'right'
          ? { right: notificationCenterOffset || 100 }
          : {})
      }}
    >
      <PanelHeader />
      {/* <Divider sx={{ mt: 0, mb: 0 }} /> */}
      <PanelBody />
      {showBranding === true ? <PanelFooter /> : null}
    </Box>
  )
}

export const PreferenceButton = (props) => {
  const {
    data: { userPreference },
    handlers: { setUserPreference }
  } = useNotificationsHomeContext()
  const chipClicked = (section, topic, type, label) => {
    if (type === 'required') return
    setUserPreference((prev) => {
      const temp = { ...prev }
      temp.isDirty = true
      const new_config = type === 'opted-out' ? 'opted-in' : 'opted-out'
      temp.result[section].filter(
        (subscription) => subscription.subscription_id === topic.subscription_id
      )[0].preference[label] = new_config
      return temp
    })
  }

  const theme = useTheme()
  const { section, topic, type, label } = props
  let formattedLabel
  switch (label) {
    case 'inapp':
      formattedLabel = 'In-App'
      break
    case 'whatsapp':
      formattedLabel = 'WhatsApp'
      break
    case 'sms':
      formattedLabel = 'SMS'
      break
    case 'email':
      formattedLabel = 'Email'
      break
    case 'push':
      formattedLabel = 'Push'
      break
    case 'webpush':
      formattedLabel = 'WebPush'
      break
    case 'slack':
      formattedLabel = 'Slack'
      break
    case 'discord':
      formattedLabel = 'Discord'
      break
    case 'teams':
      formattedLabel = 'Teams'
      break
    case 'voice':
      formattedLabel = 'Voice'
      break
  }
  return (
    <Chip
      key={label}
      label={
        <Typography
          variant='text'
          sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}
          color={theme.palette.mode === 'dark' ? '#fff' : 'primary'}
        >
          {formattedLabel}
          <Icon
            sx={{
              display: type === 'opted-out' ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {type === 'required' ? (
              <Lock
                sx={{
                  width: '.8em',
                  height: '.8em'
                }}
                color={theme.palette.mode === 'dark' ? '#fff' : 'primary'}
              />
            ) : type === 'opted-in' ? (
              <CheckCircle
                sx={{
                  width: '.8em',
                  height: '.8em'
                }}
                color={theme.palette.mode === 'dark' ? '#fff' : 'primary'}
              />
            ) : null}
          </Icon>
        </Typography>
      }
      color='primary'
      variant='outlined'
      sx={{
        borderRadius: '5px',
        backgroundColor:
          type === 'opted-out'
            ? ''
            : theme.palette.mode === 'dark'
            ? '#9155FD80'
            : '#9155FD14',
        color: theme.palette.primary.main,
        ...(type !== 'opted-out' ? { borderColor: '#9155FD80' } : {}),
        ...(type !== 'required'
          ? { cursor: 'pointer' }
          : { cursor: 'not-allowed' })
      }}
      disableRipple={true}
      onClick={() => chipClicked(section, topic, type, label)}
    />
  )
}

export default ConfigPanel
