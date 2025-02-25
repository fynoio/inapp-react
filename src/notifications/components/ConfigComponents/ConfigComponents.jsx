import { ArrowBackIosNew, HourglassEmpty } from '@mui/icons-material'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import PreferenceButton from '../PreferenceButton'
import GlobalPreference from '../GlobalPreference'
import React, { useEffect, useState, useRef } from 'react'
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Collapse,
  CircularProgress,
  Paper
} from '@mui/material'
import CustomTooltip from '../CustomTooltip'
import { useNotificationsHomeContext } from '../../context'
import { LOGO_DARK, LOGO_LIGHT } from '../../helpers/constants'
export const PanelHeader = () => {
  const theme = useTheme()

  const {
    data: {
      userPreference,
      socketInstance,
      openConfigUnsaved,
      resetPreference,
      updatedPreference,
      globalChannelPreference,
      resetGlobalChannelPreference
    },
    handlers: {
      setShowConfig,
      setUserPreference,
      setOpenConfigUnsaved,
      setResetPreference
    }
  } = useNotificationsHomeContext()

  const xsUp = useMediaQuery(theme.breakpoints.up('sm'))

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
            // Check if preferences have unsaved changes before closing the panel
            if (
              !isEqual(userPreference, resetPreference) ||
              !isEqual(globalChannelPreference, resetGlobalChannelPreference)
            )
              setOpenConfigUnsaved(true)
            else setShowConfig(false)
          }}
          sx={{ flexGrow: '0' }}
        >
          <ArrowBackIosNew />
        </IconButton>
        <Typography
          variant='subtitle'
          sx={{
            minWidth: xsUp ? 250 : 200,
            flexGrow: '24',
            fontSize: '16px',
            fontWeight: '500',
            fontFamily: theme.typography.fontFamily
          }}
        >
          Notification Preferences
        </Typography>
        <PreferenceSaveButton />
      </Box>
    </React.Fragment>
  )
}

export const PanelBody = (props) => {
  const theme = useTheme()
  const {
    data: {
      userPreference,
      openConfigUnsaved,
      resetPreference,
      socketInstance,
      globalChannelPreference,
      updatedPreference,
      showConfig,
      resetGlobalChannelPreference
    },
    handlers: {
      setOpenConfigUnsaved,
      setShowConfig,
      setUserPreference,
      setGlobalChannelPreference,
      setResetGlobalChannelPreference
    }
  } = useNotificationsHomeContext()

  // Get all sections from user preferences
  const sectionsArr = Object.keys(userPreference.result)
  const xs = useMediaQuery(theme.breakpoints.up('sm'))

  // Handle select-all or deselect-all actions for a topic
  const handleSelectAll = (topic, section, type) => {
    setUserPreference((prev) => {
      const temp = { ...prev }
      let selectAllPref = temp.result[section].find(
        (subscription) => subscription.subscription_id === topic.subscription_id
      ).preference

      const new_config = type === 'select-all' ? 'opted-in' : 'opted-out'
      const newChannelPreference = Object.keys(selectAllPref).reduce(
        (acc, current) => {
          acc[current] =
            selectAllPref[current] !== 'required' ? new_config : 'required'
          return acc
        },
        {}
      )

      temp.result[section].find(
        (subscription) => subscription.subscription_id === topic.subscription_id
      ).preference = newChannelPreference

      return temp
    })
  }

  // Dynamically calculate container height
  const getHeight = () => {
    if (!xs) {
      return '69vh'
    }
    let height = 60
    if (xs && openConfigUnsaved) {
      height += 5
    }
    return `${height}vh`
  }

  return (
    <Box
      sx={{
        height: getHeight(),
        boxSizing: 'content-box',
        color: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'auto',
        justifyContent: sectionsArr.length > 0 ? 'flex-start' : 'center'
      }}
      className='fyno-user-preferences-container'
    >
      <Collapse
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 5000
        }}
        in={openConfigUnsaved}
      >
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
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
            <CustomTooltip title='Discard and close'>
              <Button
                size='small'
                variant='text'
                color='secondary'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOpenConfigUnsaved(false)
                  setUserPreference(cloneDeep(resetPreference))
                  setGlobalChannelPreference(
                    cloneDeep(resetGlobalChannelPreference)
                  )
                  setShowConfig(false)
                }}
              >
                No
              </Button>
            </CustomTooltip>
            <CustomTooltip title='Save and close'>
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
                  socketInstance.emit('set:preference', updatedPreference)
                }}
              >
                Yes
              </Button>
            </CustomTooltip>
          </Box>
        </Paper>
      </Collapse>
      <Box sx={{ opacity: openConfigUnsaved ? '50%' : '100%' }}>
        {globalChannelPreference &&
          Object.keys(globalChannelPreference).length > 0 && (
            <GlobalPreference channels={Object.keys(globalChannelPreference)} />
          )}
        {sectionsArr.length > 0 ? (
          <Box>
            {sectionsArr.map((section, index) => (
              <Box
                key={section + index}
                sx={{
                  paddingX: 2,
                  paddingTop: 2
                }}
                className='preference-section'
              >
                <Box sx={{ marginBottom: 1, marginLeft: 0.5 }}>
                  <Typography
                    fontSize='14px'
                    fontWeight={600}
                    color={theme.palette.text.primary}
                    className='section-title'
                  >
                    {section}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: theme.palette.background.configSection,
                    padding: 2,
                    borderRadius: '0.75rem'
                  }}
                  className='section-topics-list'
                >
                  {userPreference.result[section].map((topic, index) => (
                    <Box
                      sx={{
                        ...(index !== userPreference.result[section].length - 1
                          ? { paddingBottom: 3 }
                          : {})
                      }}
                      key={topic.subscription_id}
                      className='preference-section-topic'
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
                          className='preference-topic-name'
                        >
                          {topic.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          paddingTop: 2,
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 1
                        }}
                        className='topic-preferences'
                      >
                        {Object.entries(topic.preference).map(
                          (channel) =>
                            channel[1] === 'required' && (
                              <PreferenceButton
                                section={section}
                                topic={topic}
                                tooltip={true}
                                type={channel[1]}
                                label={channel[0]}
                              />
                            )
                        )}
                        {Object.entries(topic.preference).map((channel) => {
                          return (
                            channel[1] !== 'required' && (
                              <PreferenceButton
                                key={channel[0]}
                                section={section}
                                topic={topic}
                                tooltip={
                                  globalChannelPreference[channel[0]] || false
                                }
                                type={
                                  globalChannelPreference[channel[0]] &&
                                  globalChannelPreference[channel[0]] === true
                                    ? 'opted-out'
                                    : channel[1]
                                }
                                label={channel[0]}
                              />
                            )
                          )
                        })}
                      </Box>
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
            <Typography
              color='secondary'
              sx={{ paddingX: 2, fontFamily: theme.typography.fontFamily }}
            >
              No preferences available at the moment
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export const PanelFooter = () => {
  const theme = useTheme()

  return (
    <Box
      data-testid='noti-center-footer'
      sx={{ width: '100%', height: 30, position: 'absolute', bottom: '0' }}
    >
      <Box
        date-testid='noti-center-footer'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          src={theme.palette.mode === 'light' ? LOGO_LIGHT : LOGO_DARK}
          alt='Fyno'
          width='45px'
          height='auto'
          className='poweredLogo'
        />
      </Box>
    </Box>
  )
}

export const PreferenceSaveButton = (props) => {
  const {
    data: {
      socketInstance,
      updatedPreference,
      globalChannelPreference,
      resetGlobalChannelPreference,
      userPreference,
      resetPreference,
      openConfigUnsaved
    }
  } = useNotificationsHomeContext()
  const [preferenceUpdated, setPreferenceUpdated] = useState(false)
  const buttonRef = useRef()
  const theme = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreferenceUpdated(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [preferenceUpdated])

  const handleSavePreference = () => {
    socketInstance.emit('set:preference', updatedPreference)
  }

  return !isEqual(userPreference, resetPreference) ||
    !isEqual(globalChannelPreference, resetGlobalChannelPreference) ? (
    <Box sx={{ m: 1, position: 'relative', flexGrow: '1' }}>
      <Button
        disableElevation
        variant={props?.varient || 'text'}
        ref={buttonRef}
        size='small'
        disabled={preferenceUpdated || openConfigUnsaved || props.disabled}
        onClick={handleSavePreference}
        disableRipple={true}
        sx={{
          ...(theme.palette.mode === 'dark'
            ? {
                color: '#fff !important'
              }
            : {})
        }}
        className='save-preferences-btn'
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
  ) : null
}

export default { PanelBody, PanelFooter, PanelHeader }
