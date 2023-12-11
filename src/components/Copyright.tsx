import * as React from 'react'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material'

export function Copyright() {
  const theme = useTheme()
  return (
    <Typography
      variant="body2"
      component="div"
      color="text.secondary"
      align="right"
      sx={{
        [theme.breakpoints.up('md')]: {
          fontSize: 10,
        },
      }}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://regolith.rocks/about/general" target="_blank">
        Regolith Co.
      </Link>{' '}
      {new Date().getFullYear() + 930}
      {'.'}
    </Typography>
  )
}
