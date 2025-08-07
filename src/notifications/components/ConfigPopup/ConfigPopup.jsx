import React, { useEffect, useState, useRef } from 'react'
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
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
import MemoClose from '../Icons/Close'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import {
  PanelHeader,
  PanelBody,
  PreferenceSaveButton
} from '../ConfigComponents'
import CustomTooltip from '../CustomTooltip'

export const ConfigPopup = () => {
  const theme = useTheme()
  const buttonRef = useRef()
  const [preferenceUpdated, setPreferenceUpdated] = useState(false)

  const {
    data: {
      socketInstance,
      showConfig,
      preferenceMode,
      userPreference,
      resetPreference,
      openConfigUnsaved,
      resetGlobalChannelPreference,
      globalChannelPreference,
      updatedPreference
    },
    handlers: { setShowConfig, setOpenConfigUnsaved }
  } = useNotificationsHomeContext()

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
        Notification Preferences
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
          if (
            !isEqual(userPreference, resetPreference) ||
            !isEqual(globalChannelPreference, resetGlobalChannelPreference)
          )
            setOpenConfigUnsaved(true)
          else {
            setShowConfig(false)
          }
        }}
      >
        <MemoClose />
      </IconButton>
      <DialogContent dividers sx={{ padding: 0 }}>
        <PanelBody />
      </DialogContent>
      <DialogActions sx={{ alignSelf: 'center' }}>
        {!isEqual(userPreference, resetPreference) ||
        !isEqual(globalChannelPreference, resetGlobalChannelPreference) ? (
          <PreferenceSaveButton varient='contained' />
        ) : (
          <CustomTooltip title='No changes to save' placement='right'>
            <Box sx={{ m: 1, position: 'relative', flexGrow: '1' }}>
              <Button
                disableElevation
                variant='contained'
                size='small'
                disabled
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
            </Box>
          </CustomTooltip>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ConfigPopup
