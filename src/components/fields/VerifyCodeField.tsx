import * as React from 'react'
import { TextField } from '@mui/material'
import { yellow } from '@mui/material/colors'
import { fontFamilies } from '../../theme'

interface VerifyCodeFieldProps {
  code: string
}

export const VerifyCodeField: React.FC<VerifyCodeFieldProps> = ({ code }) => {
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
        console.error('Failed to copy text: ', err)
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
          fontSize: 40,
          color: yellow[400],
          textAlign: 'center',
        },
      }}
      sx={{
        textAlign: 'center',
        color: yellow[400],
        backogroundColor: '#ffffff',
        my: 4,
      }}
    />
  )
}
