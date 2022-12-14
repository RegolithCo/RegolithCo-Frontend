import React, { useEffect } from 'react'
import { theme } from '../src/theme'
import { ThemeProvider, CssBaseline } from '@mui/material'

export const ThemeDecorator = (Story: React.FC): JSX.Element => {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap'
    document.querySelector('head')?.append(link)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  )
}
