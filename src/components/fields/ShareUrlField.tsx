import * as React from 'react'
import { TextField } from '@mui/material'
import { fontFamilies } from '../../theme'
import log from 'loglevel'

interface ShareUrlFieldProps {
  code: string
}

export const ShareUrlField: React.FC<ShareUrlFieldProps> = ({ code }) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const [helperText, setHelperText] = React.useState(' ')
  const handleClick = async () => {
    if (inputRef.current) {
      inputRef.current.select()
      try {
        await navigator.clipboard.writeText(inputRef.current.value)
        setHelperText('Copied to clipboard!')
        timeoutRef.current = setTimeout(() => {
          setHelperText(' ')
        }, 4000)
      } catch (err) {
        log.error('Failed to copy text: ', err)
      }
    }
  }

  return (
    <TextField
      inputRef={inputRef}
      fullWidth
      size="medium"
      value={code}
      contentEditable={false}
      helperText={helperText}
      onClick={handleClick}
      inputProps={{
        sx: {
          fontWeight: 'bold',
          fontFamily: fontFamilies.robotoMono,
          fontSize: 15,
          backgroundColor: '#00000077',
        },
      }}
    />
  )
}
