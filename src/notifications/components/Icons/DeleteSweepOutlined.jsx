import * as React from 'react'
import { SvgIcon } from '@mui/material'

function DeleteSweepOutlined(props) {
  return (
    <SvgIcon className='delete-all-icon' viewBox='0 0 24 24' {...props}>
      <path d='M0 0h24v24H0V0z' fill='none' />
      <path d='M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zm2-8h6v8H5v-8zm5-6H6L5 5H2v2h12V5h-3z' />
    </SvgIcon>
  )
}

const MemoDeleteSweepOutlined = React.memo(DeleteSweepOutlined)

export default MemoDeleteSweepOutlined
