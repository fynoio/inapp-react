import React from 'react'
import { Box, Typography, useTheme, Switch } from '@mui/material'
import { useNotificationsHomeContext } from '../../context'
export const GlobalPreference = ({ channels }) => {
  const theme = useTheme()
  const {
    data: { globalChannelPreference, updatedPreference },
    handlers: {
      setGlobalChannelPreference,
      setUserPreference,
      setUpdatedPreference
    }
  } = useNotificationsHomeContext()
  const setGlobalPreference = (channel, value) => {
    if (value === 'on') {
      setUserPreference((prev) => {
        let temp = { ...prev }
        Object.keys(prev.result).map((preference) => {
          prev.result[preference].map((section) => {
            if (section.channel_config[channel] === 'required') return
            if (section.preference[channel])
              section.preference[channel] =
                section.channel_config[channel] === 'off'
                  ? 'opted-out'
                  : section.channel_config[channel] === 'on'
                  ? 'opted-in'
                  : 'required'
            setUpdatedPreference((prev) => {
              let temp = { ...prev }
              if (!temp[section.subscription_id])
                temp[section.subscription_id] = {}

              temp[section.subscription_id][channel] =
                section.channel_config[channel] === 'off'
                  ? 'opted-out'
                  : section.channel_config[channel] === 'on'
                  ? 'opted-in'
                  : 'required'
              return temp
            })
          })
        })
        // temp.isDirty = true
        return temp
      })
    } else {
      setUserPreference((prev) => {
        let temp = { ...prev }
        // temp.isDirty = true
        return temp
      })
    }
    setUpdatedPreference((prev) => {
      let temp = { ...prev }
      if (!temp['all']) temp['all'] = {}
      temp['all'][channel] = value === 'on' ? 'opted-in' : 'opted-out'
      return temp
    })
    setGlobalChannelPreference((prev) => {
      const temp = { ...prev }
      temp[channel] = !temp[channel]
      return temp
    })
  }
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
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 2.5,
        gap: 2.5
      }}
    >
      {channels.map((channel) => (
        <Box
          sx={{
            display: 'flex',
            paddingX: 2.5,
            gap: 4,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              variant='text'
              sx={{ fontSize: '14px', fontWeight: 600 }}
              color={theme.palette.text.primary}
            >
              Notify me on {getFormattedLabel(channel)}
            </Typography>
            {globalChannelPreference[channel] ? (
              <Typography
                variant='text'
                sx={{ fontSize: '12px', fontWeight: 400 }}
                color={theme.palette.text.primary}
              >
                By enabling this, you will receive communications as per your
                preference.
              </Typography>
            ) : (
              <Typography
                variant='text'
                sx={{ fontSize: '12px', fontWeight: 400 }}
                color={theme.palette.text.primary}
              >
                By opting out, you won't receive any communications on this
                channel.
              </Typography>
            )}
          </Box>
          <Switch
            checked={!globalChannelPreference[channel]}
            onChange={() =>
              setGlobalPreference(
                channel,
                globalChannelPreference[channel] ? 'on' : 'off'
              )
            }
          />
        </Box>
      ))}
    </Box>
  )
}

export default GlobalPreference
