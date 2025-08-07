import * as React from 'react'
import { SvgIcon } from '@mui/material'

function ArrowBackIosNew(props) {
  return (
    <SvgIcon className='arrow-back-ios-icon' viewBox='0 0 24 24' {...props}>
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M17.77 3.77L16 2 6 12l10 10 1.77-1.77L9.54 12z' />
    </SvgIcon>
  )
}

const MemoArrowBackIosNew = React.memo(ArrowBackIosNew)

export default MemoArrowBackIosNew
