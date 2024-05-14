import React, { useEffect, useState, useRef } from 'react'
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
  Link,
  Icon,
  Chip,
  Divider,
  Button,
  Collapse,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material'
import { useNotificationsHomeContext } from '../../context'
import {
  Lock,
  CheckCircle,
  Close,
  Check,
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

const PanelBody = () => {
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
      {/* <Collapse in={openConfigUnsaved}>
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            minHeight: 'auto',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }}
        >
          <Typography
            sx={{ width: '80%', fontSize: '0.8rem' }}
            textAlign='left'
          >
            You have unsaved changes, Do you want to go back without saving?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title='Discard and close'>
              <IconButton
                size='small'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOpenConfigUnsaved(false)
                  setShowConfig(false)
                }}
              >
                <Close />
              </IconButton>
            </Tooltip>
            <Tooltip title='Save and close'>
              <IconButton
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
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Collapse> */}
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
                paddingY: 2,
                marginBottom: 2
              }}
            >
              <Box sx={{ marginBottom: 1, marginLeft: 1 }}>
                <Typography
                  fontSize='1rem'
                  fontWeight={600}
                  color={theme.palette.text.primary}
                  marginBottom={1}
                >
                  {section}
                </Typography>
              </Box>
              <Box
                sx={{
                  background:
                    theme.palette.mode === 'dark' ? '#231F37' : '#FFFFFF',
                  padding: 2,
                  borderRadius: '10px'
                }}
              >
                {userPreference.result[section].map((topic, index) => (
                  <Box sx={{ paddingBottom: 2 }} key={topic.subscription_id}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography
                        fontSize='1rem'
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
                        gap: 2
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

export const ConfigPopup = () => {
  const theme = useTheme()
  const buttonRef = useRef()
  const [preferenceUpdated, setPreferenceUpdated] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setPreferenceUpdated(false)
    }, 1000)
  }, [preferenceUpdated])

  const {
    data: {
      socketInstance,
      showConfig,
      preferenceMode,
      userPreference,
      resetPreference,
      openConfigUnsaved
    },
    handlers: {
      setUserPreference,
      setResetPreference,
      setShowConfig,
      setOpenConfigUnsaved
    }
  } = useNotificationsHomeContext()
  const handleSavePreference = async () => {
    setPreferenceUpdated(true)
    setUserPreference((prev) => {
      const preference = getDifferentPreferences(prev, resetPreference)
      socketInstance.emit('set:preference', preference)
      const temp = { ...prev }
      return temp
    })
  }
  useEffect(() => {
    socketInstance.on('preference:update', () => {
      setPreferenceUpdated(false)
      setUserPreference((prev) => {
        prev.isDirty = false
        return prev
      })
    })
    setResetPreference(cloneDeep(userPreference))
  }, [])
  return (
    <Dialog
      className='preference-dialog'
      open={showConfig && preferenceMode === 'modal'}
      keepMounted
      sx={{ width: '100%' }}
      PaperProps={{
        sx: {
          backgroundImage: 'none',
          borderRadius: '0.75rem',
          minWidth: '30%',
          maxWidth: '520px'
        }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          textAlign: 'center',
          fontWeight: '500',
          fontSize: '16px'
        }}
      >
        Notification Settings
      </DialogTitle>
      <IconButton
        aria-label='close'
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
        onClick={() => {
          if (userPreference.isDirty) setOpenConfigUnsaved(true)
          else {
            setShowConfig(false)
          }
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers sx={{ padding: 0 }}>
        <PanelBody />
      </DialogContent>
      <DialogActions sx={{ alignSelf: 'center' }}>
        {preferenceUpdated || openConfigUnsaved || !userPreference.isDirty ? (
          <Tooltip text='No Changes to save' placement='right-end'>
            <Box>
              <Button
                variant='contained'
                disabled={
                  preferenceUpdated ||
                  openConfigUnsaved ||
                  !userPreference.isDirty
                }
                disableRipple={true}
              >
                Save
              </Button>
            </Box>
          </Tooltip>
        ) : (
          <Button
            ref={buttonRef}
            variant='contained'
            disabled={
              preferenceUpdated || openConfigUnsaved || !userPreference.isDirty
            }
            onClick={handleSavePreference}
            disableRipple={true}
          >
            Save
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
          </Button>
        )}
      </DialogActions>
    </Dialog>
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

export default ConfigPopup
