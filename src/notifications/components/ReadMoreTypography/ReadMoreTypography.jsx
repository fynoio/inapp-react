import React, { useState } from 'react'
import parse from 'html-react-parser'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'

const ReadMoreTypography = ({ renderBody }) => {
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()

  const MAX_CHARS = 150
  const isLong = renderBody?.length > MAX_CHARS

  const displayText = expanded ? renderBody : renderBody?.slice(0, MAX_CHARS)
  const toggleExpanded = () => setExpanded(!expanded)
  return (
    <React.Fragment>
      <Typography
        fontSize='12px'
        fontWeight={300}
        color={theme.palette.text.primary}
        className='notification-body'
      >
        {parse(displayText)}
        {isLong && !expanded && '...'}
      </Typography>

      {isLong && (
        <Link
          fontFamily={theme.typography.fontFamily}
          size='small'
          fontSize={'12px'}
          onClick={toggleExpanded}
          underline='none'
          sx={{
            color: theme.palette.primary.main,
            cursor: 'pointer',
            display: 'inline-block',
            marginTop: '2'
          }}
        >
          {expanded ? 'Show less' : 'Read more'}
        </Link>
      )}
    </React.Fragment>
  )
}

export default ReadMoreTypography
