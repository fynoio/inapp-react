import React from 'react'
import { Box, Typography, useTheme, Tooltip, Icon, Chip } from '@mui/material'
import { Lock, CheckCircle } from '@mui/icons-material'
import { useNotificationsHomeContext } from '../../context'
import CustomTooltip from '../CustomTooltip'
import { hexToRGBA } from '../../helpers/hextoRGBA'

export const PreferenceButton = (props) => {
  const getFormattedLabel = (label) => {
    switch (label) {
      case 'inapp':
        return 'In-App'
      case 'whatsapp':
        return 'WhatsApp'
      case 'sms':
        return 'SMS'
      case 'email':
        return 'Email'
      case 'push':
        return 'Push'
      case 'webpush':
        return 'WebPush'
      case 'slack':
        return 'Slack'
      case 'discord':
        return 'Discord'
      case 'teams':
        return 'Teams'
      case 'voice':
        return 'Voice'
    }
  }
  const {
    data: { globalChannelPreference },
    handlers: { setUserPreference, setUpdatedPreference }
  } = useNotificationsHomeContext()
  // console.log('Preference button type ', props.type)
  const chipClicked = (section, topic, type, label) => {
    if (type === 'required' || globalChannelPreference[label] === true) return
    setUserPreference((prev) => {
      const temp = { ...prev }
      // temp.isDirty = true
      // const new_config = type === 'opted-out' ? 'opted-in' : 'opted-out'

      const new_config = type === 'opted-out' ? 'opted-in' : 'opted-out'
      setUpdatedPreference((prev) => {
        let temp = { ...prev }
        if (!temp[topic.subscription_id]) temp[topic.subscription_id] = {}
        temp[topic.subscription_id][label] = new_config
        return temp
      })
      temp.result[section].filter(
        (subscription) => subscription.subscription_id === topic.subscription_id
      )[0].preference[label] = new_config
      return temp
    })
  }

  const theme = useTheme()
  const { section, topic, type, label, tooltip } = props
  let formattedLabel = getFormattedLabel(label)

  // console.log(
  //   'Cursor allowed',
  //   type,
  //   globalChannelPreference[label],
  //   type !== 'required' && !globalChannelPreference[label]
  // )
  return tooltip ? (
    <CustomTooltip
      title={
        type !== 'required' && globalChannelPreference[label]
          ? `${formattedLabel} is globally opted-out`
          : `${formattedLabel} is a required channel`
      }
    >
      <Box key={label} className='preference-btn'>
        <Chip
          key={label}
          label={
            <Typography
              variant='text'
              sx={{
                display: 'flex',
                gap: 0.5,
                alignItems: 'center',
                padding: 0
              }}
              color={theme.palette.text.primary}
              padding={0}
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
                    color={'primary'}
                    className='required-icon'
                  />
                ) : type === 'opted-in' ? (
                  <CheckCircle
                    sx={{
                      width: '.8em',
                      height: '.8em'
                    }}
                    color={'primary'}
                    className='opt-in-icon'
                  />
                ) : null}
              </Icon>
            </Typography>
          }
          color='primary'
          variant='outlined'
          sx={{
            '& .MuiChip-label': {
              pl: '8px',
              pr: type === 'opted-out' ? '8px' : '6px'
            },
            paddingX: 0,
            borderRadius: '5px',
            backgroundColor:
              type === 'opted-out'
                ? ''
                : hexToRGBA(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            ...(type !== 'opted-out'
              ? { borderColor: hexToRGBA(theme.palette.primary.main, 0.12) }
              : {}),
            ...(type !== 'required' && !globalChannelPreference[label]
              ? { cursor: 'pointer' }
              : { cursor: 'not-allowed' })
          }}
          disableRipple={true}
          disabled={
            type !== 'required' && (globalChannelPreference[label] || false)
          }
          onClick={() => chipClicked(section, topic, type, label)}
        />
      </Box>
    </CustomTooltip>
  ) : (
    <Chip
      key={label}
      label={
        <Typography
          variant='text'
          sx={{
            display: 'flex',
            gap: 0.5,
            alignItems: 'center',
            padding: 0
          }}
          color={theme.palette.text.primary}
          padding={0}
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
                color={'primary'}
              />
            ) : type === 'opted-in' ? (
              <CheckCircle
                sx={{
                  transition: 'transform 40ms ease 0ms',
                  width: '.8em',
                  height: '.8em'
                }}
                color={'primary'}
              />
            ) : null}
          </Icon>
        </Typography>
      }
      color='primary'
      variant='outlined'
      sx={{
        '& .MuiChip-label': {
          pl: '8px',
          pr: type === 'opted-out' ? '8px' : '6px'
        },
        paddingX: 0,
        borderRadius: '5px',
        backgroundColor:
          type === 'opted-out'
            ? theme.palette.mode === 'dark'
              ? ''
              : '#fff'
            : hexToRGBA(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main,
        ...(type !== 'opted-out'
          ? { borderColor: hexToRGBA(theme.palette.primary.main, 0.12) }
          : { borderColor: theme.palette.text.chip }),
        ...(type !== 'required' || !globalChannelPreference[label]
          ? { cursor: 'pointer' }
          : { cursor: 'not-allowed' })
      }}
      disableRipple={true}
      onClick={() => chipClicked(section, topic, type, label)}
    />
  )
}

export default PreferenceButton
