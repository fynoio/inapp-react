import React from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color:
      theme.palette.mode == 'light'
        ? theme.palette.common.black
        : theme.palette.common.grey800
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor:
      theme.palette.mode == 'light'
        ? theme.palette.common.black
        : theme.palette.common.grey800
  }
}))

export default CustomTooltip
