import * as React from 'react'
import { SvgIcon } from '@mui/material'

function Check(props) {
  return (
    <SvgIcon className='check-icon' viewBox='0 0 24 24' {...props}>
      <path d='M0 0h24v24H0z' fill='none' />
      <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
    </SvgIcon>
  )
}

const MemoCheck = React.memo(Check)

export default MemoCheck
