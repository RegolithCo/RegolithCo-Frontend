import * as React from 'react'
import { Chip, useTheme } from '@mui/material'
import { fontFamilies } from '../../theme'

export type KeyShortcutProps = {
  keyStr: string
}

export const KeyShortcut: React.FC<KeyShortcutProps> = ({ keyStr }) => {
  const theme = useTheme()
  return (
    <Chip
      label={keyStr}
      sx={{
        px: 0.1,
        py: 0.1,
        mx: 0.5,
        fontFamily: fontFamilies.robotoMono,
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
        borderRadius: 1,
        // fontSize: '0.8rem',
        fontWeight: 'bold',
      }}
    />
  )
}
