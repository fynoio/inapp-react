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
  Tooltip,
  Button,
  Collapse,
  CircularProgress,
  Paper
} from '@mui/material'
import { useNotificationsHomeContext } from '../../context'
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
            fontWeight: '500'
          }}
        >
          Notification Settings
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
  const sectionsArr = Object.keys(userPreference.result)
  const xs = useMediaQuery(theme.breakpoints.up('sm'))
  const handleSelectAll = (topic, section, type) => {
    setUserPreference((prev) => {
      const temp = { ...prev }
      // temp.isDirty = true
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
    if (xs) {
      if (openConfigUnsaved) {
        height = height + 5
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
        position: 'relative',
        overflow: 'auto',
        justifyContent: sectionsArr.length > 0 ? 'flex-start' : 'center'
      }}
      className='fyno-user-preferences-container'
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
                  setUserPreference(cloneDeep(resetPreference))
                  setGlobalChannelPreference(
                    cloneDeep(resetGlobalChannelPreference)
                  )
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
                  socketInstance.emit('set:preference', updatedPreference)
                }}
              >
                Yes
              </Button>
            </Tooltip>
          </Box>
        </Paper>
      </Collapse>
      {globalChannelPreference &&
        Object.keys(globalChannelPreference).length > 0 && (
          <GlobalPreference channels={Object.keys(globalChannelPreference)} />
        )}
      {sectionsArr.length > 0 ? (
        <Box sx={{ opacity: openConfigUnsaved ? '50%' : '100%' }}>
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
                        // console.log(
                        //   channel[0],
                        //   channel[1] === 'opted-in' ||
                        //     (globalChannelPreference[channel[0]] &&
                        //       globalChannelPreference[channel[0]] === false)
                        // )
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
            No preferences available at the moment
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export const PanelFooter = () => {
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
  console.log(props)
  useEffect(() => {
    setTimeout(() => {
      setPreferenceUpdated(false)
    }, 1000)
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
