import React, { useEffect, useState, useRef } from 'react'
import {
  Alert,
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
  ClickAwayListener,
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
  ArrowBackIos,
  Close,
  Check,
  ArrowBackIosNew
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
  const [preferenceUpdated, setPreferenceUpdated] = useState(false)
  const {
    data: {
      errMsg,
      userPreference,
      socketInstance,
      openConfigUnsaved,
      resetPreference,
      showConfig
    },
    handlers: {
      setShowConfig,
      setUserPreference,
      setOpenConfigUnsaved,
      setResetPreference
    }
  } = useNotificationsHomeContext()

  useEffect(() => {
    setTimeout(() => {
      setPreferenceUpdated(false)
    }, 1000)
  }, [preferenceUpdated])

  const theme = useTheme()

  return (
    <React.Fragment>
      <Collapse in={preferenceUpdated}>
        <Alert icon={<Check fontSize='inherit' />} severity='success'>
          Channel preferences saved
        </Alert>
      </Collapse>
      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          width: '90%',
          gridTemplateColumns: '10% 60% 30%',
          pb: 1,
          pl: 2,
          pr: 2,
          pt: 2,
          gap: 1
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
        >
          <ArrowBackIosNew disableRipple />
        </IconButton>
        <Typography variant='subtitle' sx={{ minWidth: 250 }}>
          Notification Preferences
        </Typography>
        {/* <Button
          onClick={() => handleSavePreference()}
          disabled={openConfigUnsaved}
        >
          {preferenceUpdated ? 'Saiving...' : 'Save'}
        </Button> */}
        {userPreference.isDirty && (
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              ref={buttonRef}
              variant='contained'
              disabled={preferenceUpdated || openConfigUnsaved}
              onClick={handleSavePreference}
              disableRipple
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
        {/* <LoadingButton
          onClick={() => handleSavePreference()}
          endIcon={<Check />}
          loading={preferenceUpdated}
          loadingPosition='end'
          disabled={openConfigUnsaved}
          sx={{
            visibility:
              userPreference.isDirty || preferenceUpdated ? 'visible' : 'hidden'
          }}
          color={preferenceUpdated ? 'success' : 'primary'}
        >
          <span>{preferenceUpdated ? 'Saving...' : 'Save'}</span>
        </LoadingButton> */}
      </Box>
    </React.Fragment>
  )

  // if (errMsg === 'xhr poll error') {
  //   return (
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: !xsUp ? 'space-between' : 'center',
  //         width: 'auto',
  //         py: 0.5,
  //         px: 2,
  //         gap: 2,
  //         background: 'rgba(0,0,0,0.2)'
  //       }}
  //     >
  //       <Tooltip title='You are offline now, please check your internet'>
  //         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
  //           <WifiOff
  //             sx={{
  //               fontSize: '0.75rem',
  //               color:
  //                 theme.palette.mode === 'light'
  //                   ? '#ffffff'
  //                   : theme.palette.secondary.main
  //             }}
  //           />
  //           <Typography
  //             variant='subtitle2'
  //             color={theme.palette.mode === 'light' ? '#ffffff' : 'secondary'}
  //             fontSize='0.7rem'
  //           >
  //             Offline
  //           </Typography>
  //         </Box>
  //       </Tooltip>
  //       <CloseButton />
  //       <ConfigButton />
  //     </Box>
  //   )
  // } else return null
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
        overflow: 'auto'
      }}
    >
      <Collapse in={openConfigUnsaved}>
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
            {/* <Button onClick={(e) => setOpenConfigUnsaved(false)}>Yes</Button> */}
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
            {/* <Button onClick={(e) => setShowConfig(false)}>No</Button> */}
          </Box>
        </Paper>
      </Collapse>
      <Box sx={{ opacity: openConfigUnsaved ? '50%' : '100%' }}>
        {sectionsArr.map((section) => (
          <Box
            sx={{
              paddingX: 2,
              paddingY: 2,
              marginBottom: 1,
              borderBottom: '.5px solid',
              borderColor: '#3a35411f'
            }}
          >
            <Box>
              <Typography
                fontSize='1rem'
                fontWeight={600}
                color={theme.palette.text.primary}
                marginBottom={1}
              >
                {section}
              </Typography>
            </Box>
            {userPreference.result[section].map((topic, index) => (
              <Box sx={{ paddingBottom: 1 }}>
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
                  <Link
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
                    {new Set(Object.values(topic.preference)).has('opted-out')
                      ? 'Select All'
                      : 'De-Select All'}
                  </Link>
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
                        >
                          <Box>
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
                          section={section}
                          topic={topic}
                          type={channel[1]}
                          label={channel[0]}
                        />
                      )
                  )}
                </Box>
                {index + 1 === userPreference.result[section].length ? null : (
                  <Divider sx={{ paddingTop: 2 }} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
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
          background: (theme) => theme.palette.background.paper
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

export const ConfigPopup = () => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
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
    // <Dialog open={showConfig && preferenceMode === 'modal'} keepMounted>
    //   <DialogTitle alignSelf={'center'}>{'Preferences'}</DialogTitle>
    //   <Divider />
    //   <DialogContent sx={{ padding: 0 }}>
    //     <PanelBody />
    //   </DialogContent>
    //   <DialogActions sx={{ justifyContent: 'center' }}>
    //     <Button variant='contained'>Save</Button>
    //   </DialogActions>
    // </Dialog>
    // <Modal open={showConfig && preferenceMode === 'modal'}>
    //   <PanelHeader />
    //   <Divider sx={{ mt: 0, mb: 0 }} />
    //   <PanelBody />
    //   <PanelFooter />
    // </Modal>
    <Dialog
      open={showConfig && preferenceMode === 'modal'}
      keepMounted
      sx={{ width: '100%' }}
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }}>
        Preferences
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
          else setShowConfig(false)
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
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
                disableRipple
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
            disableRipple
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
      formattedLabel = 'InApp'
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
  }
  return (
    <Chip
      key={label}
      label={
        <Typography
          variant='text'
          sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}
        >
          {formattedLabel}
          <Icon
            sx={{
              display: type === 'opted-out' ? 'none' : 'block'
            }}
            color='#ffffff4f'
          >
            {type === 'required' ? (
              <Lock />
            ) : type === 'opted-in' ? (
              <CheckCircle />
            ) : null}
          </Icon>
        </Typography>
      }
      color='primary'
      variant='outlined'
      sx={{
        borderRadius: '5px',
        backgroundColor: type === 'opted-out' ? '' : '#f2ebff',
        color: theme.palette.primary.main,
        ...(type !== 'opted-out' ? { border: 0 } : {})
      }}
      disabled={type === 'required'}
      disableRipple={true}
      onClick={() => chipClicked(section, topic, type, label)}
    />
  )
}

export default ConfigPopup
