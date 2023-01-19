import * as React from 'react'
import { TextField, useTheme } from '@mui/material'
import { yellow } from '@mui/material/colors'
import { validateSCName } from '@orgminer/common'

interface SCUsernameFieldProps {
  defaultValue?: string | null
  onChange?: (value: string | null) => void
  onSubmit?: () => void
}

export const SCUsernameField: React.FC<SCUsernameFieldProps> = ({ defaultValue, onChange, onSubmit }) => {
  const theme = useTheme()
  const [userNameValid, setUserNameValid] = React.useState(true)
  return (
    <TextField
      fullWidth
      size="medium"
      autoFocus
      placeholder="Star Citizen username"
      error={!userNameValid}
      defaultValue={defaultValue}
      helperText={!userNameValid ? 'Invalid Star Citizen username' : 'Enter your new Star Citizen username'}
      onChange={(event) => {
        const newValue = event.target.value || ''
        const isValid = validateSCName(newValue)
        setUserNameValid(isValid)
        // Make sure nothing invalid gets passed up
        if (onChange) onChange(isValid ? newValue : null)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && onSubmit) onSubmit()
      }}
      inputProps={{
        sx: {
          color: theme.palette.getContrastText(yellow[600]),
          background: yellow[600],
          fontSize: 40,
          lineHeight: 1,
          fontWeight: 'bold',
          py: 0,
          textAlign: 'center',
          border: '4px solid pink',
          borderImage: `repeating-linear-gradient(
            -45deg,
            #000,
            #000 10px,
            #ffb101 10px,
            #ffb101 20px
          ) 10`,
        },
      }}
      sx={{
        my: 4,
      }}
    />
  )
}
